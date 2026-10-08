/* Approved Design 004 source-first presentation. Canonical run data is read-only. */
let run;
const state = { lens: "workbench", drawer: null, reviewItem: null };
const query = new URLSearchParams(location.search);
if (["workbench", "review", "decision"].includes(query.get("view"))) state.lens = query.get("view");

const paths = {
  overview: '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>',
  evidence: '<path d="M6 3h9l4 4v14H6zM14 3v5h5M9 12h7M9 16h7"/>',
  reconcile: '<path d="M3 7h15l-3-3M21 17H6l3 3M18 7l-3 3M6 17l3-3"/>',
  analysis: '<path d="M4 3v18h17M8 16v-5M13 16V6M18 16v-8"/>',
  review: '<path d="M8 4h11v17H5V4h3M8 2h7v4H8zM8 13l2 2 5-5"/>',
  export: '<path d="M12 3v12M8 11l4 4 4-4M4 16v5h16v-5"/>',
  arrow: '<path d="M4 12h16M15 7l5 5-5 5"/>', close: '<path d="m6 6 12 12M6 18 18 6"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>', migration: '<path d="M4 5h7v14H4zM15 5h5v14h-5M11 12h4M12 9l3 3-3 3"/>'
};
const phases = [["Intake", "Intake"], ["Map", "Map"], ["Reconcile", "Reconcile"], ["Migration evidence", "Migration"], ["Analyze", "Analyze"], ["Review", "Review"], ["Export", "Export"]];
const icon = name => `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${paths[name] || paths.evidence}</svg>`;
const esc = value => String(value ?? "Unavailable").replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
const list = value => Array.isArray(value) ? value : [];
const unavailable = value => value === undefined || value === null || value === "" ? "Unavailable" : String(value);
const status = (label, tone = "") => `<span class="status ${tone}">${esc(unavailable(label))}</span>`;
const tag = label => `<span class="tag">${esc(unavailable(label))}</span>`;
const link = (label, action) => `<button class="text-btn" data-action="${esc(action)}">${esc(label)}${icon("arrow")}</button>`;
const money = value => {
  const currency = run?.scope?.currency;
  if (typeof value !== "number" || !Number.isFinite(value) || typeof currency !== "string" || !/^[A-Z]{3}$/.test(currency)) return "Unavailable";
  try { return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(value / 100); }
  catch { return "Unavailable"; }
};
const control = id => list(run?.reconciliations).find(item => item?.id === id);
const finding = id => list(run?.findings).find(item => item?.id === id);
const identity = () => unavailable(run?.scope?.dealId ?? run?.id);
const phaseFor = label => phases.find(([name]) => name === label)?.[1] || label;
const nextUrl = label => `/next/?run=${encodeURIComponent(run.id)}&phase=${encodeURIComponent(phaseFor(label))}`;

