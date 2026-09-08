import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/Module.css";

function Drone() {
  return (
    <>
      <Navbar />

      <div className="module-page">

        <div className="module-card">

          <h1>🚁 Drone Monitoring</h1>

          <p className="module-subtitle">
            Monitor and control agricultural drone operations
          </p>

          <div className="info-box">

            <div className="info-item">
              <h3>Drone Status</h3>
              <p className="green">🟢 Flying</p>
            </div>

            <div className="info-item">
              <h3>Battery</h3>
              <p>91%</p>
            </div>

            <div className="info-item">
              <h3>Current Mission</h3>
              <p>North Field Survey</p>
            </div>

            <div className="info-item">
              <h3>Mission Progress</h3>
              <p>72%</p>
            </div>

            <div className="info-item">
              <h3>Images Captured</h3>
              <p>54</p>
            </div>

            <div className="info-item">
              <h3>Estimated Time Left</h3>
              <p>12 Minutes</p>
            </div>

          </div>

          <div className="recommendation">

            <h2>📋 Mission Summary</h2>

            <p>
              Drone is currently surveying the north field.
              Battery level is sufficient to complete the mission.
              No obstacles detected.
            </p>

          </div>

          <div className="button-group">

            <button
              className="module-btn"
              onClick={() => alert("🚁 Drone Mission Started Successfully!")}
            >
              🚀 Start Mission
            </button>

            <Link to="/dashboard">
              <button className="back-btn">
                ⬅ Back to Dashboard
              </button>
            </Link>

          </div>

        </div>

      </div>

    </>
  );
}

export default Drone;