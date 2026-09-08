import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/Module.css";

function SoilMoisture() {
  return (
    <>
      <Navbar />

      <div className="module-page">

        <div className="module-card">

          <h1>💧 Soil Moisture</h1>

          <p className="module-subtitle">
            Real-time irrigation monitoring and recommendations
          </p>

          <div className="info-box">

            <div className="info-item">
              <h3>Current Moisture</h3>
              <p className="green">82%</p>
            </div>

            <div className="info-item">
              <h3>Pump Status</h3>
              <p>🔴 OFF</p>
            </div>

            <div className="info-item">
              <h3>Next Irrigation</h3>
              <p>Tomorrow • 7:00 AM</p>
            </div>

            <div className="info-item">
              <h3>Field Condition</h3>
              <p>Optimal</p>
            </div>

          </div>

          <div className="recommendation">

            <h2>💡 AI Recommendation</h2>

            <p>
              Soil moisture is sufficient.
              Irrigation is not required at the moment.
              Check again after 24 hours.
            </p>

          </div>

          <div className="button-group">

            <button
              className="module-btn"
              onClick={() => alert("💧 Irrigation Started Successfully!")}
            >
              💧 Start Irrigation
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

export default SoilMoisture;