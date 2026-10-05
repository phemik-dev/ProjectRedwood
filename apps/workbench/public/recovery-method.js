const recoveryEsc = (value) => String(value ?? "").replace(/[&<>\"]/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;" }[character]));
const recoveryMethodLabels = {
  COLLECTION_DISTRIBUTION: "Collection distribution",
  PERCENT_OF_CHARGES: "Percent of charges",
  COMPOSITE: "Composite"
};
const recoveryMethodComponents = {
  COLLECTION_DISTRIBUTION: "Observed charge and collection cohorts within the reconstruction window",
  PERCENT_OF_CHARGES: "Run-bound gross charges and an explicit percent input",
  COMPOSITE: "Ordered, evidence-bound segment overrides with an explicit fallback"
};

function recoveryContext(run) {
  const profile = run.profile ?? {};
  const rates = profile.recoveryRates ?? {};
  const configuredRates = Object.entries(rates).filter(([, rate]) => rate !== undefined && rate !== null);
  const configured = configuredRates.length > 0;
  const approval = "Candidate — governed combination and professional approval required";
  return { profile, rates, configured, approval };
}

function recoveryMethodRows(context) {
  return Object.keys(recoveryMethodLabels).map(method => {
    const composite = method === "COMPOSITE";
    const evidence = "Not evaluated — no recovery-method record is attached to this run";
    return `<tr><td><strong>${recoveryEsc(recoveryMethodLabels[method])}</strong></td><td>${composite ? "Governed candidate" : "Parallel method"}</td><td>${recoveryEsc(evidence)}</td><td>${recoveryEsc(recoveryMethodComponents[method])}</td><td>${composite ? "First matching segment override; otherwise fallback" : "No segment override"}</td><td>${composite ? recoveryEsc(context.approval) : "Independent method — not a composite input"}</td></tr>`;
  }).join("");
}

function configuredRateRows(context) {
  const buckets = ["0-30", "31-60", "61-90", "91-120", "121+"];
  return buckets.map(bucket => {
    const rate = context.rates[bucket];
    return `<tr><td>${bucket}</td><td>${rate === undefined || rate === null ? "Unavailable" : `${(Number(rate) * 100).toFixed(1)}%`}</td><td>${rate === undefined || rate === null ? "No configured input" : "Method-profile input"}</td><td>No run-level override</td></tr>`;
  }).join("");
}

function recoveryPresentation(run, compact = false) {
  const context = recoveryContext(run);
  const profileStatus = context.profile.status ?? "Unavailable";
  const title = compact ? "Recovery method review" : "Recovery method presentation";
  const narrative = context.configured
    ? "Configured inputs are presented for inspection. They do not establish a weighted composite or professional approval."
    : "No recovery-rate input is configured. Expected remaining cash must remain unavailable rather than being inferred or weighted automatically.";
  return `<section class="recovery-method-presentation ${compact ? "compact" : ""}"><div class="section-heading"><div><span class="eyebrow">Recovery method · run-bound</span><h3>${title}</h3><p>${recoveryEsc(narrative)}</p></div><span class="source-badge">${recoveryEsc(profileStatus)}</span></div><div class="recovery-boundary"><strong>Composite boundary</strong><span>${recoveryEsc(context.approval)}. Parallel methods are alternatives; Redwood applies no automatic weighting.</span></div><div class="table-scroll"><table><thead><tr><th>Method</th><th>Role</th><th>Evidence state</th><th>Components</th><th>Overrides</th><th>Composite / approval</th></tr></thead><tbody>${recoveryMethodRows(context)}</tbody></table></div>${context.method === "age_bucket_rates" ? `<h4>Selected-method components</h4><div class="table-scroll"><table><thead><tr><th>Age bucket</th><th>Configured rate</th><th>Evidence state</th><th>Overrides</th></tr></thead><tbody>${configuredRateRows(context)}</tbody></table></div>` : ""}</section>`;
}

window.renderRecoveryMethodPresentation = function renderRecoveryMethodPresentation() {
  const state = window.redwoodState;
  const host = document.querySelector("#phase");
  if (!host || state?.phase !== "Analyze" || !state.run || document.querySelector("#recovery-method-presentation")) return;
  const section = document.createElement("section");
  section.id = "recovery-method-presentation";
  section.innerHTML = recoveryPresentation(state.run);
  host.append(section);
};

window.recoveryMethodReviewPresentation = function recoveryMethodReviewPresentation(run) {
  return recoveryPresentation(run, true);
};
