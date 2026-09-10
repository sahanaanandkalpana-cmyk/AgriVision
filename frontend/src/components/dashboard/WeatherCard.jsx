import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function WeatherCard() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://localhost:5000/api/weather?city=Vellore",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (response.ok) {
          setWeather(data);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error("Weather Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  return (
    <Link to="/weather" className="card-link">
      <div className="card">
        <h2>🌦 Weather</h2>

        {loading ? (
          <p>Loading weather...</p>
        ) : weather ? (
          <>
            <p>{weather.temperature}°C</p>

            <span>
              💧 Humidity: {weather.humidity}% • 💨 Wind:{" "}
              {weather.windSpeed} m/s
            </span>

            <p>🌤️ {weather.description}</p>
          </>
        ) : (
          <p>Unable to load weather</p>
        )}
      </div>
    </Link>
  );
}

export default WeatherCard;