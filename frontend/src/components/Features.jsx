import "../styles/Features.css";

function Features() {
  return (
    <section className="features">

      <h2 className="section-title">
        Why Choose AgriVision?
      </h2>

      <p className="section-subtitle">
        Empowering farmers with Artificial Intelligence,
        Automation and Real-time Analytics.
      </p>

      <div className="feature-container">

        <div className="feature-card">
          <div className="feature-icon">🚁</div>

          <h3>Drone Monitoring</h3>

          <p>
            AI-powered drones continuously monitor crops,
            identify unhealthy plants and provide real-time
            aerial surveillance.
          </p>
        </div>

        <div className="feature-card">

          <div className="feature-icon">💧</div>

          <h3>Smart Irrigation</h3>

          <p>
            Soil moisture sensors automatically irrigate
            crops only when required, saving water and
            improving crop growth.
          </p>

        </div>

        <div className="feature-card">

          <div className="feature-icon">🌿</div>

          <h3>Disease Detection</h3>

          <p>
            AI detects crop diseases early using computer
            vision and suggests the best treatment before
            infection spreads.
          </p>

        </div>

        <div className="feature-card">

          <div className="feature-icon">📈</div>

          <h3>Profit Prediction</h3>

          <p>
            Predicts expected revenue, cultivation cost,
            and market trends helping farmers maximize
            profitability.
          </p>

        </div>

      </div>

    </section>
  );
}

export default Features;