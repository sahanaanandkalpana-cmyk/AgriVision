import { useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/Weather.css";

function Weather() {
    const [weather] = useState({
  location: "Chennai",
  temperature: "32°C",
  humidity: "74%",
  wind: "12 km/h",
  rain: "40%",
  condition: "Partly Cloudy"
});
  return (
    <>
      <Navbar />

      <div className="weather-page">
        <h1>🌤 Weather Forecast</h1>

        <p>
          Get the latest weather updates to plan your farming activities.
        </p>

        <div className="weather-container">

          <div className="weather-card">
            <h2>📍 Location</h2>
            <p>{weather.location}</p>
          </div>

          <div className="weather-card">
            <h2>🌡 Temperature</h2>
            <p>{weather.temperature}</p>
          </div>

          <div className="weather-card">
            <h2>💧 Humidity</h2>
            <p>{weather.humidity}</p>
          </div>

          <div className="weather-card">
            <h2>🌬 Wind Speed</h2>
            <p>{weather.wind}</p>
          </div>

          <div className="weather-card">
            <h2>🌧 Rain Chance</h2>
            <p>{weather.rain}</p>
          </div>

          <div className="weather-card">
            <h2>☀️ Condition</h2>
            <p>{weather.condition}</p>
          </div>

        </div>
      </div>
    </>
  );
}

export default Weather;