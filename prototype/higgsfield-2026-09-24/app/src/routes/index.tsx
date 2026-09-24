import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Redwood | Physician Group QoR Deal Room" },
      { name: "description", content: "Interactive Redwood Quality-of-Revenue workspace for a synthetic U.S. physician group acquisition." }
    ]
  }),
  component: RedwoodWorkspace
});

type Phase = "Intake" | "Normalize" | "Reconcile" | "Analyze" | "Review" | "Export";
const phases: Phase[] = ["Intake","Normalize","Reconcile","Analyze","Review","Export"];

const deal = {
  name: "Redwood Physician Partners, PLLC",
  code: "ENG-001",
  type: "Buy-side healthcare FDD",
  sector: "Multi-specialty physician group",
  geography: "Texas",
  valuationDate: "June 30, 2026",
  claims: 240,
  billed: 109646.56,
  allowed: 69116.88,
  paid: 53205.59,
  openAR: 15911.29,
  ar120: 9021.52,
  denied: 20,
  unmatched: 321.45,
  glVariance: 750
};

const payerRows = [
  ["Medicare", "$18.7k", "32 days", "Verified"],
  ["BCBS Texas", "$15.2k", "45 days", "Alias review"],
  ["UnitedHealthcare", "$11.8k", "58 days", "Verified"],
  ["Aetna", "$9.9k", "52 days", "Verified"],
  ["Cigna", "$8.6k", "63 days", "Verified"],
  ["Self Pay", "$4.9k", "105 days", "Review"]
];

const sourceRows = [
  ["Claims_Raw", "240 records", "Practice Management", "Mapped"],
  ["Payments_Raw", "332 records", "ERA + patient ledger", "Exception"],
  ["AR_Snapshot_Raw", "92 open items", "A/R report", "Mapped"],
  ["GL_Monthly_Raw", "18 months", "Accounting export", "Exception"],
  ["Provider_Master", "12 providers", "Reference", "Mapped"],
  ["Location_Master", "5 sites", "Reference", "Mapped"]
];

