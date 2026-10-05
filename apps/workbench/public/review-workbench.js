const esc = (value) => String(value ?? "").replace(/[&<>\"]/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;" }[character]));

function isActive(record, run) {
  return !record.invalidatedAt && (!record.dependencyFingerprint || record.dependencyFingerprint === run.dependencyFingerprint);
}

function buildReviewItems(run) {
  const items = [];
  (run.mappings ?? []).filter(mapping => mapping.reviewStatus !== "approved").forEach(mapping => items.push({
    id: `mapping:${mapping.id}`, kind: "mapping", layer: "Candidate", title: `${mapping.sourceType} · ${mapping.sourceField}`, status: mapping.reviewStatus, gate: "G2", evidence: mapping.evidence, detail: `Canonical target: ${mapping.canonicalField ?? "Unmapped"}. Mapping decisions create a successor run.`, source: mapping
  }));
  (run.findings ?? []).filter(finding => finding.status === "open").forEach(finding => items.push({
    id: `finding:${finding.id}`, kind: "finding", layer: "Candidate", title: finding.title, status: finding.status, gate: finding.kind === "reconciliation" ? "G3 / G6" : "G6", evidence: finding.references.join("; "), detail: finding.detail, source: finding
  }));
  (run.gates ?? []).filter(gate => ["G3", "G5", "G6", "G7"].includes(gate.gate) && gate.status !== "passed").forEach(gate => items.push({
    id: `gate:${gate.gate}`, kind: "gate", layer: "Candidate", title: `${gate.gate} decision required`, status: gate.status, gate: gate.gate, evidence: "Record source, reconciliation, and workpaper references supporting the decision.", detail: gate.rationale, source: gate
  }));
  return items;
}

function decisionHistory(run) {
  return (run.decisions ?? []).map(decision => `<li><span class="review-state ${isActive(decision, run) ? "active" : "stale"}">${isActive(decision, run) ? "Active" : "Superseded"}</span> <strong>${esc(decision.gate)} · ${esc(decision.decision)}</strong> — ${esc(decision.reviewer)}, ${esc(decision.role)}<br><small>${esc(decision.rationale)}${decision.invalidatedAt ? ` · ${esc(decision.invalidationReason ?? "Invalidated")}` : ""}</small></li>`).join("") || "<li>No review decision recorded.</li>";
}

function dispositionHistory(run, findingId) {
  return (run.dispositions ?? []).filter(item => item.findingId === findingId).map(item => `<li><span class="review-state ${isActive(item, run) ? "active" : "stale"}">${isActive(item, run) ? "Active" : "Superseded"}</span> <strong>${esc(item.decision)}</strong> — ${esc(item.reviewer)}, ${esc(item.role)}<br><small>${esc(item.rationale)}${item.invalidatedAt ? ` · ${esc(item.invalidationReason ?? "Invalidated")}` : ""}</small></li>`).join("") || "<li>No finding disposition recorded.</li>";
}

