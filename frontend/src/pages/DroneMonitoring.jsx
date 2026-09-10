import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/DroneMonitoring.css";

const zones = [
  { name: "Zone A", health: 92, status: "Monitored", alert: "Low", tone: "good" },
  { name: "Zone B", health: 74, status: "Water Stress", alert: "Medium", tone: "medium" },
  { name: "Zone C", health: 68, status: "Disease Alert", alert: "High", tone: "high" },
  { name: "Zone D", health: 89, status: "Healthy", alert: "None", tone: "good" },
];

const alerts = [
  { severity: "Medium", zone: "Zone B", description: "Low moisture detected", time: "2 min ago", tone: "medium" },
  { severity: "High", zone: "Zone C", description: "Possible crop stress detected", time: "5 min ago", tone: "high" },
  { severity: "High", zone: "Zone D", description: "Disease risk detected", time: "9 min ago", tone: "high" },
];

function ProgressBar({ value, tone = "green" }) {
  return (
    <div className="progress-track" aria-label={`${value}%`}>
      <span className={`progress-fill ${tone}`} style={{ width: `${value}%` }} />
    </div>
  );
}

function DroneMonitoring() {
  const [missionState, setMissionState] = useState("idle");
  const [progress, setProgress] = useState(68);
  const [battery, setBattery] = useState(82);
  const [flightTime, setFlightTime] = useState(18);
  const [altitude, setAltitude] = useState(120);
  const [speed, setSpeed] = useState(18);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    if (missionState !== "running") return undefined;

    const interval = window.setInterval(() => {
      setProgress((currentProgress) => {
        const nextProgress = Math.min(currentProgress + 2, 100);
        if (nextProgress >= 100) setMissionState("complete");
        return nextProgress;
      });
      setBattery((currentBattery) => Math.max(currentBattery - 1, 15));
      setFlightTime((currentTime) => currentTime + 1);
      setAltitude((currentAltitude) => currentAltitude >= 138 ? 112 : currentAltitude + 3);
      setSpeed((currentSpeed) => currentSpeed >= 24 ? 16 : currentSpeed + 2);
      setLastUpdated(new Date());
    }, 1000);

    return () => window.clearInterval(interval);
  }, [missionState]);

  useEffect(() => {
    if (missionState !== "returning") return undefined;

    const timeout = window.setTimeout(() => {
      setMissionState("base");
      setLastUpdated(new Date());
    }, 1400);

    return () => window.clearTimeout(timeout);
  }, [missionState]);

  const startMission = () => {
    if (missionState === "base" || missionState === "complete") {
      setProgress(0);
      setBattery(82);
      setFlightTime(18);
      setAltitude(120);
      setSpeed(18);
    }
    setMissionState("running");
    setLastUpdated(new Date());
  };

  const pauseMission = () => {
    setMissionState("paused");
    setLastUpdated(new Date());
  };

  const resumeMission = () => {
    setMissionState("running");
    setLastUpdated(new Date());
  };

  const returnToBase = () => {
    setMissionState("returning");
    setLastUpdated(new Date());
  };

  const simulateScan = () => {
    setProgress((currentProgress) => Math.min(currentProgress + 5, 100));
    setBattery((currentBattery) => Math.max(currentBattery - 1, 15));
    setFlightTime((currentTime) => currentTime + 1);
    setAltitude((currentAltitude) => currentAltitude + 2);
    setSpeed((currentSpeed) => Math.min(currentSpeed + 1, 26));
    setMissionState((currentState) => currentState === "complete" ? "complete" : "running");
    setLastUpdated(new Date());
  };

  const areaScanned = (5 * progress) / 100;
  const areaRemaining = 5 - areaScanned;
  const currentZone = progress < 25 ? "Zone A" : progress < 50 ? "Zone B" : progress < 75 ? "Zone C" : "Zone D";
  const coverage = Math.round(progress * 0.82);
  const statusLabel = {
    idle: "Flying / Monitoring",
    running: "Flying / Monitoring",
    paused: "Mission Paused",
    returning: "Returning to Base",
    base: "Drone at Base",
    complete: "Survey Complete",
  }[missionState];

  const canStart = ["idle", "base", "complete"].includes(missionState);
  const canPause = missionState === "running";
  const canResume = missionState === "paused";
  const canReturn = ["running", "paused", "complete"].includes(missionState);

  return (
    <>
      <Navbar />

      <main className="drone-page">
        <header className="drone-header">
          <div>
            <span className="eyebrow">FIELD OPERATIONS / LIVE SIMULATION</span>
            <h1>Drone Monitoring</h1>
            <p>Simulate an aerial crop health survey across Green Valley Farm.</p>
          </div>
          <span className={`mission-badge ${missionState}`}><span className="status-dot" /> {statusLabel}</span>
        </header>

        <section className="status-layout">
          <article className="panel status-panel">
            <div className="panel-heading"><div><span className="panel-kicker">AIRCRAFT STATUS</span><h2>AgriVision Drone 01</h2></div><span className="signal-status"><span className="signal-bars">▮▮▮</span> 94% Strong</span></div>
            <div className="status-grid">
              <div className="status-value"><span>Status</span><strong>{statusLabel}</strong></div>
              <div className="status-value"><span>Current Mission</span><strong>Crop Health Survey</strong></div>
              <div className="status-value"><span>Current Field / Zone</span><strong>Green Valley Farm / {currentZone}</strong></div>
              <div className="status-value"><span>Flight Time</span><strong>{flightTime} min</strong></div>
            </div>
            <div className="meter-row"><div><span>Battery</span><strong>{battery}%</strong></div><ProgressBar value={battery} /></div>
            <div className="meter-row"><div><span>Signal strength</span><strong>94%</strong></div><ProgressBar value={94} tone="blue" /></div>
            <p className="updated-time">Last updated {lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</p>
          </article>

          <article className="panel mission-panel">
            <div className="panel-heading"><div><span className="panel-kicker">MISSION CONTROL</span><h2>Crop Health Survey</h2></div><span className="simulation-tag">DEMO MODE</span></div>
            <div className="control-row">
              <button type="button" className="control-button primary" onClick={startMission} disabled={!canStart}>🚀 Start Mission</button>
              <button type="button" className="control-button secondary" onClick={pauseMission} disabled={!canPause}>⏸ Pause Mission</button>
              <button type="button" className="control-button resume" onClick={resumeMission} disabled={!canResume}>▶ Resume Mission</button>
              <button type="button" className="control-button outline" onClick={returnToBase} disabled={!canReturn}>🏠 Return to Base</button>
              <button type="button" className="control-button scan" onClick={simulateScan} disabled={missionState === "returning" || missionState === "base"}>✦ Simulate New Scan</button>
            </div>
            <div className="mission-progress"><div><span>Monitoring progress</span><strong>{progress}%</strong></div><ProgressBar value={progress} tone="blue" /></div>
          </article>
        </section>

        <section className="field-layout">
          <article className="panel field-panel">
            <div className="panel-heading"><div><span className="panel-kicker">FIELD SCAN</span><h2>Green Valley Farm</h2></div><span className="area-label">5 acres</span></div>
            <div className="field-map" aria-label="Simulated farm field map">
              <div className="field-boundary">
                <div className="crop-zone zone-a">A<span>92% healthy</span></div><div className="crop-zone zone-b">B<span>74% healthy</span></div><div className="crop-zone zone-c">C<span>68% healthy</span></div><div className="crop-zone zone-d">D<span>89% healthy</span></div>
                <div className="flight-path" /><div className="scanned-overlay" style={{ width: `${progress}%` }} /><div className="base-marker">BASE</div><div className="drone-marker" style={{ left: `${Math.max(8, Math.min(progress, 92))}%` }}><span>✦</span></div>
              </div>
              <div className="map-legend"><span><i className="legend-swatch scanned" /> Scanned area</span><span><i className="legend-swatch remaining" /> Remaining area</span><span><i className="legend-swatch drone" /> Drone</span></div>
            </div>
          </article>
          <div className="stats-grid">
            <article className="stat-card"><span>Total Field Area</span><strong>5 <small>acres</small></strong><em>Green Valley Farm</em></article>
            <article className="stat-card"><span>Area Scanned</span><strong>{areaScanned.toFixed(1)} <small>acres</small></strong><ProgressBar value={progress} /></article>
            <article className="stat-card"><span>Area Remaining</span><strong>{areaRemaining.toFixed(1)} <small>acres</small></strong><ProgressBar value={100 - progress} tone="amber" /></article>
            <article className="stat-card"><span>Mission Completion</span><strong>{progress}<small>%</small></strong><ProgressBar value={progress} tone="blue" /></article>
            <article className="stat-card"><span>Crop Health</span><strong>82<small>%</small></strong><ProgressBar value={82} /></article>
            <article className="stat-card"><span>Alerts Detected</span><strong>3</strong><em>Needs review</em></article>
          </div>
        </section>

        <section className="telemetry-grid">
          <article className="panel telemetry-panel"><div className="panel-heading"><div><span className="panel-kicker">LIVE TELEMETRY</span><h2>Flight data</h2></div><span className="live-tag"><span className="status-dot" /> LIVE</span></div><div className="telemetry-values"><div><span>Altitude</span><strong>{altitude} m</strong></div><div><span>Speed</span><strong>{speed} km/h</strong></div><div><span>Battery</span><strong>{battery}%</strong></div><div><span>Signal</span><strong>94%</strong></div><div><span>Flight time</span><strong>{flightTime} min</strong></div><div><span>Coverage</span><strong>{coverage}%</strong></div></div></article>
        </section>

        <section className="lower-grid">
          <article className="panel health-panel"><div className="panel-heading"><div><span className="panel-kicker">CROP HEALTH</span><h2>Field condition</h2></div><span className="health-score">82% healthy</span></div><div className="health-summary"><div className="health-ring"><strong>82%</strong><span>Healthy</span></div><div className="health-bars"><div><div><span>Healthy Area</span><strong>82%</strong></div><ProgressBar value={82} /></div><div><div><span>At-risk Area</span><strong>18%</strong></div><ProgressBar value={18} tone="red" /></div></div></div><div className="health-categories"><div><span>🌱</span><b>Healthy Area</b><strong>82%</strong></div><div><span>💧</span><b>Moderate Risk</b><strong>9%</strong></div><div><span>⚠️</span><b>Critical Area</b><strong>6%</strong></div><div><span>🦠</span><b>Disease Alerts</b><strong>3</strong></div></div></article>
          <article className="panel alerts-panel"><div className="panel-heading"><div><span className="panel-kicker">ATTENTION QUEUE</span><h2>Drone alerts</h2></div><span className="alert-count">3 active</span></div><div className="alerts-list">{alerts.map((alert) => <div className="alert-row" key={`${alert.zone}-${alert.severity}`}><span className={`alert-icon ${alert.tone}`}>!</span><div><div className="alert-title"><strong>{alert.description}</strong><span className={`severity ${alert.tone}`}>{alert.severity}</span></div><p>{alert.zone} · {alert.time}</p></div></div>)}</div></article>
        </section>

        <section className="panel zones-panel"><div className="panel-heading"><div><span className="panel-kicker">FIELD BREAKDOWN</span><h2>Monitoring zones</h2></div></div><div className="zone-grid">{zones.map((zone) => <div className="zone-card" key={zone.name}><div className="zone-top"><strong>{zone.name}</strong><span className={`zone-status ${zone.tone}`}>{zone.alert === "None" ? "Healthy" : zone.alert}</span></div><div className="zone-health"><strong>{zone.health}%</strong><span>Crop health</span></div><ProgressBar value={zone.health} tone={zone.tone === "high" ? "red" : zone.tone === "medium" ? "amber" : "green"} /><span className="zone-monitor">{zone.status}</span></div>)}</div></section>
      </main>
    </>
  );
}

export default DroneMonitoring;