const mappingRows = [
  ["DOS", "service_date", "99%", "Approved"],
  ["Primary_Insurance", "payer_name", "92%", "Review"],
  ["Amt Paid", "paid_amount", "100%", "Approved"],
  ["Provider_ID", "provider_id", "100%", "Approved"],
  ["Service_Line", "service_line", "100%", "Approved"],
…[6446 chars truncated — re-run with head/grep/tail for full output]…
lled, allowed: deal.allowed, paid: deal.paid,
    openAR: deal.openAR, ar120: deal.ar120, denied: deal.denied, unmatched: deal.unmatched, glVariance: deal.glVariance
  });
  const [mode, setMode] = useState<"sample" | "uploaded">("sample");
  const [runError, setRunError] = useState("");
  const recovery = useMemo(() => metrics.openAR * (assumption / 100), [metrics.openAR, assumption]);
  const realizable = metrics.paid + recovery;
  const uploadCount = Object.values(uploaded).filter(Boolean).length;
  const allUploaded = uploadCount === 4;

  async function receiveFile(key: SourceKey, file: File | null) {
    if (!file) return;
    const text = await file.text();
    const rows = parseCsv(text);
    setUploaded((current) => ({ ...current, [key]: { name: file.name, rows, rowCount: rows.length } }));
    setRunError("");
  }

  function runDeal() {
    if (!allUploaded) {
      setRunError("Load all four source files before running the QoR engine.");
      return;
    }
    const next = evaluateUploads(uploaded);
    if (!next.claims) {
      setRunError("The claims file produced no recognized records. Check the CSV headers.");
      return;
    }
    setMetrics(next);
    setMode("uploaded");
    setApproved(false);
    setRunError("");
    setPhase("Reconcile");
  }

  return (
    <main className="app-shell">
      <aside className="sidebar" aria-label="Redwood navigation">
        <div className="brand">
          <img src="/assets/redwood-mark.svg" alt="" role="presentation" />
          <div><strong>Redwood</strong><span>Healthcare Transaction Intelligence</span></div>
        </div>
        <nav className="side-nav" aria-label="Deal sections">
          <button className={phase === "Intake" ? "active" : ""} onClick={() => setPhase("Intake")}>Deal room</button>
          <button className={phase === "Normalize" ? "active" : ""} onClick={() => setPhase("Normalize")}>Sources</button>
          <button className={phase === "Analyze" ? "active" : ""} onClick={() => setPhase("Analyze")}>QoR analysis</button>
          <button className={phase === "Review" ? "active" : ""} onClick={() => setPhase("Review")}>Findings</button>
          <button className={phase === "Export" ? "active" : ""} onClick={() => setPhase("Export")}>Databook</button>
        </nav>
        <div className="sidebar-note">
          <span className="eyebrow">Synthetic test deal</span>
          <p>No real PHI. Patient identifiers are synthetic tokens.</p>
        </div>
        <div className="ownership"><span>Redwood Methodology v0.1</span><span>Physician Group Pack</span></div>
      </aside>

      <section className="workspace">
        <header className="topbar" id="deal">
          <div>
            <span className="eyebrow">Deal {deal.code}</span>
            <h1>{deal.name}</h1>
            <p>{deal.type} · {deal.sector} · {deal.geography} · Valuation date {deal.valuationDate}</p>
          </div>
          <div className="top-actions">
            <span className="status-badge status-review">G3 · Reconciliation exception</span>
            <button className="button button-quiet">Share review</button>
          </div>
        </header>

        <div className="phase-rail" role="tablist" aria-label="Deal workflow">
          {phases.map((item, index) => (
            <button key={item} role="tab" aria-selected={phase === item} className={phase === item ? "phase active" : "phase"} onClick={() => setPhase(item)}>
              <span>{index + 1}</span>{item}
            </button>
          ))}
        </div>

        <section className="readiness" aria-label="Deal readiness">
          <div><span className="eyebrow">Current work state</span><h2>{phase}</h2></div>
          <div className="readiness-metrics">
            <Metric label="Claims" value={metrics.claims.toLocaleString()} note={mode === "sample" ? "sample population" : "uploaded population"} />
            <Metric label="Open A/R" value={usd(metrics.openAR)} note="valuation-date balance" />
            <Metric label="Exceptions" value={String((metrics.unmatched > 0 ? 1 : 0) + (Math.abs(metrics.glVariance) >= 500 ? 1 : 0))} note="G3 reconciliation" danger={metrics.unmatched > 0 || Math.abs(metrics.glVariance) >= 500} />
            <Metric label="Review items" value={String(metrics.denied ? 4 : 2)} note="advisor action" />
          </div>
        </section>

        <PhaseContent
          phase={phase}
          assumption={assumption}
          setAssumption={setAssumption}
          approved={approved}
          setApproved={setApproved}
          recovery={recovery}
          realizable={realizable}
          metrics={metrics}
          uploaded={uploaded}
          receiveFile={receiveFile}
          runDeal={runDeal}
          allUploaded={allUploaded}
          uploadCount={uploadCount}
          runError={runError}
          mode={mode}
        />

        <footer>
          <span>Redwood · Healthcare Transaction Intelligence</span>
          <span>This work belongs to Phemi Kgomongwe © 2026 · www.phemik.co.za</span>
        </footer>
      </section>
    </main>
  );
}

function Metric({ label, value, note, danger = false }: { label: string; value: string; note: string; danger?: boolean }) {
  return <div className="metric"><span>{label}</span><strong className={danger ? "danger-text" : ""}>{value}</strong><small>{note}</small></div>;
}

