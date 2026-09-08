import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/Weather.css";

function Weather() {
  const [city, setCity] = useState("Vellore");
  const [searchCity, setSearchCity] = useState("Vellore");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      setError("");

      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:5000/api/weather?city=${encodeURIComponent(city)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load weather");
        }

        setWeather(data);
      } catch (fetchError) {
        setWeather(null);
        setError(fetchError.message || "Unable to load weather");
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [city]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextCity = searchCity.trim();

    if (nextCity) {
      setCity(nextCity);
    }
  };

  return (
    <>
      <Navbar />

      <div className="weather-page">
        <div className="weather-header">
          <div>
            <p className="weather-eyebrow">LIVE FARM CONDITIONS</p>
            <h1>🌤 Weather Forecast</h1>
            <p>Get current weather updates to plan your farming activities.</p>
          </div>

          <form className="weather-search" onSubmit={handleSubmit}>
            <label htmlFor="weather-city">Search city</label>
            <div className="weather-search-row">
              <input
                id="weather-city"
                type="search"
                value={searchCity}
                onChange={(event) => setSearchCity(event.target.value)}
                placeholder="Enter a city"
              />
              <button type="submit">Update</button>
            </div>
          </form>
        </div>

        {loading && <p className="weather-status">Loading live weather...</p>}
        {!loading && error && <p className="weather-error">{error}</p>}

        {!loading && weather && (
          <div className="weather-container">
            <div className="weather-card weather-location-card">
              <h2>📍 Location</h2>
              <p>{weather.city}</p>
              <span>Current conditions</span>
            </div>

            <div className="weather-card">
              <h2>🌡 Temperature</h2>
              <p>{Math.round(weather.temperature)}°C</p>
              <span>Feels like {Math.round(weather.feelsLike)}°C</span>
            </div>

            <div className="weather-card">
              <h2>💧 Humidity</h2>
              <p>{weather.humidity}%</p>
              <span>Relative humidity</span>
            </div>

            <div className="weather-card">
              <h2>🌬 Wind Speed</h2>
              <p>{weather.windSpeed} m/s</p>
              <span>Measured at the selected city</span>
            </div>

            <div className="weather-card weather-condition-card">
              <h2>☀️ Condition</h2>
              <p>{weather.weather}</p>
              <span>{weather.description}</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Weather;