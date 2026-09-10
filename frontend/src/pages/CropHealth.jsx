import { useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/CropHealth.css";
import { cropHealthCrops, prototypeHistory, prototypeZones, trendData } from "../data/cropHealthData";

const HISTORY_KEY = "agrivision-crop-health-history";
const parseConfidence = (value) => { const parsed = Number.parseFloat(String(value)); return Number.isFinite(parsed) ? parsed : 0; };
const healthStatus = (score) => score >= 80 ? { label: "Healthy", tone: "good" } : score >= 60 ? { label: "Needs Attention", tone: "warn" } : { label: "Critical", tone: "bad" };
const severityFor = (disease, confidence) => disease.toLowerCase().includes("healthy") ? "Low" : confidence >= 90 ? "Moderate" : "High";
const safeHistory = () => { try { const stored = JSON.parse(localStorage.getItem(HISTORY_KEY) || "null"); return Array.isArray(stored) && stored.length ? stored : prototypeHistory; } catch { return prototypeHistory; } };

function CropHealth() {
  const selectedCrop = "Rice";
  const [selectedZone, setSelectedZone] = useState(prototypeZones[1]);
  const history = safeHistory();
  const [trendPeriod, setTrendPeriod] = useState("7 days");
  const [result, setResult] = useState({ disease: "Leaf Blight", confidence: "91%", isCropImage: true, medicine: "Confirm treatment with a local agriculture expert", recommendation: "Inspect affected plants and continue monitoring after management." });
  const [resultSource, setResultSource] = useState("Prototype Demo Data");
  const [reportVisible, setReportVisible] = useState(false);

  const confidence = parseConfidence(result.confidence);
  const currentScore = result.isCropImage ? Math.max(35, Math.round(100 - confidence * (result.disease.toLowerCase().includes("healthy") ? 0.08 : 0.2))) : 58;
  const status = healthStatus(currentScore);
  const severity = severityFor(result.disease, confidence);
  const previousScan = history[1] || null;
  const currentScan = history[0] || null;
  const scoreChange = currentScan && previousScan ? currentScan.score - previousScan.score : 0;
  const trend = trendData[trendPeriod];
  const diseaseRisk = Math.max(0, 100 - currentScore);
  const affectedArea = Math.min(100, Math.max(0, Math.round(diseaseRisk * 1.2)));
  const latestScan = history[0] || { time: "Not scanned yet" };
  const monitoredCrop = cropHealthCrops.find((crop) => crop.name === selectedCrop) || cropHealthCrops[0];
  const alerts = useMemo(() => {
    const nextAlerts = [];
    if (currentScore < 60) nextAlerts.push({ tone: "bad", label: "Critical", text: `Possible crop health deterioration detected in ${selectedZone.name}.` });
    else if (scoreChange < 0) nextAlerts.push({ tone: "warn", label: "Warning", text: `Health score decreased by ${Math.abs(scoreChange)} points since the previous scan.` });
    if (selectedZone.score >= 85) nextAlerts.push({ tone: "good", label: "Information", text: `No major health issues detected in ${selectedZone.name}.` });
    if (!nextAlerts.length) nextAlerts.push({ tone: "warn", label: "Warning", text: "Monitor the affected zone closely and schedule another scan." });
    return nextAlerts;
  }, [currentScore, scoreChange, selectedZone]);
  const summary = currentScore >= 80
    ? `Overall crop health is good at ${currentScore}/100. ${selectedZone.name} is being monitored for ${result.disease.toLowerCase()}. Continue routine monitoring.`
    : `Overall crop health is ${status.label.toLowerCase()} at ${currentScore}/100. ${selectedZone.name} requires attention because ${result.disease.toLowerCase()} was detected. Continue monitoring after management.`;

  const chooseHistory = (scan) => { setResult({ disease: scan.disease, confidence: scan.confidence, isCropImage: true, medicine: "Review with a local agriculture expert", recommendation: "Continue monitoring and compare with the next scan." }); setResultSource("Stored Scan History"); };
  const generateReport = () => setReportVisible((visible) => !visible);

  return <>
    <Navbar />
    <main className="health-page">
      <header className="health-header"><div><span className="health-eyebrow">FIELD INTELLIGENCE / CROP MONITORING</span><h1>🌿 AI Crop Health Command Center</h1><p>Understand crop health, locate risk, and decide what to inspect next.</p></div><div className="monitoring-state"><span /> PROTOTYPE MONITORING<small>Last updated: {latestScan.time}</small></div></header>

      <section className="health-overview"><article className={`health-score-card ${status.tone}`}><div className="section-heading"><div><span className="section-kicker">OVERALL CROP HEALTH</span><h2>{status.label}</h2></div><span className="source-pill">{resultSource}</span></div><div className="score-display"><div className="health-ring" style={{ "--score": `${currentScore}%` }}><strong>{currentScore}</strong><span>/100</span></div><div><h3>{monitoredCrop.icon} {selectedCrop}</h3><p>Health score from disease risk, confidence, affected area, and recent trend.</p></div></div><div className="overview-stats"><div><strong>{100 - affectedArea}%</strong><span>Healthy area</span></div><div><strong>{affectedArea}%</strong><span>At-risk area</span></div><div><strong>3</strong><span>Scans stored</span></div><div><strong>{prototypeZones.length}</strong><span>Zones monitored</span></div></div></article><article className="health-card score-breakdown"><span className="section-kicker">SCORE BREAKDOWN</span><h2>Why this score?</h2><div className="breakdown-row"><span>Disease risk</span><strong>{diseaseRisk}%</strong><i><b style={{ width: `${diseaseRisk}%` }} /></i></div><div className="breakdown-row"><span>Plant health</span><strong>{currentScore}%</strong><i><b className="good" style={{ width: `${currentScore}%` }} /></i></div><div className="breakdown-row"><span>Recent trend</span><strong>{scoreChange >= 0 ? "Improving" : "Declining"}</strong><i><b className={scoreChange >= 0 ? "good" : "bad"} style={{ width: `${Math.min(100, Math.max(10, 50 + scoreChange * 5))}%` }} /></i></div><p>Prototype score formula: 100 − disease risk, adjusted by confidence and affected area.</p></article></section>

      <section className={`health-card analysis-card ${result && result.isCropImage ? status.tone : "warn"}`}><div className="section-heading"><div><span className="section-kicker">CURRENT ANALYSIS</span><h2>{result ? result.disease : "Awaiting analysis"}</h2></div><span className="source-pill">{resultSource}</span></div>{result ? <><div className="analysis-grid"><div><span>Confidence</span><strong>{result.confidence}</strong><i><b style={{ width: `${confidence}%` }} /></i></div><div><span>Severity</span><strong>{severity}</strong></div><div><span>Health status</span><strong>{result.isCropImage ? status.label : "Uncertain"}</strong></div></div><p className="uncertain-note">Prototype analysis is based on stored deterministic demo data and previous scan history.</p></> : <p>No analysis result is available yet.</p>}</section>

      <section className="health-grid explain-layout"><article className="health-card explain-card"><span className="section-kicker">AI EXPLAINABILITY</span><h2>Why did AgriVision flag this crop?</h2><ul><li>🔎 {result?.isCropImage && !result.disease.toLowerCase().includes("healthy") ? "A disease classification was returned for the uploaded crop image." : "No confirmed disease classification is currently active."}</li><li>📊 Classification confidence is {confidence >= 80 ? "high enough to review" : "not high enough for a confident conclusion"}.</li><li>📉 The previous stored scan shows a {scoreChange >= 0 ? "stable or improving" : "declining"} recent health trend.</li><li>🧭 The selected monitoring focus is {selectedZone.name}.</li></ul></article><article className="health-card summary-card"><span className="section-kicker">AGRIVISION HEALTH SUMMARY</span><h2>Current field readout</h2><p>“{summary}”</p><button type="button" className="report-button" onClick={generateReport}>▣ {reportVisible ? "Hide" : "Generate"} Health Report</button></article></section>

      <section className="health-card trend-card"><div className="section-heading"><div><span className="section-kicker">HEALTH TREND</span><h2>Is the crop improving?</h2></div><div className="period-switch">{Object.keys(trendData).map((period) => <button type="button" key={period} className={trendPeriod === period ? "active" : ""} onClick={() => setTrendPeriod(period)}>{period}</button>)}</div></div><div className="trend-chart">{trend.map((value, index) => <div className="trend-column" key={`${trendPeriod}-${index}`}><strong>{value}</strong><i style={{ height: `${value}%` }} /><span>{index === trend.length - 1 ? "Now" : `D${index + 1}`}</span></div>)}</div><div className={`early-warning ${scoreChange < 0 ? "bad" : "good"}`}><strong>{scoreChange < 0 ? "🟡 Health declining" : "✅ Health stable or improving"}</strong><span>{scoreChange < 0 ? `Crop health has decreased by ${Math.abs(scoreChange)} points since the previous scan. Monitor closely.` : `Current scan is ${Math.abs(scoreChange)} points ${scoreChange > 0 ? "higher" : "stable"} than the previous stored scan.`}</span></div></section>

      <section className="health-grid zones-layout"><article className="health-card zones-card"><div className="section-heading"><div><span className="section-kicker">FIELD ZONE HEALTH MAP</span><h2>Where is the problem?</h2></div><span className="demo-pill">PROTOTYPE ZONES</span></div><div className="zone-map">{prototypeZones.map((zone) => <button type="button" className={`zone-tile ${zone.tone} ${selectedZone.name === zone.name ? "selected" : ""}`} key={zone.name} onClick={() => setSelectedZone(zone)}><strong>{zone.name}</strong><b>{zone.score}%</b><span>Healthy</span></button>)}</div></article><article className="health-card selected-zone"><span className="section-kicker">SELECTED ZONE</span><h2>{selectedZone.name}</h2><div className={`zone-status ${selectedZone.tone}`}>{selectedZone.score}% · {selectedZone.issue}</div><dl><div><dt>Affected area</dt><dd>{selectedZone.affected}%</dd></div><div><dt>Last scan</dt><dd>{selectedZone.lastScan}</dd></div><div><dt>Recommended action</dt><dd>{selectedZone.action}</dd></div></dl></article></section>

      <section className="health-card disease-matrix"><div className="section-heading"><div><span className="section-kicker">DISEASE & RISK OVERVIEW</span><h2>Detected conditions</h2></div><span className="engine-note">Derived from scans</span></div><div className="matrix"><div className="matrix-head"><span>Condition</span><span>Severity</span><span>Confidence</span><span>Affected area</span></div><div className="matrix-row"><strong>{result?.disease || "Awaiting scan"}</strong><span className={`risk-tag ${status.tone}`}>{severity}</span><span>{result?.confidence || "--"}</span><span>{affectedArea}%</span></div><div className="matrix-row"><strong>Water stress watch</strong><span className="risk-tag warn">Moderate</span><span>Prototype rule</span><span>9%</span></div></div></section>

      <section className="health-grid alerts-layout"><article className="health-card alerts-card"><div className="section-heading"><div><span className="section-kicker">HEALTH ALERT CENTER</span><h2>What needs attention?</h2></div><span className="alert-count">{alerts.length} active</span></div>{alerts.map((alert) => <div className="alert-row" key={`${alert.label}-${alert.text}`}><span className={`alert-icon ${alert.tone}`}>!</span><div><strong>{alert.label}</strong><p>{alert.text}</p></div></div>)}</article><article className="health-card recommendation-card"><span className="section-kicker">RECOMMENDED NEXT STEPS</span><h2>Act with care</h2><ol><li>Inspect affected plants in the indicated zone.</li><li>Separate visibly affected plant material where appropriate.</li><li>Run another scan after management or treatment.</li><li>Check irrigation and environmental conditions.</li></ol><small>No pesticide dosage or chemical mixing advice is provided by this prototype.</small></article></section>

      <section className="health-grid history-layout"><article className="health-card history-card"><div className="section-heading"><div><span className="section-kicker">IMAGE SCAN HISTORY</span><h2>Recent scans</h2></div><span className="engine-note">Local prototype storage</span></div>{history.map((scan) => <button type="button" className="history-row" key={scan.id} onClick={() => chooseHistory(scan)}><span className="history-thumb">{scan.image ? <img src={scan.image} alt="" /> : "🌿"}</span><span><strong>{scan.disease}</strong><small>{scan.time} · {scan.crop}</small></span><span>{scan.confidence}</span><b className={`risk-tag ${scan.tone}`}>{scan.status}</b></button>)}</article><article className="health-card compare-card"><span className="section-kicker">BEFORE VS AFTER SCAN</span><h2>Recent change</h2>{previousScan && currentScan ? <div className="compare-values"><div><span>Previous</span><strong>{previousScan.score}/100</strong><small>{previousScan.disease}</small></div><b className={scoreChange >= 0 ? "positive" : "negative"}>{scoreChange >= 0 ? "+" : ""}{scoreChange} points {scoreChange >= 0 ? "↑" : "↓"}</b><div><span>Current</span><strong>{currentScan.score}/100</strong><small>{currentScan.disease}</small></div></div> : <p>Two stored scans are required to compare results.</p>}<button type="button" className="compare-button" onClick={() => history.length >= 2 && chooseHistory(history[1])}>Compare stored scans</button></article></section>

      {reportVisible && <section className="health-card report-card"><span className="section-kicker">HEALTH REPORT</span><h2>{selectedCrop} · {latestScan.time}</h2><p>Overall health: {currentScore}/100 · {status.label}</p><p>Detected condition: {result?.disease || "No result"} · Severity: {severity} · Confidence: {result?.confidence || "--"}</p><p>Affected zone: {selectedZone.name} · Trend: {scoreChange >= 0 ? "Stable/improving" : "Declining"}</p><p>Next steps: Inspect the indicated zone, monitor after management, and consult a local agriculture expert for treatment decisions.</p></section>}
      <p className="health-footer">Prototype mode · Historical zones and trends are deterministic demo data. Live image analysis uses the existing AgriVision disease service.</p>
    </main>
  </>;
}

export default CropHealth;
