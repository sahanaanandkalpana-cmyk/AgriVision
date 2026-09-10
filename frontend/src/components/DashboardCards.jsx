import "./styles/DashboardCards.css";

function DashboardCards() {
  return (
    <section className="dashboard-cards">

      <div className="card">
        <div className="icon">🌿</div>
        <h3>Crop Health</h3>
        <p>Analyze plant diseases using AI.</p>
        <button>Open</button>
      </div>

      <div className="card">
        <div className="icon">🌦️</div>
        <h3>Weather</h3>
        <p>Live weather and rainfall prediction.</p>
        <button>Open</button>
      </div>

      <div className="card">
        <div className="icon">💧</div>
        <h3>Irrigation</h3>
        <p>Smart watering recommendations.</p>
        <button>Open</button>
      </div>

      <div className="card">
        <div className="icon">📈</div>
        <h3>Yield Prediction</h3>
        <p>Estimate crop production using AI.</p>
        <button>Open</button>
      </div>

    </section>
  );
}

export default DashboardCards;