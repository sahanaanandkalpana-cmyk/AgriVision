import { useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/CropRecommendation.css";

function CropRecommendation() {

  const crops = [
    {
      crop: "🌾 Rice",
      confidence: "97%",
      soil: "Loamy Soil",
      temperature: "30°C",
      humidity: "72%",
      weather: "Sunny"
    },
    {
      crop: "🌽 Maize",
      confidence: "95%",
      soil: "Black Soil",
      temperature: "28°C",
      humidity: "65%",
      weather: "Cloudy"
    },
    {
      crop: "🥔 Potato",
      confidence: "96%",
      soil: "Sandy Soil",
      temperature: "22°C",
      humidity: "70%",
      weather: "Cool"
    },
    {
      crop: "🍅 Tomato",
      confidence: "94%",
      soil: "Red Soil",
      temperature: "27°C",
      humidity: "68%",
      weather: "Partly Cloudy"
    }
  ];

  const [data, setData] = useState(crops[0]);

  const recommendCrop = () => {
    const randomCrop =
      crops[Math.floor(Math.random() * crops.length)];

    setData(randomCrop);
  };

  return (
    <>
      <Navbar />

      <div className="crop-page">

        <h1>🌱 AI Crop Recommendation</h1>

        <p>
          Get the best crop recommendation based on environmental conditions.
        </p>

        <div className="crop-grid">

          <div className="crop-card">
            <h2>🌍 Soil Type</h2>
            <h3>{data.soil}</h3>
          </div>

          <div className="crop-card">
            <h2>🌡 Temperature</h2>
            <h3>{data.temperature}</h3>
          </div>

          <div className="crop-card">
            <h2>💧 Humidity</h2>
            <h3>{data.humidity}</h3>
          </div>

          <div className="crop-card">
            <h2>☀ Weather</h2>
            <h3>{data.weather}</h3>
          </div>

        </div>

        <div className="result-card">

          <h2>Recommended Crop</h2>

          <h1>{data.crop}</h1>

          <h3>Confidence: {data.confidence}</h3>

          <button onClick={recommendCrop}>
            Recommend Another Crop
          </button>

        </div>

      </div>
    </>
  );
}

export default CropRecommendation;