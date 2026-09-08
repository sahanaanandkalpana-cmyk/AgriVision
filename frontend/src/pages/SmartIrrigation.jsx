import { useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/SmartIrrigation.css";

function SmartIrrigation() {
  const [pumpOn, setPumpOn] = useState(true);

  return (
    <>
      <Navbar />

      <div className="irrigation-page">
        <h1>💧 Smart Irrigation</h1>

        <p>
          Monitor soil moisture and control irrigation efficiently.
        </p>

        <div className="irrigation-grid">

          <div className="irrigation-card">
            <h2>🌱 Soil Moisture</h2>
            <h3>82%</h3>
          </div>

          <div className="irrigation-card">
            <h2>🚰 Water Tank</h2>
            <h3>78%</h3>
          </div>

          <div className="irrigation-card">
            <h2>⏱ Recommended Watering</h2>
            <h3>15 Minutes</h3>
          </div>

          <div className="irrigation-card">
            <h2>📅 Next Irrigation</h2>
            <h3>Tomorrow - 6:30 AM</h3>
          </div>

          <div className="pump-card">
            <h2>🔘 Pump Status</h2>

            <button
              className={pumpOn ? "on" : "off"}
              onClick={() => setPumpOn(!pumpOn)}
            >
              {pumpOn ? "🟢 Pump ON" : "🔴 Pump OFF"}
            </button>

          </div>

        </div>
      </div>
    </>
  );
}

export default SmartIrrigation;