import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/SoilMoisture.css";

const farm = {
  name: "Green Valley Farm",
  location: "Vellore",
  crop: "Rice",
  area: "5 acres",
  soilType: "Loamy",
};

const initialHistory = [
  { time: "09:00", value: 48 },
  { time: "11:00", value: 45 },
  { time: "13:00", value: 42 },
  { time: "15:00", value: 39 },
  { time: "17:00", value: 42 },
  { time: "19:00", value: 44 },
];

const getMoistureStatus = (moisture) => {
  if (moisture <= 30) {
    return {
      label: "Low",
      className: "low",
      action: "Irrigation recommended",
      recommendation: "🚿 Irrigation recommended",
    };
  }
  if (moisture <= 60) {
    return {
      label: "Moderate",
      className: "moderate",
      action: "Normal monitoring",
      recommendation: "💧 Monitor soil moisture",
    };
  }
  if (moisture <= 80) {
    return {
      label: "Optimal",
      className: "optimal",
      action: "No irrigation required",
      recommendation: "✅ Soil moisture is sufficient",
    };
  }
  return {
    label: "High",
    className: "high",
    action: "Avoid irrigation",
    recommendation: "⚠️ Avoid irrigation — soil moisture is high",
  };
};

const formatTime = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

function SoilMoisture() {
  const [moisture, setMoisture] = useState(42);
  const [temperature, setTemperature] = useState(28);
  const [history, setHistory] = useState(initialHistory);
  const [lastUpdated, setLastUpdated] = useState("Just now");
  const status = useMemo(() => getMoistureStatus(moisture), [moisture]);

  const recordReading = () => {
    const nextMoisture = Math.floor(Math.random() * 66) + 20;
    const nextTemperature = Math.floor(Math.random() * 5) + 26;
    setMoisture(nextMoisture);
    setTemperature(nextTemperature);
    setHistory((currentHistory) => [...currentHistory.slice(-5), { time: formatTime(), value: nextMoisture }]);
    setLastUpdated("Just now");
  };

  useEffect(() => {
    const interval = window.setInterval(recordReading, 15000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <>
      <Navbar />
      <main className="soil-page">
        <header className="soil-header">
          <div>
            <span className="soil-eyebrow">FIELD CONDITIONS / DEMO SENSOR</span>
            <h1>Soil Moisture</h1>
            <p>Track simulated moisture conditions and irrigation readiness for your selected field.</p>
          </div>
          <span className="demo-badge">SIMULATED DATA</span>
        </header>

        <section className="soil-overview-grid">
          <article className="soil-card moisture-overview">
            <div className="card-heading"><div><span className="card-kicker">CURRENT READING</span><h2>Soil moisture</h2></div><span className={`status-badge ${status.className}`}>{status.label}</span></div>
            <div className="moisture-reading"><div className={`moisture-ring ${status.className}`} style={{ "--moisture": `${moisture}%` }}><strong>{moisture}%</strong><span>moisture</span></div><div className="reading-copy"><strong>{status.label}</strong><span>Moisture level is {status.label.toLowerCase()} for {farm.crop.toLowerCase()}.</span><small>Recommended action: <b>{status.action}</b></small></div></div>
          </article>

          <article className="soil-card sensor-card">
            <div className="card-heading"><div><span className="card-kicker">SENSOR STATUS</span><h2>AgriVision Soil Sensor 01</h2></div><span className="online-badge"><i /> Online</span></div>
            <div className="sensor-grid"><div><span>Temperature</span><strong>{temperature}°C</strong></div><div><span>Soil type</span><strong>{farm.soilType}</strong></div><div><span>Battery</span><strong>86%</strong></div><div><span>Signal</span><strong>Strong</strong></div></div>
            <p className="updated-label">Last reading: {lastUpdated}</p>
          </article>
        </section>

        <section className="soil-main-grid">
          <article className="soil-card farm-card"><div className="card-heading"><div><span className="card-kicker">SELECTED FIELD</span><h2>{farm.name}</h2></div><span className="farm-icon">⌂</span></div><dl className="farm-details"><div><dt>Location</dt><dd>{farm.location}</dd></div><div><dt>Crop</dt><dd>{farm.crop}</dd></div><div><dt>Area</dt><dd>{farm.area}</dd></div><div><dt>Soil</dt><dd>{farm.soilType}</dd></div></dl><p className="future-note">Farm data is structured for future Smart Irrigation integration.</p></article>

          <article className={`soil-card recommendation-card ${status.className}`}><span className="card-kicker">IRRIGATION RECOMMENDATION</span><h2>{status.recommendation}</h2><p>{status.label === "Low" ? "The crop may need water soon. Review the field before irrigating." : status.label === "High" ? "Pause watering and allow the soil to drain naturally." : "The current moisture reading is within a manageable range."}</p><button className="simulate-button" type="button" onClick={recordReading}>↻ Simulate New Reading</button></article>
        </section>

        <section className="soil-main-grid lower-grid">
          <article className="soil-card condition-card"><div className="card-heading"><div><span className="card-kicker">SOIL CONDITIONS</span><h2>Field indicators</h2></div><span className={`condition-label ${status.className}`}>{status.label}</span></div><div className="condition-list"><div><span className="condition-icon moisture">%</span><div><span>Moisture</span><strong>{moisture}%</strong></div><div className="mini-progress"><i style={{ width: `${moisture}%` }} /></div></div><div><span className="condition-icon temperature">°</span><div><span>Temperature</span><strong>{temperature}°C</strong></div><div className="mini-progress"><i className="temperature-fill" style={{ width: `${temperature * 2.5}%` }} /></div></div><div><span className="condition-icon soil">⌁</span><div><span>Soil type</span><strong>{farm.soilType}</strong></div><span className="soil-quality">Good drainage</span></div></div></article>

          <article className="soil-card history-card"><div className="card-heading"><div><span className="card-kicker">MOISTURE HISTORY</span><h2>Recent readings</h2></div><span className="history-range">Last 6 readings</span></div><div className="history-chart">{history.map((reading) => <div className="history-column" key={`${reading.time}-${reading.value}`}><span className="history-value">{reading.value}%</span><div className="history-bar"><i style={{ height: `${reading.value}%` }} /></div><span>{reading.time}</span></div>)}</div></article>
        </section>

        <p className="soil-footer-note">Prototype mode · No physical sensor connected. Values are simulated for demonstration.</p>
      </main>
    </>
  );
}

export default SoilMoisture;