function header() {
  const scope = run?.scope || {};
  const period = [scope.analysisPeriodStart, scope.analysisPeriodEnd].filter(Boolean).join(" – ");
  const subtitle = [scope.entityScope && list(scope.entityScope).join(", "), period].filter(Boolean).join(" · ");
  return `<div class="page-head"><div><h1>${esc(identity())}</h1><p class="qor-title">Canonical persisted run</p>${subtitle ? `<p class="sub">${esc(subtitle)}</p>` : ""}<div class="title-note">${status(run?.id ? "Run loaded" : "Run identity unavailable", run?.id ? "" : "pending")}<span class="sub">Run · ${esc(unavailable(run?.id))}</span></div></div><div class="qor-head-actions">${link("Open workflow access", "workflow:Reconcile")}<button class="record-button" data-action="record">Run record ${icon("evidence")}</button></div></div>`;
}
function shell() {
  document.body.classList.toggle("workspace-with-evidence", state.drawer?.type === "evidence");
  const controls = list(run?.reconciliations);
  const sources = list(run?.sourceInventory);
  const findings = list(run?.findings);
  document.getElementById("app").innerHTML = `<aside class="sidebar" aria-label="Run navigation"><div class="brand"><span class="brandmark" aria-hidden="true"><i></i><i></i><i></i></span><span class="wordmark">redwood</span></div><div class="engagement"><strong>${esc(identity())}</strong><small>Canonical run</small></div><div class="caption">Run workspace</div><nav class="nav"><button class="active" data-action="engagement" aria-current="page">${icon("overview")}<span>Engagement</span></button><button data-action="inventory">${icon("evidence")}<span>Evidence</span><span class="count">${sources.length}</span></button><div class="nav-sub"><button data-action="workflow:Intake">Intake</button><button data-action="workflow:Map">Map</button></div><button data-action="workflow:Reconcile">${icon("reconcile")}<span>Reconciliation</span><span class="count">${controls.length}</span></button><button data-action="workflow:Migration evidence">${icon("migration")}<span>Migration evidence</span></button><button data-action="workflow:Analyze">${icon("analysis")}<span>Analysis</span></button><button data-action="workflow:Review">${icon("review")}<span>Review</span><span class="count">${findings.length}</span></button><button data-action="workflow:Export">${icon("export")}<span>Deliverables</span></button></nav></aside><div class="shell"><header class="topbar"><div class="breadcrumb"><span>Engagements</span><span>/</span><strong>${esc(identity())}</strong><span>/</span><span>Canonical run</span></div><div class="top-right"><div class="lens" aria-label="Presentation lens"><button class="${state.lens === "workbench" ? "active" : ""}" data-action="lens:workbench">Workbench</button><button class="${state.lens === "review" ? "active" : ""}" data-action="lens:review">Review</button><button class="${state.lens === "decision" ? "active" : ""}" data-action="lens:decision">Decision</button></div><button class="workspace-btn" data-action="navigation">${icon("menu")}<span>Workflow</span></button></div></header><main id="main" class="main">${header()}${state.lens === "workbench" ? workbench() : state.lens === "review" ? review() : decision()}</main></div>${state.drawer ? drawer() : ""}`;
}
function controlRow(item) {
  const difference = money(item?.difference);
  const arithmetic = unavailable(item?.arithmeticStatus);
  const materiality = unavailable(item?.materialityStatus);
  return `<article class="control-record ${arithmetic === "difference" ? "open" : ""} ${state.drawer?.id === item?.id ? "selected" : ""}"><div class="control-record-top"><h3>${esc(unavailable(item?.label))}</h3><button class="difference" data-action="evidence:${esc(item?.id)}">${esc(difference)}</button></div><div class="population-comparison"><div><div class="population-value">${esc(money(item?.leftTotal))}</div><div class="population-name">${esc(unavailable(item?.leftDefinition))}</div></div><div class="link-line ${arithmetic === "difference" ? "difference-line" : ""}" aria-hidden="true"></div><div><div class="population-value">${esc(money(item?.rightTotal))}</div><div class="population-name">${esc(unavailable(item?.rightDefinition))}</div></div></div><div class="control-bottom">${status(arithmetic, arithmetic === "difference" ? "disputed" : "")}<span class="muted">Materiality · ${esc(materiality)}</span>${link("Inspect evidence", `evidence:${item?.id}`)}</div></article>`;
}
function workbench() {
  const controls = list(run?.reconciliations), findings = list(run?.findings);
  return `<div class="engagement-state"><span><b>${list(run?.sourceInventory).length}</b> source records</span><span><b>${controls.length}</b> reconciliation controls</span><span><b>${findings.length}</b> findings</span>${link("Workflow access", "navigation")}</div><div class="overview-grid"><section aria-labelledby="financial-heading"><div class="section-title"><h2 id="financial-heading">Recorded reconciliation controls</h2><small>Values are reported directly from the canonical run.</small></div><div class="qor-control-sheet"><div class="control-caption"><b>${controls.length} recorded comparisons</b><span>Canonical currency · ${esc(unavailable(run?.scope?.currency))}</span></div><div class="control-column-head"><span>Recorded populations</span><span>Difference</span></div>${controls.length ? controls.map(controlRow).join("") : `<p class="data-limit">No reconciliation controls are available in this run.</p>`}</div></section><section class="supports"><div class="section-title"><h2>Recorded findings</h2>${link("Inspect records", "inventory")}</div>${findings.length ? findings.map(item => `<div class="finding-row"><span class="finding-id">${esc(unavailable(item?.id))}</span><div>${tag(item?.status)}<h3>${esc(unavailable(item?.title))}</h3><p>${esc(unavailable(item?.detail))}</p></div>${item?.id ? link("Inspect", `finding:${item.id}`) : ""}</div>`).join("") : `<p class="data-limit">No findings are available in this run.</p>`}</section></div>`;
}
function review() {
  const findings = list(run?.findings);
  const selected = finding(state.reviewItem) || findings[0];
  return `<div class="section-title"><h2>Run-bound review items</h2><small>Professional conclusions are not inferred by this presentation.</small></div><div class="review-layout"><nav class="review-index">${findings.length ? findings.map(item => `<button class="review-item ${selected?.id === item?.id ? "active" : ""}" data-action="finding:${esc(item?.id)}">${status(item?.status)}<strong>${esc(unavailable(item?.title))}</strong><small>${esc(unavailable(item?.id))}</small></button>`).join("") : `<p class="data-limit">No findings are available in this run.</p>`}</nav><section class="review-body">${selected ? `${tag(selected.status)}<h2>${esc(unavailable(selected.title))}</h2><p class="lead">${esc(unavailable(selected.detail))}</p><div class="review-block"><h3>Recorded references</h3><p>${esc(list(selected.references).join("; ") || "Unavailable")}</p></div>${link("Inspect canonical workflow", "workflow:Review")}` : `<h2>No review item is available</h2><p>The canonical run supplies no finding to inspect.</p>`}</section></div>`;
}
function decision() {
  const gates = list(run?.gates);
  return `<div class="decision-layout"><section><p class="decision-summary">This presentation reports canonical run state; it does not create a conclusion, decision, or release authority.</p><article class="responsible-statement"><h3>Recorded gates</h3>${gates.length ? `<div class="readiness-list">${gates.map(gate => `<div><span>${esc(unavailable(gate?.gate))}</span>${status(gate?.status, gate?.status === "blocked" ? "disputed" : "")}</div>`).join("")}</div>` : `<p>No gate records are available in this run.</p>`}</article><article class="responsible-statement"><h3>Workflow boundary</h3><p>Use the existing Workbench workflow to inspect or act on canonical run state.</p>${link("Open Review workflow", "workflow:Review")}</article></section></div>`;
}
function drawer() {
  const title = state.drawer.type === "evidence" ? "Reconciliation evidence" : state.drawer.type === "inventory" ? "Source inventory" : state.drawer.type === "record" ? "Canonical run record" : "Existing workflow access";
  return `<div class="drawer-backdrop" data-action="close" aria-hidden="true"></div><aside class="drawer ${state.drawer.type === "evidence" ? "evidence-drawer" : ""}" role="dialog" aria-modal="true"><div class="drawer-header"><div><span class="caption">${esc(identity())}</span><h2>${title}</h2></div><button class="icon-btn" data-action="close" aria-label="Close panel">${icon("close")}</button></div><div class="drawer-body">${state.drawer.type === "evidence" ? evidenceDrawer(control(state.drawer.id)) : state.drawer.type === "inventory" ? inventoryDrawer() : state.drawer.type === "record" ? recordDrawer() : navigationDrawer()}</div><footer class="drawer-footer"><span>Canonical run · read only</span></footer></aside>`;
}
function evidenceDrawer(item) {
  if (!item) return `<section class="drawer-section"><h3>Evidence unavailable</h3><p>The selected reconciliation control is not present in this canonical run.</p></section>`;
  return `<div class="drawer-summary">${tag(item.arithmeticStatus)}<div class="value numeric">${esc(money(item.difference))}</div><h3>${esc(unavailable(item.label))}</h3></div><section class="drawer-section"><h3>Recorded comparison</h3><dl class="detail-table">${[["Left population", item.leftDefinition], ["Recorded left total", money(item.leftTotal)], ["Right population", item.rightDefinition], ["Recorded right total", money(item.rightTotal)], ["Arithmetic status", item.arithmeticStatus], ["Materiality", item.materialityStatus], ["Evidence references", item.evidenceCount]].map(([label, value]) => `<div class="detail-row"><dt>${esc(label)}</dt><dd>${esc(unavailable(value))}</dd></div>`).join("")}</dl></section>`;
}
function inventoryDrawer() {
  const sources = list(run?.sourceInventory);
  return `<div class="drawer-summary"><h3>${sources.length} recorded sources</h3><p>General inventory does not substitute for figure-specific lineage.</p></div><section class="drawer-section">${sources.length ? sources.map(source => `<details class="source-record"><summary><strong>${esc(unavailable(source?.name))}</strong><small>${esc(unavailable(source?.classification))}</small></summary><p class="technical-value">${esc(unavailable(source?.hash))}</p><p>Recorded size · ${esc(unavailable(source?.size))} bytes</p></details>`).join("") : `<p>No source inventory is available in this run.</p>`}</section>`;
}
function recordDrawer() {
  const scope = run?.scope || {};
  return `<div class="drawer-summary"><h3>${esc(identity())}</h3><p>Canonical persisted run</p></div><section class="drawer-section"><h3>Scope as recorded</h3><dl class="detail-table">${[["Analysis period start", scope.analysisPeriodStart], ["Analysis period end", scope.analysisPeriodEnd], ["Valuation date", scope.valuationDate], ["Currency", scope.currency], ["Entity scope", list(scope.entityScope).join(", ")]].map(([label, value]) => `<div class="detail-row"><dt>${esc(label)}</dt><dd>${esc(unavailable(value))}</dd></div>`).join("")}</dl></section><section class="drawer-section"><h3>Technical identifiers</h3><p class="technical-value">Run · ${esc(unavailable(run?.id))}<br>Method · ${esc(unavailable(run?.profile?.id))}<br>Version · ${esc(unavailable(run?.profile?.version))}</p></section>`;
}
function navigationDrawer() {
  return `<div class="drawer-summary"><h3>Existing Workbench workflow</h3><p>Each hand-off opens the existing <code>/next/</code> route for this canonical run.</p><p class="data-limit">The existing route accepts the run parameter but does not currently apply a phase query parameter. The requested phase is retained in the URL for disclosure; select the phase in that route.</p></div><div class="navigation-list">${phases.map(([label]) => `<button data-action="workflow:${esc(label)}"><span>${esc(label)}<small>Open existing workflow</small></span>${icon("arrow")}</button>`).join("")}</div>`;
}
function openDrawer(type, id = null) { state.drawer = { type, id }; shell(); document.querySelector(".drawer .icon-btn")?.focus(); }
function closeDrawer() { state.drawer = null; shell(); }
function openWorkflow(label) {
  const url = nextUrl(label);
  const disclosed = `Opening the existing Workbench with canonical run ${run.id}. Its current /next/ route does not apply phase query parameters; phase=${phaseFor(label)} is retained in the URL and must be selected there.`;
  window.alert(disclosed);
  location.assign(url);
}
document.addEventListener("click", event => {
  const element = event.target.closest("[data-action]");
  if (!element) return;
  const action = element.dataset.action;
  if (action === "close" || action === "engagement") return closeDrawer();
  if (action.startsWith("lens:")) { state.lens = action.slice(5); state.drawer = null; shell(); window.scrollTo(0, 0); return; }
  if (action.startsWith("evidence:")) return openDrawer("evidence", action.slice(9));
  if (action.startsWith("finding:")) { state.reviewItem = action.slice(8); state.lens = "review"; state.drawer = null; shell(); return; }
  if (action === "record" || action === "inventory" || action === "navigation") return openDrawer(action);
  if (action.startsWith("workflow:")) return openWorkflow(action.slice(9));
});
document.addEventListener("keydown", event => { if (event.key === "Escape" && state.drawer) closeDrawer(); });
async function loadCanonicalRun() {
  const runId = query.get("run");
  if (!runId) { document.getElementById("app").innerHTML = `<main id="main" class="main"><section class="condition"><div><strong>Canonical run required</strong><p>Provide <code>?run=&lt;run-id&gt;</code> to inspect an existing persisted Redwood run. This design provides no default engagement or fallback financial data.</p></div></section></main>`; return; }
  try {
    const response = await fetch(`/api/runs/${encodeURIComponent(runId)}`);
    const body = await response.json().catch(() => null);
    if (!response.ok || !body || typeof body !== "object") throw new Error(body?.error || `Canonical run request failed (${response.status})`);
    run = body;
    shell();
  } catch (error) {
    document.getElementById("app").innerHTML = `<main id="main" class="main"><section class="condition"><div><strong>Canonical run unavailable</strong><p>${esc(error.message)}. This design does not provide fallback financial data. Supply a canonical run with <code>?run=&lt;run-id&gt;</code>.</p></div></section></main>`;
  }
}
loadCanonicalRun();
