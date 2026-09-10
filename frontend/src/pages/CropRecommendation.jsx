import { useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/CropRecommendation.css";

const defaultInputs = {
  soilType: "Loamy",
  ph: "6.5",
  temperature: "28",
  humidity: "65",
  rainfall: "900",
  season: "Kharif",
  area: "5",
  irrigation: "Available",
};

const crops = [
  { name: "Rice", icon: "🌾", soils: ["Clay", "Loamy", "Alluvial"], ph: [5.5, 7], temperature: [20, 35], humidity: [60, 90], rainfall: [1200, 2500], seasons: ["Kharif"], irrigation: "high", water: "High" },
  { name: "Wheat", icon: "🌾", soils: ["Loamy", "Alluvial", "Black Soil"], ph: [6, 7.5], temperature: [10, 25], humidity: [40, 70], rainfall: [300, 900], seasons: ["Rabi"], irrigation: "medium", water: "Medium" },
  { name: "Maize", icon: "🌽", soils: ["Loamy", "Sandy", "Alluvial"], ph: [5.5, 7.5], temperature: [18, 32], humidity: [50, 80], rainfall: [500, 1000], seasons: ["Kharif", "Rabi"], irrigation: "medium", water: "Medium" },
  { name: "Cotton", icon: "🌿", soils: ["Black Soil", "Loamy", "Alluvial"], ph: [5.5, 8], temperature: [21, 35], humidity: [40, 70], rainfall: [500, 1200], seasons: ["Kharif"], irrigation: "medium", water: "Medium" },
  { name: "Sugarcane", icon: "🎋", soils: ["Loamy", "Alluvial", "Black Soil"], ph: [6, 7.5], temperature: [20, 35], humidity: [60, 85], rainfall: [1500, 2500], seasons: ["Kharif", "Zaid"], irrigation: "high", water: "High" },
  { name: "Groundnut", icon: "🥜", soils: ["Sandy", "Red Soil", "Loamy"], ph: [5.5, 7], temperature: [22, 32], humidity: [45, 70], rainfall: [500, 1000], seasons: ["Kharif", "Zaid"], irrigation: "low", water: "Low" },
  { name: "Tomato", icon: "🍅", soils: ["Loamy", "Sandy", "Red Soil"], ph: [5.5, 7], temperature: [18, 30], humidity: [50, 75], rainfall: [400, 800], seasons: ["Kharif", "Rabi", "Zaid"], irrigation: "medium", water: "Medium" },
  { name: "Potato", icon: "🥔", soils: ["Sandy", "Loamy", "Alluvial"], ph: [5, 6.5], temperature: [15, 25], humidity: [50, 80], rainfall: [300, 700], seasons: ["Rabi"], irrigation: "medium", water: "Medium" },
  { name: "Onion", icon: "🧅", soils: ["Loamy", "Sandy", "Alluvial"], ph: [6, 7.5], temperature: [13, 30], humidity: [50, 75], rainfall: [350, 700], seasons: ["Rabi", "Kharif"], irrigation: "medium", water: "Medium" },
  { name: "Millet", icon: "🌱", soils: ["Sandy", "Red Soil", "Black Soil"], ph: [5.5, 7.5], temperature: [25, 35], humidity: [30, 60], rainfall: [350, 750], seasons: ["Kharif", "Zaid"], irrigation: "low", water: "Low" },
];

const rangeScore = (value, [minimum, maximum]) => {
  if (value >= minimum && value <= maximum) return 1;
  const distance = value < minimum ? minimum - value : value - maximum;
  return Math.max(0, 1 - distance / (maximum - minimum));
};

const scoreCrop = (crop, inputs) => {
  const factors = {
    soil: crop.soils.includes(inputs.soilType) ? 1 : 0.25,
    ph: rangeScore(Number(inputs.ph), crop.ph),
    temperature: rangeScore(Number(inputs.temperature), crop.temperature),
    humidity: rangeScore(Number(inputs.humidity), crop.humidity),
    rainfall: rangeScore(Number(inputs.rainfall), crop.rainfall),
    season: crop.seasons.includes(inputs.season) ? 1 : 0.35,
    irrigation: inputs.irrigation === "Available" ? 1 : crop.irrigation === "low" ? 1 : crop.irrigation === "medium" ? 0.65 : 0.35,
  };
  const score = Math.round(Object.values(factors).reduce((total, factor) => total + factor, 0) / Object.keys(factors).length * 100);
  return { ...crop, factors, score };
};

const getReason = (recommendation) => {
  const strongFactors = [
    [recommendation.factors.soil, `well suited to ${recommendation.soils[0].toLowerCase()} and nearby soil conditions`],
    [recommendation.factors.temperature, "temperature is within its preferred range"],
    [recommendation.factors.rainfall, "expected rainfall supports its water needs"],
    [recommendation.factors.season, `fits the ${recommendation.seasons[0]} season`],
  ].filter(([score]) => score >= 0.8).map(([, reason]) => reason);
  return strongFactors.slice(0, 2).join(" and ") || "matches the overall balance of the selected farm conditions";
};

function CropRecommendation() {
  const [inputs, setInputs] = useState(defaultInputs);
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState("");

  const updateInput = (event) => {
    setInputs((currentInputs) => ({ ...currentInputs, [event.target.name]: event.target.value }));
  };

  const recommendCrops = (event) => {
    event.preventDefault();
    if (Object.values(inputs).some((value) => value === "")) {
      setError("Please provide the required farm conditions to generate a recommendation.");
      return;
    }
    setError("");
    setRecommendations(crops.map((crop) => scoreCrop(crop, inputs)).sort((first, second) => second.score - first.score).slice(0, 3));
  };

  const resetInputs = () => {
    setInputs(defaultInputs);
    setRecommendations([]);
    setError("");
  };

  const topCrop = recommendations[0];
  const factorLabels = { soil: "Soil compatibility", temperature: "Temperature compatibility", rainfall: "Rainfall compatibility", season: "Season compatibility", irrigation: "Irrigation compatibility" };

  return (
    <>
      <Navbar />
      <main className="crop-page">
        <header className="crop-header"><div><span className="crop-eyebrow">FARM DECISION SUPPORT / DEMO ENGINE</span><h1>🌱 Crop Recommendation</h1><p>Match farm conditions with transparent agricultural rules to find suitable crops.</p></div><span className="crop-badge">RULE-BASED PROTOTYPE</span></header>

        <section className="crop-layout">
          <form className="crop-card condition-form" onSubmit={recommendCrops}>
            <div className="card-heading"><div><span className="card-kicker">FARM CONDITIONS</span><h2>Tell us about your field</h2></div><span className="step-label">01 / 02</span></div>
            <div className="form-grid">
              <label>Soil Type<select name="soilType" value={inputs.soilType} onChange={updateInput}><option>Loamy</option><option>Sandy</option><option>Clay</option><option>Black Soil</option><option>Red Soil</option><option>Alluvial</option></select></label>
              <label>Season<select name="season" value={inputs.season} onChange={updateInput}><option>Kharif</option><option>Rabi</option><option>Zaid</option></select></label>
              <label>Soil pH<input name="ph" type="number" min="3" max="10" step="0.1" value={inputs.ph} onChange={updateInput} /></label>
              <label>Temperature (°C)<input name="temperature" type="number" min="0" max="50" value={inputs.temperature} onChange={updateInput} /></label>
              <label>Humidity (%)<input name="humidity" type="number" min="0" max="100" value={inputs.humidity} onChange={updateInput} /></label>
              <label>Rainfall (mm)<input name="rainfall" type="number" min="0" value={inputs.rainfall} onChange={updateInput} /></label>
              <label>Farm Area (acres)<input name="area" type="number" min="0.1" step="0.1" value={inputs.area} onChange={updateInput} /></label>
              <label>Irrigation Availability<select name="irrigation" value={inputs.irrigation} onChange={updateInput}><option>Available</option><option>Not Available</option></select></label>
            </div>
            {error && <p className="form-error">{error}</p>}
            <div className="form-actions"><button className="recommend-button" type="submit">🌱 Get Crop Recommendation</button><button className="reset-button" type="button" onClick={resetInputs}>Reset</button></div>
          </form>

          <article className="crop-card context-card"><div className="card-heading"><div><span className="card-kicker">CURRENT FARM CONDITIONS</span><h2>Green Valley Farm</h2></div><span className="context-status">DEMO DATA</span></div><div className="context-list"><div><span>🌡️</span><div><strong>{inputs.temperature}°C</strong><small>Temperature</small></div></div><div><span>💧</span><div><strong>42%</strong><small>Soil moisture</small></div></div><div><span>🌧️</span><div><strong>{inputs.rainfall} mm</strong><small>Rainfall input</small></div></div><div><span>🌱</span><div><strong>{inputs.soilType}</strong><small>Soil type</small></div></div></div><div className="irrigation-context"><strong>💧 Irrigation Compatibility</strong><p>Current soil moisture: 42% · Irrigation: {inputs.irrigation}</p><span>Crop water requirement is evaluated in the recommendation score.</span></div></article>
        </section>

        {topCrop ? <>
          <section className="result-layout">
            <article className="crop-card top-result"><span className="card-kicker">TOP RECOMMENDED CROP</span><div className="top-result-title"><h2>{topCrop.icon} {topCrop.name}</h2><div><strong>{topCrop.score}%</strong><span>AgriVision Suitability Score</span></div></div><p>Recommended for your {inputs.area}-acre field because it {getReason(topCrop)}.</p><div className="factor-list">{Object.entries(factorLabels).map(([key, label]) => <div className="factor-row" key={key}><span>{label}</span><strong>{Math.round(topCrop.factors[key] * 100)}%</strong><i><b style={{ width: `${topCrop.factors[key] * 100}%` }} /></i></div>)}</div></article>
            <article className="crop-card why-card"><span className="card-kicker">WHY THIS CROP?</span><h2>Why AgriVision recommends {topCrop.name}</h2><div className="why-list"><div><span>🌱</span><p><strong>Soil</strong>Suitable for {inputs.soilType.toLowerCase()} soil.</p></div><div><span>🌡️</span><p><strong>Temperature</strong>{topCrop.factors.temperature >= 0.8 ? "Within" : "Near"} the recommended range.</p></div><div><span>🌧️</span><p><strong>Rainfall</strong>{topCrop.factors.rainfall >= 0.8 ? "Suitable" : "Manageable"} rainfall conditions.</p></div><div><span>☀️</span><p><strong>Season</strong>{topCrop.factors.season >= 0.8 ? "Suitable" : "Alternative"} for {inputs.season} season.</p></div><div><span>💧</span><p><strong>Irrigation</strong>{inputs.irrigation === "Available" ? "Irrigation availability is sufficient." : "Lower-water crops score higher without irrigation."}</p></div></div></article>
          </section>
          <section className="crop-card recommendations-card"><div className="card-heading"><div><span className="card-kicker">SUITABLE CROPS</span><h2>Top 3 recommendations</h2></div><span className="engine-note">Calculated from 7 conditions</span></div><div className="recommendation-list">{recommendations.map((recommendation, index) => <article key={recommendation.name} className="recommendation-item"><span className="rank">{["🥇", "🥈", "🥉"][index]}</span><span className="crop-icon">{recommendation.icon}</span><div><h3>{recommendation.name}</h3><p>Well suited because it {getReason(recommendation)}.</p></div><strong>{recommendation.score}%<small>suitability</small></strong></article>)}</div></section>
        </> : <section className="empty-result"><span>🌾</span><h2>Your recommendations will appear here</h2><p>Enter or adjust the farm conditions, then run the transparent AgriVision recommendation engine.</p></section>}
        <p className="crop-footer">Prototype mode · Recommendation scores are rule-based suitability matches, not trained AI confidence scores.</p>
      </main>
    </>
  );
}

export default CropRecommendation;
