import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname } from "node:path";
import { randomUUID } from "node:crypto";
import { analyze, compileWorkbook, createDecision, inferMappings, ingestCsvSources, reconcile, xlsxToSourceFile } from "../../packages/core/dist/index.js";
import { loadRuns, saveRun } from "./store.mjs";

const runs = await loadRuns();
const profile = { id: "redwood-physician-group-qor-draft-v0.1", name: "Redwood Physician Group QoR DRAFT v0.1", version: "0.1.0", status: "engineering-hypothesis-not-professionally-approved", arithmeticToleranceCents: 1n, ageingBasis: "service_date", recoveryMethod: "age_bucket_rates", recoveryRates: { "0-30": 0.9, "31-60": 0.7, "61-90": 0.5, "91-120": 0.3, "121+": 0.1 } };
const json = (response, status, value) => { response.writeHead(status, { "content-type": "application/json" }); response.end(JSON.stringify(value, (_, item) => typeof item === "bigint" ? item.toString() : item)); };
const body = async (request) => { const chunks = []; for await (const chunk of request) chunks.push(chunk); return JSON.parse(Buffer.concat(chunks).toString("utf8")); };
const mime = { ".html": "text/html; charset=utf-8", ".js": "application/javascript; charset=utf-8", ".css": "text/css; charset=utf-8" };
function publicPath(pathname) { return pathname === "/" ? "index.html" : pathname.replace(/^\//, ""); }

createServer(async (request, response) => {
  try {
    const url = new URL(request.url, "http://localhost");
    if (request.method === "GET" && url.pathname === "/api/method-profile") return json(response, 200, profile);
    if (request.method === "POST" && url.pathname === "/api/runs") {
      const input = await body(request); const candidates = input.files.filter((file) => ["claims", "payments", "adjustments", "ar_snapshot", "general_ledger"].includes(file.type) && typeof file.content === "string"); const accepted = await Promise.all(candidates.map((file) => file.format === "xlsx" ? xlsxToSourceFile({ name: file.name, type: file.type, content: Buffer.from(file.content, "base64"), worksheet: file.worksheet }) : file));
      const mappings = accepted.flatMap((file) => inferMappings(file, profile.version)); const deal = ingestCsvSources(input.dealId || `ENG-${new Date().getFullYear()}`, accepted); const analysis = analyze(deal, profile); const { reconciliations, findings } = reconcile(deal, profile); const id = randomUUID(); const run = { id, deal, analysis, reconciliations, findings, mappings, decisions: [], profile, createdAt: new Date().toISOString() }; runs.set(id, run); await saveRun(run); return json(response, 201, run);
    }
    const mapping = url.pathname.match(/^\/api\/runs\/([^/]+)\/mappings\/([^/]+)\/approve$/);
    if (request.method === "POST" && mapping) { const run = runs.get(mapping[1]); if (!run) return json(response, 404, { error: "Analysis run not found" }); const input = await body(request); const record = run.mappings.find((item) => item.id === mapping[2]); if (!record) return json(response, 404, { error: "Mapping decision not found" }); if (!input.reviewer) return json(response, 400, { error: "Reviewer identity is required" }); record.reviewStatus = "approved"; record.reviewer = input.reviewer; record.timestamp = new Date().toISOString(); await saveRun(run); return json(response, 200, record); }
    const decision = url.pathname.match(/^\/api\/runs\/([^/]+)\/decisions$/);
    if (request.method === "POST" && decision) { const run = runs.get(decision[1]); if (!run) return json(response, 404, { error: "Analysis run not found" }); const input = await body(request); const record = createDecision({ runId: run.id, methodProfileId: profile.id, methodVersion: profile.version, gate: input.gate, decision: input.decision, reviewer: input.reviewer, role: input.role, rationale: input.rationale, evidenceReferences: input.evidenceReferences ?? [] }); run.decisions.push(record); await saveRun(run); return json(response, 201, record); }
    const workbook = url.pathname.match(/^\/api\/runs\/([^/]+)\/workbook$/);
    if (request.method === "GET" && workbook) { const run = runs.get(workbook[1]); if (!run) return json(response, 404, { error: "Analysis run not found" }); const file = await compileWorkbook({ deal: run.deal, analysis: run.analysis, reconciliations: run.reconciliations, findings: run.findings, methodId: profile.id, methodVersion: profile.version, runId: run.id, recoveryRates: profile.recoveryRates }); response.writeHead(200, { "content-type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "content-disposition": `attachment; filename=redwood-${run.id}.xlsx` }); return response.end(file); }
    const lookup = url.pathname.match(/^\/api\/runs\/([^/]+)$/);
    if (request.method === "GET" && lookup) { const run = runs.get(lookup[1]); return run ? json(response, 200, run) : json(response, 404, { error: "Analysis run not found" }); }
    if (request.method === "GET") { const path = publicPath(url.pathname); if (path.includes("..")) return json(response, 400, { error: "Invalid path" }); const content = await readFile(new URL(`./public/${path}`, import.meta.url)); response.writeHead(200, { "content-type": mime[extname(path)] || "application/octet-stream" }); return response.end(content); }
    json(response, 404, { error: "Not found" });
  } catch (error) { json(response, 400, { error: error instanceof Error ? error.message : "Unexpected error" }); }
}).listen(process.env.PORT || 4173, () => console.log(`Redwood Workbench: http://127.0.0.1:${process.env.PORT || 4173}`));
