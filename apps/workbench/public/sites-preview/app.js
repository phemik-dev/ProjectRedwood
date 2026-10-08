(() => {
  const state = { run: null, lens: "work", selectedReconciliation: null, navOpen: false };
  const $ = selector => document.querySelector(selector);
  const escapeHtml = value => String(value ?? "").replace(/[&<>\"]/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[character]));
  const formatCents = value => value === null || value === undefined || value === "" ? "Unavailable" : new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(value) / 100);
  const gateClass = status => status === "passed" ? "pass" : status === "blocked" ? "blocked" : "open";
  const api = async path => {
    const response = await fetch(path, { headers: { accept: "application/json" } });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(body.error || `Request failed (${response.status})`);
    return body;
  };
  function setNotice(message, error = false) {
    $("#notice").innerHTML = message ? `<div class="notice ${error ? "error" : ""}">${escapeHtml(message)}</div>` : "";
  }
  function gates() { return state.run?.gates ?? []; }
  function setPhaseLinks() {
    const query = state.run ? `?run=${encodeURIComponent(state.run.id)}` : "";
    document.querySelectorAll("[data-phase-link]").forEach(link => { link.href = `/next/index.html${query}`; });
  }
  function renderHeader() {
    const run = state.run;
    $("#engagement-title").textContent = run?.scope?.dealId ?? "Canonical engagement required";
    $("#engagement-subtitle").textContent = run ? `Canonical persisted run ${run.id} · ${run.profile?.id ?? "method unavailable"} ${run.profile?.version ?? ""}` : "Open this preview with ?run=… to load an existing persisted run.";
    $("#run-meta").innerHTML = run ? `<span>Read-only Sites composition · canonical run <code>${escapeHtml(run.id)}</code></span>` : "";
    $("#evidence-button").disabled = !run;
    setPhaseLinks();
  }
  function noRun() {
    return `<div class="empty-state"><p class="eyebrow">Evidence boundary</p><h2>No canonical run loaded</h2><p>This preview never creates example healthcare values, calculations, approvals, or release state. Provide an existing run identifier in <code>?run=…</code>.</p></div>`;
  }
  function stageStatus(gate) { return gate?.status === "passed" ? "complete" : gate?.status === "blocked" ? "attention" : "current"; }
  function renderEngagement() {
    if (!state.run) { $("#engagement").innerHTML = noRun(); return; }
    const run = state.run;
    const unresolvedGates = gates().filter(gate => gate.status !== "passed");
    const openFindings = (run.findings ?? []).filter(finding => finding.status === "open");
    const attention = [
      ...unresolvedGates.map(gate => ({ kind: "gate", title: `${gate.gate} · ${gate.status}`, detail: gate.rationale || "No canonical rationale recorded.", tone: gateClass(gate.status) })),
      ...openFindings.map(finding => ({ kind: "finding", title: finding.title || finding.id, detail: finding.detail || "Open canonical finding.", tone: "open" }))
    ];
    const stages = [
      { label: "Intake", detail: `${(run.sourceInventory ?? []).length} source record(s)` },
      { label: "Map", gate: "G2" },
      { label: "Reconcile", gate: "G3" },
      { label: "Migration evidence", gate: "G4" },
      { label: "Analyze", detail: `${(run.findings ?? []).length} finding(s)` },
      { label: "Review", gate: "G6" },
      { label: "Export", gate: "G7" }
    ];
    const lensCopy = {
      work: "Work lens: source evidence, workflow state, and reconciliation controls from this persisted run.",
      review: "Review lens: unresolved canonical obligations remain separate from any professional record.",
      decision: "Decision lens: the display reports state without inferring authority, approval, or release."
    }[state.lens];
    const release = gates().find(gate => gate.gate === "G7");
    $("#engagement").innerHTML = `
      <section class="condition-banner" aria-label="Canonical conditions">
        <span class="condition-icon" aria-hidden="true">!</span>
        <div><strong>${attention.length ? `${attention.length} canonical item(s) require attention` : "No open canonical attention recorded"}</strong><p>Unreconciled differences, open findings, and gate authority remain visible. This preview performs no calculation or decision.</p></div>
      </section>
      <div class="lens-row"><p class="lens-copy">${escapeHtml(lensCopy)}</p><div class="lenses" role="tablist" aria-label="Engagement lens">${["work", "review", "decision"].map(lens => `<button type="button" role="tab" aria-selected="${state.lens === lens}" class="${state.lens === lens ? "active" : ""}" data-lens="${lens}">${lens[0].toUpperCase() + lens.slice(1)}</button>`).join("")}</div></div>
      <nav class="progress-rail" aria-label="Canonical workflow progress">${stages.map((stage, index) => { const gate = gates().find(item => item.gate === stage.gate); const target = `/next/index.html?run=${encodeURIComponent(run.id)}`; return `<a class="progress-stage ${stageStatus(gate)}" href="${target}"><b>${String(index + 1).padStart(2, "0")}</b><strong>${escapeHtml(stage.label)}</strong><small>${escapeHtml(stage.detail ?? `${gate.gate} · ${gate.status}`)}</small></a>`; }).join("")}</nav>
      <div class="overview-grid">
        <section class="panel"><header><p class="eyebrow">Reconciliation state</p><h2>Canonical controls</h2><p>Amounts and statuses are rendered from the persisted run; residuals are not suppressed.</p></header><ul class="figure-list">${(run.reconciliations ?? []).map(item => `<li class="figure-row"><div><strong>${escapeHtml(item.label ?? item.id)}</strong><p>${escapeHtml(item.leftDefinition ?? "Left population")} → ${escapeHtml(item.rightDefinition ?? "Right population")}</p></div><div><span class="amount">${escapeHtml(formatCents(item.difference))}</span><div class="figure-meta"><span class="chip ${item.arithmeticStatus === "difference" ? "blocked" : "pass"}">${escapeHtml(item.arithmeticStatus ?? "status unavailable")}</span><button type="button" class="evidence-link" data-reconciliation="${escapeHtml(item.id)}">Evidence</button></div></div></li>`).join("") || `<li class="figure-row">No canonical reconciliations are available for this run.</li>`}</ul></section>
        <aside class="panel"><header><p class="eyebrow">Attention queue</p><h2>What remains open</h2><p>Canonical rationales and finding details remain distinct from a professional conclusion.</p></header><ul class="attention-list">${attention.map(item => `<li class="attention-row ${escapeHtml(item.tone)}"><strong>${escapeHtml(item.title)}</strong><p>${escapeHtml(item.detail)}</p></li>`).join("") || `<li class="attention-row"><strong>No open canonical items</strong><p>The persisted run reports no unresolved gate or open finding.</p></li>`}</ul><div class="release-card"><strong>G7 · ${escapeHtml(release?.status ?? "unavailable")}</strong><p>${escapeHtml(release?.rationale ?? "No canonical release-gate state is available.")} This display is not release authority.</p></div></aside>
      </div>`;
    document.querySelectorAll("[data-lens]").forEach(button => button.addEventListener("click", () => { state.lens = button.dataset.lens; renderEngagement(); }));
    document.querySelectorAll("[data-reconciliation]").forEach(button => button.addEventListener("click", () => openDrawer(button.dataset.reconciliation)));
  }
  function reconciliationContext(id) {
    const item = (state.run?.reconciliations ?? []).find(entry => entry.id === id);
    if (!item) return "";
    const linkedFindings = (state.run.findings ?? []).filter(finding => finding.reconciliationId === id || finding.controlId === id);
    return `<section class="drawer-context"><p class="eyebrow">Selected reconciliation control</p><h3>${escapeHtml(item.id)} · ${escapeHtml(item.label)}</h3><dl><dt>Definitions</dt><dd>${escapeHtml(item.leftDefinition)} → ${escapeHtml(item.rightDefinition)}</dd><dt>Canonical amounts</dt><dd>${escapeHtml(formatCents(item.leftTotal))} → ${escapeHtml(formatCents(item.rightTotal))} · Difference ${escapeHtml(formatCents(item.difference))}</dd><dt>Canonical status</dt><dd>Arithmetic: ${escapeHtml(item.arithmeticStatus ?? "unavailable")} · Materiality: ${escapeHtml(item.materialityStatus ?? "unavailable")}</dd><dt>Linked finding references</dt><dd>${linkedFindings.length ? linkedFindings.map(finding => `${escapeHtml(finding.id)} · ${escapeHtml(finding.title)}`).join("<br>") : "No explicitly linked canonical finding references."}</dd></dl><p class="limitation"><strong>Source-thread limitation.</strong> The canonical API provides run-level inventory, not a figure-specific document/calculation/review thread. Inventory below is not attributed to this control.</p></section>`;
  }
  function openDrawer(reconciliationId) {
    if (!state.run) return;
    state.selectedReconciliation = reconciliationId ?? null;
    const sources = state.run.sourceInventory ?? [];
    const findings = state.run.findings ?? [];
    $("#drawer-title").textContent = reconciliationId ? "Selected reconciliation evidence" : "Evidence drawer";
    $("#drawer-content").innerHTML = `${reconciliationId ? reconciliationContext(reconciliationId) : ""}<h3 class="inventory-heading">Run-level evidence inventory</h3>${[...sources.map(source => ({ title: source.name, detail: `${source.classification ?? "source"} · ${source.size ?? "size unavailable"} bytes`, trace: source.hash })), ...findings.map(finding => ({ title: finding.title || finding.id, detail: finding.detail || "Canonical finding", trace: (finding.references ?? []).join("; ") || "No finding reference recorded" }))].map(entry => `<article class="evidence-item"><strong>${escapeHtml(entry.title)}</strong><p>${escapeHtml(entry.detail)}</p><code>${escapeHtml(entry.trace)}</code></article>`).join("") || `<article class="evidence-item">No run-bound source inventory or findings are available.</article>`}`;
    $("#evidence-drawer").classList.add("open");
    $("#evidence-drawer").setAttribute("aria-hidden", "false");
    $("#drawer-scrim").hidden = false;
    $("#close-drawer").focus();
  }
  function closeDrawer(restoreFocus = false) {
    $("#evidence-drawer").classList.remove("open");
    $("#evidence-drawer").setAttribute("aria-hidden", "true");
    $("#drawer-scrim").hidden = true;
    if (restoreFocus) $("#evidence-button").focus();
  }
  function toggleNavigation(open, restoreFocus = false) {
    state.navOpen = open;
    $("#workflow-nav").classList.toggle("open", open);
    $("#mobile-nav-toggle").setAttribute("aria-expanded", String(open));
    $("#mobile-nav-toggle").textContent = open ? "Close workflow" : "Workflow";
    if (restoreFocus) $("#mobile-nav-toggle").focus();
  }
  async function boot() {
    const id = new URLSearchParams(location.search).get("run");
    if (id) {
      try {
        state.run = await api(`/api/runs/${encodeURIComponent(id)}`);
        setNotice("Canonical persisted run loaded.");
      } catch (error) { setNotice(error.message, true); }
    }
    renderHeader();
    renderEngagement();
  }
  $("#evidence-button").addEventListener("click", () => openDrawer());
  $("#close-drawer").addEventListener("click", () => closeDrawer(true));
  $("#drawer-scrim").addEventListener("click", () => closeDrawer(true));
  $("#mobile-nav-toggle").addEventListener("click", () => toggleNavigation(!state.navOpen));
  document.addEventListener("keydown", event => { if (event.key !== "Escape") return; if (state.navOpen) { toggleNavigation(false, true); return; } if ($("#evidence-drawer").classList.contains("open")) closeDrawer(true); });
  boot();
})();
