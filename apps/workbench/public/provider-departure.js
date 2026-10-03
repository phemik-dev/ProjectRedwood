const departureCurrency = (cents) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(cents ?? 0) / 100);
const departureEsc = (value) => String(value ?? "Unavailable").replace(/[&<>\"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;" }[character]));

window.renderProviderDepartureEvidence = () => {
  const state = window.redwoodState;
  const phase = document.querySelector("#phase");
  if (!phase || state?.phase !== "Analyze" || !state.run || document.querySelector("#provider-departure-evidence")) return;
  const rows = (state.run.analysis?.providerSustainability ?? []).filter((item) => item.postDepartureGrossCharge !== undefined);
  if (!rows.length) return;
  const body = rows.map((item) => {
    const roster = state.run.deal?.providerRoster?.find((entry) => entry.providerId === item.provider);
    const sourceRow = String(roster?.lineage?.sourceRowId ?? "").split(":").at(-1) || "Unavailable";
    const undated = item.undatedGrossCharge ? `<br><small>Undated billed excluded: ${departureCurrency(item.undatedGrossCharge)}</small>` : "";
    return `<tr><td><strong>${departureEsc(item.provider)}</strong><br><small>${departureEsc(item.specialty)}</small></td><td>${departureEsc(item.fte)}</td><td>${departureEsc(item.endDate)}</td><td>${departureCurrency(item.preDepartureGrossCharge)}</td><td>${departureCurrency(item.postDepartureGrossCharge)}<br><small>${departureEsc(item.postDepartureClaimCount)} claim(s)</small>${undated}</td><td>${departureEsc(roster?.lineage?.sourceFileName)} row ${departureEsc(sourceRow)}</td></tr>`;
  }).join("");
  const section = document.createElement("section");
  section.id = "provider-departure-evidence";
  section.innerHTML = `<h3>Post-departure observed revenue evidence</h3><div class="warning"><strong>Evidence only.</strong> Amounts separate observed valuation-bounded claims before and after the supplied departure date. They are not a QoR normalization, adjustment, professional conclusion, or release authorization.</div><table><thead><tr><th>Provider</th><th>FTE</th><th>Departure date</th><th>Observed billed through departure</th><th>Observed billed after departure through valuation</th><th>Roster trace</th></tr></thead><tbody>${body}</tbody></table>`;
  phase.append(section);
};
