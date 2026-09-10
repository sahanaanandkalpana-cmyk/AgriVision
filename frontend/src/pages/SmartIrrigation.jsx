import { useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/SmartIrrigation.css";

const readingSequence = [42, 34, 28, 57, 68, 76, 84, 48];

const zoneSeeds = [
  { name: "Zone A", crop: "Tomato", moisture: 28, requirement: "High", delta: 3 },
  { name: "Zone B", crop: "Rice", moisture: 72, requirement: "Low", delta: -2 },
  { name: "Zone C", crop: "Wheat", moisture: 46, requirement: "Medium", delta: 4 },
  { name: "Zone D", crop: "Maize", moisture: 64, requirement: "Low", delta: -3 },
];

function getMoistureStatus(moisture) {
  if (moisture <= 30) return { label: "LOW / DRY", condition: "Dry", action: "Start irrigation", tone: "low" };
  if (moisture <= 60) return { label: "MODERATE", condition: "Moderate", action: "Irrigation may be required soon", tone: "moderate" };
  if (moisture <= 80) return { label: "OPTIMAL", condition: "Optimal", action: "No irrigation required", tone: "optimal" };
  return { label: "HIGH", condition: "Wet", action: "Avoid irrigation to prevent overwatering", tone: "high" };
}

function getZoneStatus(moisture) {
  if (moisture <= 30) return { label: "Dry", tone: "low", irrigation: "Required" };
  if (moisture <= 60) return { label: "Moderate", tone: "moderate", irrigation: "Monitor" };
  if (moisture <= 80) return { label: "Optimal", tone: "optimal", irrigation: "OFF" };
  return { label: "High", tone: "high", irrigation: "OFF" };
}

function SmartIrrigation() {
  const [moisture, setMoisture] = useState(42);
  const [zones, setZones] = useState(zoneSeeds);
  const [mode, setMode] = useState("automatic");
  const [irrigationOn, setIrrigationOn] = useState(false);
  const [readingIndex, setReadingIndex] = useState(0);
  const [waterUsed, setWaterUsed] = useState(420);
  const [cycles, setCycles] = useState(3);
  const [duration, setDuration] = useState(15);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const status = useMemo(() => getMoistureStatus(moisture), [moisture]);

  const setIrrigation = (nextState) => {
    setIrrigationOn(nextState);
    if (nextState) {
      setCycles((currentCycles) => currentCycles + 1);
      setDuration((currentDuration) => currentDuration + 5);
      setWaterUsed((currentWater) => currentWater + 60);
    }
    setLastUpdated(new Date());
  };

  const simulateReading = () => {
    const nextIndex = (readingIndex + 1) % readingSequence.length;
    const nextMoisture = readingSequence[nextIndex];
    setReadingIndex(nextIndex);
    setMoisture(nextMoisture);
    setZones((currentZones) => currentZones.map((zone) => ({
      ...zone,
      moisture: Math.max(18, Math.min(92, zone.moisture + zone.delta)),
    })));
    if (mode === "automatic") setIrrigationOn(nextMoisture <= 30);
    if (nextMoisture <= 30) setWaterUsed((currentWater) => currentWater + 40);
    setLastUpdated(new Date());
  };

  const explanation = status.tone === "low"
    ? "💧 Irrigation recommended because soil moisture is below the optimal range."
    : status.tone === "high"
      ? "⚠️ Irrigation paused because soil moisture is already high."
      : status.tone === "optimal"
        ? "✅ Irrigation not required because soil moisture is sufficient."
        : "💧 Monitor the field because moisture may require irrigation soon.";
  const isIrrigationOn = mode === "automatic" ? moisture <= 30 : irrigationOn;

  return (
    <>
      <Navbar />

      <main className="irrigation-page">
        <header className="irrigation-header">
          <div>
            <span className="irrigation-eyebrow">FIELD OPERATIONS / DEMO CONTROL</span>
            <h1>💧 Smart Irrigation</h1>
            <p>Turn soil readings into clear, simulated irrigation decisions for Green Valley Farm.</p>
          </div>
          <span className="prototype-badge">SIMULATED SYSTEM</span>
        </header>

        <section className="irrigation-status-grid">
          <article className={`irrigation-card status-card ${status.tone}`}>
            <div className="card-heading"><div><span className="card-kicker">IRRIGATION STATUS</span><h2>{status.label}</h2></div><span className={`status-pill ${status.tone}`}>{isIrrigationOn ? "ON" : "OFF"}</span></div>
            <div className="status-reading"><div className={`moisture-orb ${status.tone}`}><strong>{moisture}%</strong><span>soil moisture</span></div><div className="status-copy"><strong>{status.condition} soil</strong><span>Current moisture for the selected field.</span><small>Recommended action: <b>{status.action}</b></small></div></div>
            <p className="recommendation-explanation">{explanation}</p>
          </article>

          <article className="irrigation-card control-card">
            <div className="card-heading"><div><span className="card-kicker">SMART CONTROL</span><h2>Irrigation mode</h2></div><span className="demo-badge">PROTOTYPE</span></div>
            <div className="mode-switch" role="group" aria-label="Irrigation mode"><button type="button" className={mode === "automatic" ? "active" : ""} onClick={() => setMode("automatic")}>Automatic Mode</button><button type="button" className={mode === "manual" ? "active" : ""} onClick={() => setMode("manual")}>Manual Mode</button></div>
            <div className="control-actions"><button type="button" className="start-button" onClick={() => setIrrigation(true)} disabled={mode === "automatic"}>▶ Start Irrigation</button><button type="button" className="stop-button" onClick={() => setIrrigation(false)}>■ Stop Irrigation</button></div>
            <p className="control-note">{mode === "automatic" ? "Automatic decisions follow the soil moisture thresholds." : "Manual controls simulate the irrigation action for this demo."}</p>
          </article>
        </section>

        <section className="irrigation-main-grid">
          <article className="irrigation-card stats-card">
            <div className="card-heading"><div><span className="card-kicker">WATER USAGE</span><h2>Today's irrigation</h2></div><button type="button" className="reading-button" onClick={simulateReading}>↻ Simulate New Reading</button></div>
            <div className="usage-grid"><div><span>Water used today</span><strong>{waterUsed} L</strong></div><div><span>Estimated water saved</span><strong>32%</strong></div><div><span>Irrigation duration</span><strong>{duration} min</strong></div><div><span>Irrigation cycles</span><strong>{cycles}</strong></div><div><span>Current flow rate</span><strong>{isIrrigationOn ? "12" : "0"} L/min</strong></div></div>
            <p className="updated-label">Last updated: {lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</p>
          </article>

          <article className="irrigation-card intelligence-card"><div className="card-heading"><div><span className="card-kicker">FARM INTELLIGENCE</span><h2>Monitoring inputs</h2></div><span className="online-pill">● Active</span></div><div className="input-list"><div><span>🌱</span><div><strong>Soil Moisture</strong><small>{moisture}% · {status.condition}</small></div></div><div><span>🚁</span><div><strong>Drone Monitoring</strong><small>Active · field scan available</small></div></div><div><span>🌤️</span><div><strong>Weather</strong><small>28°C · 62% humidity · Low rain chance</small></div></div></div><p>Smart irrigation recommendation generated from farm conditions.</p></article>
        </section>

        <section className="irrigation-card zones-section">
          <div className="card-heading"><div><span className="card-kicker">FIELD / ZONE IRRIGATION</span><h2>Zone overview</h2></div><span className="zone-summary">4 monitored zones</span></div>
          <div className="zone-grid">{zones.map((zone) => { const zoneStatus = getZoneStatus(zone.moisture); return <article className="zone-card" key={zone.name}><div className="zone-top"><strong>{zone.name}</strong><span className={`status-pill ${zoneStatus.tone}`}>{zoneStatus.label}</span></div><h3>{zone.crop}</h3><div className="zone-reading"><span>Moisture</span><strong>{zone.moisture}%</strong></div><div className="zone-progress"><i className={zoneStatus.tone} style={{ width: `${zone.moisture}%` }} /></div><dl><div><dt>Water requirement</dt><dd>{zone.requirement}</dd></div><div><dt>Irrigation</dt><dd>{zoneStatus.irrigation}</dd></div></dl></article>; })}</div>
        </section>

        <p className="irrigation-footer">Prototype mode · No physical pump or sensor connected. All irrigation actions and readings are simulated.</p>
      </main>
    </>
  );
}

export default SmartIrrigation;