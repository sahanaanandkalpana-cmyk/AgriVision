import { useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/DroneMonitoring.css";

function DroneMonitoring() {

  const scanData = [
    {
      battery: "82%",
      gps: "Connected",
      area: "68%",
      alerts: "4 Detected",
      status: "🟢 Flying"
    },
    {
      battery: "76%",
      gps: "Connected",
      area: "74%",
      alerts: "2 Detected",
      status: "🟢 Flying"
    },
    {
      battery: "69%",
      gps: "Connected",
      area: "85%",
      alerts: "1 Detected",
      status: "🟡 Returning"
    },
    {
      battery: "95%",
      gps: "Connected",
      area: "40%",
      alerts: "No Disease",
      status: "🟢 Flying"
    }
  ];

  const [data, setData] = useState(scanData[0]);

  const startScan = () => {
    const random =
      scanData[Math.floor(Math.random() * scanData.length)];

    setData(random);
  };

  return (
    <>
      <Navbar />

      <div className="drone-page">

        <h1>🚁 Drone Monitoring</h1>

        <p>
          Monitor crop fields using intelligent drone surveillance.
        </p>

        <div className="drone-grid">

          <div className="drone-card">
            <h2>🔋 Battery</h2>
            <h3>{data.battery}</h3>
          </div>

          <div className="drone-card">
            <h2>📍 GPS Status</h2>
            <h3>{data.gps}</h3>
          </div>

          <div className="drone-card">
            <h2>🌿 Area Covered</h2>
            <h3>{data.area}</h3>
          </div>

          <div className="drone-card">
            <h2>⚠ Disease Alerts</h2>
            <h3>{data.alerts}</h3>
          </div>

        </div>

        <div className="drone-result">

          <h2>Drone Status</h2>

          <h1>{data.status}</h1>

          <button onClick={startScan}>
            🚁 Start Scan
          </button>

        </div>

      </div>
    </>
  );
}

export default DroneMonitoring;