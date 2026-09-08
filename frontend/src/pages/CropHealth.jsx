import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/Module.css";

function CropHealth() {
  return (
    <>
      <Navbar />

      <div className="module-page">

        <div className="module-card">

          <h1>🌿 Crop Health</h1>

          <p className="module-subtitle">
            AI-powered crop monitoring and disease analysis
          </p>

          <div className="info-box">

            <div className="info-item">
              <h3>Current Health</h3>
              <p className="green">🟢 Healthy</p>
            </div>

            <div className="info-item">
              <h3>Disease Risk</h3>
              <p className="green">🟢 Low</p>
            </div>

            <div className="info-item">
              <h3>AI Confidence</h3>
              <p>98%</p>
            </div>

            <div className="info-item">
              <h3>Last Scan</h3>
              <p>Today • 11:45 AM</p>
            </div>

          </div>

          <div className="recommendation">

            <h2>🌱 Recommendation</h2>

            <p>
              Your crops are healthy.
              No disease symptoms detected.
              Continue regular monitoring.
            </p>

          </div>

          <div className="button-group">

            <Link to="/disease-detection">
              <button className="module-btn">
                🌱 Analyze Crop
              </button>
            </Link>

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

export default CropHealth;