function detail(item, run) {
  if (!item) return `<div class="review-empty"><h3>Select a review item</h3><p>The queue separates observed evidence, derived results, reviewer candidates, and active approvals. It does not approve anything automatically.</p></div>`;
  const evidence = `<section><span class="eyebrow">Observed evidence</span><p>${esc(item.evidence || "No linked evidence reference recorded.")}</p></section>`;
  if (item.kind === "mapping") return `<div class="review-detail-body"><span class="review-layer candidate">Candidate</span><h3>${esc(item.title)}</h3><p>${esc(item.detail)}</p>${evidence}<section><span class="eyebrow">Decision boundary</span><p>Review or revise this mapping in Map. Approval creates a successor run; it does not alter this run.</p><button type="button" data-open-map>Open mapping review</button></section></div>`;
  if (item.kind === "finding") return `<div class="review-detail-body"><span class="review-layer candidate">Candidate</span><h3>${esc(item.title)}</h3><p>${esc(item.detail)}</p>${evidence}<section><span class="eyebrow">Prior dispositions</span><ul>${dispositionHistory(run, item.source.id)}</ul></section><form id="disposition"><input type="hidden" name="findingId" value="${esc(item.source.id)}"><div class="grid"><label>Disposition<select name="decision"><option value="reviewed">Reviewed</option><option value="resolved">Resolved</option><option value="accepted_with_exception">Accepted with exception</option></select></label><label>Reviewer<input required name="reviewer"></label><label>Role<input required name="role" value="Advisor"></label></div><label>Rationale<input required name="rationale" placeholder="Explain the professional basis"></label><label>Evidence references (comma-separated)<input required name="evidenceReferences" placeholder="Source file/hash/row or workpaper reference"></label><button class="action">Record disposition</button></form></div>`;
  return `<div class="review-detail-body"><span class="review-layer candidate">Candidate</span><h3>${esc(item.title)}</h3><p>${esc(item.detail)}</p>${evidence}<section><span class="eyebrow">Active and superseded decisions</span><ul>${decisionHistory(run)}</ul></section><form id="decision"><input type="hidden" name="gate" value="${esc(item.gate)}"><div class="grid"><label>Decision<select name="decision"><option value="noted">Noted</option><option value="approved">Approved</option><option value="rejected">Rejected</option></select></label><label>Reviewer<input required name="reviewer"></label><label>Role<input required name="role" value="Advisor"></label></div><label>Rationale<input required name="rationale" placeholder="Explain the professional basis"></label><label>Evidence references (comma-separated)<input required name="evidenceReferences" placeholder="Source file/hash/row or workpaper reference"></label><button class="action">Record decision</button></form></div>`;
}

window.renderReviewWorkbench = function renderReviewWorkbench() {
  const run = window.redwoodState?.run;
  if (!run) return `<div class="warning"><strong>Analysis run required.</strong><p>Start at Intake. Redwood cannot show review work without source evidence.</p></div>`;
  const items = buildReviewItems(run);
  const selected = items.find(item => item.id === window.redwoodState.reviewSelection) ?? items[0];
  if (selected) window.redwoodState.reviewSelection = selected.id;
  const gateChips = (run.gates ?? []).map(gate => `<span class="review-gate ${gate.status === "passed" ? "passed" : "open"}">${esc(gate.gate)} ${esc(gate.status)}</span>`).join("");
  return `<span class="eyebrow">Professional review · run-bound</span><div class="review-context"><div><h2>Review queue</h2><p>Run ${esc(run.id)} · method ${esc(run.profile?.id)} ${esc(run.profile?.version)} · fingerprint ${esc((run.dependencyFingerprint ?? "Unavailable").slice(0, 12))}</p></div><div class="review-gates">${gateChips}</div></div><p class="review-boundary">Observed evidence and derived calculations are never professional conclusions. A candidate requires a named, evidence-backed decision; approval is active only for this run and fingerprint.</p>${window.recoveryMethodReviewPresentation ? window.recoveryMethodReviewPresentation(run) : ""}<div class="review-workbench"><section class="review-queue"><h3>Action required <span>${items.length}</span></h3>${items.length ? items.map(item => `<button type="button" class="review-item ${item.id === selected?.id ? "selected" : ""}" data-review-item="${esc(item.id)}"><span class="review-layer ${item.layer.toLowerCase()}">${esc(item.layer)}</span><strong>${esc(item.title)}</strong><small>${esc(item.gate)} · ${esc(item.status)}</small></button>`).join("") : "<p class=\"ok\">No candidate review items for this run.</p>"}</section><section class="review-detail">${detail(selected, run)}</section></div>`;
};

window.mountReviewWorkbench = function mountReviewWorkbench() {
  document.querySelectorAll("[data-review-item]").forEach(button => button.addEventListener("click", () => { window.redwoodState.reviewSelection = button.dataset.reviewItem; window.render(); }));
  document.querySelector("[data-open-map]")?.addEventListener("click", () => document.querySelector('nav button[data-phase="Map"]')?.click());
};