function PhaseContent(props: {
  phase: Phase; assumption: number; setAssumption: (v:number)=>void; approved:boolean; setApproved:(v:boolean)=>void; recovery:number; realizable:number;
  metrics: DealMetrics; uploaded: Record<SourceKey, UploadState | null>; receiveFile: (key: SourceKey, file: File | null) => Promise<void>;
  runDeal: () => void; allUploaded: boolean; uploadCount: number; runError: string; mode: "sample" | "uploaded";
}) {
  const { phase, assumption, setAssumption, approved, setApproved, recovery, realizable, metrics, uploaded, receiveFile, runDeal, allUploaded, uploadCount, runError, mode } = props;

  if (phase === "Intake") return (
    <div className="content-grid" id="sources">
      <section className="panel wide">
        <PanelHead eyebrow="Gate G1 · Source sufficiency" title="Load the four minimum source files" note="The MVP accepts CSV exports and processes them locally in the browser."/>
        <div className="upload-grid">
          {[
            ["claims","Claims / Charges","Claim_ID, DOS, payer, provider, location, service, billed and allowed amount"],
            ["payments","Payments / Remittance","Payment_ID, Claim_ID, payment date, payer and paid amount"],
            ["ar","A/R Snapshot","Claim_ID, snapshot date, open A/R, age bucket and status"],
            ["gl","General Ledger","Month, net patient revenue, payer cash and patient collections"]
          ].map(([key,label,hint]) => {
            const file = uploaded[key as SourceKey];
            return (
              <label className={file ? "upload-card loaded" : "upload-card"} key={key}>
                <span className="upload-title">{label}</span>
                <span className="upload-hint">{hint}</span>
                <input aria-label={"Upload " + label + " CSV"} type="file" accept=".csv,text/csv" onChange={(e)=>void receiveFile(key as SourceKey,e.target.files?.[0] ?? null)} />
                <strong>{file ? file.name + " · " + file.rowCount.toLocaleString() + " rows" : "Choose CSV"}</strong>
              </label>
            );
          })}
        </div>
        {runError && <div className="inline-error" role="alert">{runError}</div>}
        <div className="run-bar">
          <div><span className="eyebrow">Data readiness</span><strong>{uploadCount}/4 source populations loaded</strong></div>
          <button className={allUploaded ? "button button-run" : "button button-disabled"} disabled={!allUploaded} onClick={runDeal}>Run Redwood QoR</button>
        </div>
      </section>
      <section className="panel privacy-panel">
        <PanelHead eyebrow="Prototype privacy posture" title="Local-first intake" note="The browser prototype does not need to transmit uploaded CSV contents to a backend."/>
        <GateList items={[["Patient names","Not required"],["Claim IDs","Tokenizable"],["Cloud upload","Not used"],["Workbook","Generated locally"]]}/>
      </section>
    </div>
  );

  if (phase === "Normalize") return (
    <div className="content-grid" id="sources">
      <section className="panel wide"><PanelHead eyebrow="Canonical revenue dataset" title="Mapping review" note="The system proposes mappings. The advisor approves ambiguous semantics."/><DataTable headers={["Source field","Canonical field","Confidence","Decision"]} rows={mappingRows}/></section>
      <section className="panel"><PanelHead eyebrow="Open mapping" title="BCBS payer aliases" note="Multiple raw payer labels resolve to one normalized carrier."/><div className="evidence-card"><div><span>BCBS TX</span><strong>→ BCBS Texas</strong></div><div><span>BCBSTX</span><strong>→ BCBS Texas</strong></div><div><span>BLUE CROSS TX</span><strong>→ BCBS Texas</strong></div></div><button className="button button-primary">Approve mapping</button></section>
    </div>
  );

  if (phase === "Reconcile") return (
    <div className="content-grid" id="analysis">
      <section className="panel wide"><PanelHead eyebrow="Gate G3" title="Reconciliation control" note="Redwood does not release QoR analysis until material population differences are dispositioned."/><div className="recon-table"><ReconRow label="Matched payment population" source={usd(metrics.paid)} target={usd(metrics.paid)} difference="$0" state="Verified"/><ReconRow label="Unmatched remittance" source={usd(metrics.unmatched)} target="$0" difference={usd(metrics.unmatched)} state={metrics.unmatched > 0 ? "Exception" : "Verified"}/><ReconRow label="June 2026 cash to GL" source="Payments" target="GL cash" difference={usd(metrics.glVariance)} state={Math.abs(metrics.glVariance) >= 500 ? "Exception" : "Verified"}/><ReconRow label="A/R snapshot" source={usd(metrics.openAR)} target={usd(metrics.openAR)} difference="$0" state="Verified"/></div></section>
      <section className={(metrics.unmatched > 0 || Math.abs(metrics.glVariance) >= 500) ? "panel exception-panel" : "panel verified-panel"}><PanelHead eyebrow={(metrics.unmatched > 0 || Math.abs(metrics.glVariance) >= 500) ? "Release blocker" : "Reconciled"} title={(metrics.unmatched > 0 || Math.abs(metrics.glVariance) >= 500) ? "Exceptions require disposition" : "G3 passed"} note="Redwood preserves reconciliation state and reviewer accountability." />{metrics.unmatched > 0 && <div className="exception"><strong>{usd(metrics.unmatched)} unmatched payment</strong><span>Payment claim reference was not found in the claims population.</span></div>}{Math.abs(metrics.glVariance) >= 500 && <div className="exception"><strong>{usd(metrics.glVariance)} GL variance</strong><span>June cash differs from GL cash above the $500 materiality threshold.</span></div>}</section>
    </div>
  );

  if (phase === "Analyze") return (
    <div className="analysis-layout" id="analysis">
      <section className="panel chart-panel"><PanelHead eyebrow="Quality of Revenue" title="Cash conversion bridge" note="Observed cash remains separate from estimated remaining collections."/><div className="waterfall"><Bar label="Billed" value={metrics.billed} max={Math.max(metrics.billed,1)} tone="ink"/><Bar label="Expected allowed" value={metrics.allowed} max={Math.max(metrics.billed,1)} tone="slate"/><Bar label="Observed cash" value={metrics.paid} max={Math.max(metrics.billed,1)} tone="teal"/><Bar label="Expected recovery" value={recovery} max={Math.max(metrics.billed,1)} tone="pale"/><Bar label="Realizable" value={realizable} max={Math.max(metrics.billed,1)} tone="ink"/></div></section>
      <section className="panel assumption-panel"><PanelHead eyebrow="Professional judgment" title="A/R recovery assumption" note="System proposal is visible. The advisor owns the final judgment."/><label htmlFor="recovery-rate">Recovery rate: {assumption}%</label><input id="recovery-rate" type="range" min="20" max="95" value={assumption} onChange={(e)=>setAssumption(Number(e.target.value))}/><div className="assumption-result"><span>Expected remaining cash</span><strong>{usd(recovery)}</strong></div><p className="source-note">Basis: synthetic 18-month collections profile. Not yet advisor-approved.</p></section>
      <section className="panel table-panel"><PanelHead eyebrow="Revenue quality" title="Carrier view" note="Payer identity, collection lag and review state remain visible together."/><DataTable headers={["Carrier","Allowed revenue","Lag","State"]} rows={payerRows}/></section>
      <section className="panel ar-panel"><PanelHead eyebrow="A/R ageing" title={usd(metrics.ar120) + " over 120 days"} note="Older receivables drive recovery assumptions and QoR findings."/><div className="aging">{[["0-30",13],["31-60",18],["61-90",11],["91-120",1],["120+",57]].map(([label,pct])=><div key={String(label)} className="aging-row"><span>{label}</span><div><i style={{width:String(pct)+"%"}}/></div><strong>{pct}%</strong></div>)}</div></section>
    </div>
  );

  if (phase === "Review") return (
    <div className="content-grid" id="findings">
      <section className="panel wide"><PanelHead eyebrow="Gate G6" title="Findings queue" note="AI may propose a finding. A professional reviewer determines disposition and release language."/><div className="finding-list">{[
        ["A/R over 120 days", usd(metrics.ar120) + " is aged beyond 120 days and requires recovery assumptions.", "Needs note"],
        ["Unmatched remittance", usd(metrics.unmatched) + " has no matching claim reference.", metrics.unmatched > 0 ? "Exception" : "Clear"],
        ["June GL tie-out", "Cash differs from the GL by " + usd(metrics.glVariance) + ".", Math.abs(metrics.glVariance) >= 500 ? "Exception" : "Clear"],
        ["Open denials", String(metrics.denied) + " denied-open claims remain in the A/R population.", "Needs review"]
      ].map((f)=><article className="finding" key={f[0]}><div><strong>{f[0]}</strong><p>{f[1]}</p></div><StateLabel value={f[2]}/></article>)}</div></section>
      <section className="panel"><PanelHead eyebrow="Advisor authority" title="Collection assumption" note="The release record preserves the reviewer, basis and decision."/><div className="decision-card"><span>Proposed recovery</span><strong>{assumption}%</strong><small>System proposed · advisor not yet approved</small></div><button className={approved ? "button button-approved" : "button button-primary"} onClick={()=>setApproved(!approved)}>{approved ? "Approved by advisor" : "Approve assumption"}</button></section>
    </div>
  );

  return (
    <div className="content-grid" id="export">
      <section className="panel wide"><PanelHead eyebrow="Gate G7" title="Client-ready databook" note="The browser compiler creates an editable Excel-compatible workbook from the active deal state."/><div className="workbook-preview">{["Executive Summary","A/R Ageing","Payer Analysis","Assumptions","Findings","Source Trace"].map((tab)=><span key={tab}>{tab}</span>)}</div><div className="export-value"><span>Estimated realizable revenue</span><strong>{usd(realizable)}</strong></div></section>
      <section className="panel"><PanelHead eyebrow="Release readiness" title={(metrics.unmatched > 0 || Math.abs(metrics.glVariance) >= 500) ? "Draft export available" : "Ready for release"} note={(metrics.unmatched > 0 || Math.abs(metrics.glVariance) >= 500) ? "The workbook can be exported for review while G3 remains visibly unresolved." : "Required reconciliation checks have passed."}/><GateList items={[["Source sufficiency",mode === "uploaded" ? "Passed" : "Sample"],["Mapping review","Passed"],["Reconciliation",(metrics.unmatched > 0 || Math.abs(metrics.glVariance) >= 500) ? "Blocked" : "Passed"],["Calculation","Ready"],["Advisor judgments",approved ? "Passed" : "Open"]]}/><button className="button button-export" onClick={()=>exportExcelXml(metrics,assumption)}>Export editable Excel</button><p className="source-note">MVP export format: Excel-compatible .xls generated locally in the browser.</p></section>
    </div>
  );
}

function PanelHead({eyebrow,title,note}:{eyebrow:string;title:string;note:string}) {
  return <header className="panel-head"><span className="eyebrow">{eyebrow}</span><h2>{title}</h2><p>{note}</p></header>;
}

function DataTable({headers,rows}:{headers:string[];rows:string[][]}) {
  return <div className="table-scroll"><table><thead><tr>{headers.map((h)=><th key={h}>{h}</th>)}</tr></thead><tbody>{rows.map((row,ri)=><tr key={row[0]+"-"+ri}>{row.map((value,i)=><td key={String(i)}>{i===row.length-1 ? <StateLabel value={value}/> : value}</td>)}</tr>)}</tbody></table></div>;
}

function StateLabel({value}:{value:string}) {
  const danger=value.includes("Exception") || value.includes("Blocked");
  const review=value.includes("Review") || value.includes("Alias") || value.includes("Open");
  return <span className={"state-label "+(danger ? "danger" : review ? "review" : "ok")}>{value}</span>;
}

function ReconRow({label,source,target,difference,state}:{label:string;source:string;target:string;difference:string;state:string}) {
  return <div className="recon-row"><strong>{label}</strong><span><small>Source</small>{source}</span><span><small>Expected</small>{target}</span><span><small>Difference</small>{difference}</span><StateLabel value={state}/></div>;
}

function GateList({items}:{items:string[][]}) {
  return <div className="gate-list">{items.map(([label,state])=><div key={label}><span>{label}</span><StateLabel value={state}/></div>)}</div>;
}

function Bar({label,value,max,tone}:{label:string;value:number;max:number;tone:string}) {
  const height=Math.max(12,(value/max)*100);
  return <div className="bar-wrap"><div className={"bar "+tone} style={{height:String(height)+"%"}}><span>{usd(value)}</span></div><strong>{label}</strong></div>;
}
