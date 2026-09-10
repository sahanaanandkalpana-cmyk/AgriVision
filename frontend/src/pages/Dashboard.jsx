import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import "../styles/DashboardCards.css";
import WeatherCard from "../components/dashboard/WeatherCard";
import "../styles/Dashboard.css";
import Navbar from "../components/Navbar";

function Dashboard() {
  const [farmerName, setFarmerName] = useState("");
  const [farms, setFarms] = useState([]);
  const navigate = useNavigate();

useEffect(() => {
  const farmer = JSON.parse(localStorage.getItem("farmer"));

  if (farmer) {
    setFarmerName(farmer.name);
  }

  const fetchFarms = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:5000/api/farms", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("token");
          navigate("/login", { replace: true });
          return;
        }
        throw new Error(data.message || "Unable to load farms");
      }

      setFarms(Array.isArray(data.farms) ? data.farms : []);
      console.log("My farms:", data.farms);
    } catch (error) {
      console.error("Error fetching farms:", error);
    }
  };

  fetchFarms();
}, [navigate]);
const handleLogout = () => {
  localStorage.clear();
  navigate("/login");
};
const hour = new Date().getHours();

let greeting = "";

if (hour < 12) {
  greeting = "☀️ Good Morning";
} else if (hour < 17) {
  greeting = "🌤 Good Afternoon";
} else {
  greeting = "🌙 Good Evening";
}
  return (
    <>
      <Navbar />

      <div className="dashboard">

        <div className="dashboard-header">

  <div>
    <h1>🌱 AgriVision Dashboard</h1>
    <p>
  {greeting}, {farmerName || "Farmer"} 👨‍🌾
</p>
  </div>

  <button
    className="logout-btn"
    onClick={handleLogout}
  >
    🚪 Logout
  </button>

</div>

<div className="stats-grid">

  <div className="stat-card">
    <h2>🌾 Active Crops</h2>
  <h3>{new Set(farms.map((farm) => farm.crop)).size}</h3>
  </div>

  <div className="stat-card">
    <h2>📍 Farms Monitored</h2>
    <h3>{farms.length}</h3>
  </div>

  <div className="stat-card">
    <h2>🤖 AI Predictions</h2>
    <h3>98%</h3>
  </div>

  <div className="stat-card">
    <h2>💧 Water Saved</h2>
    <h3>32%</h3>
  </div>

</div>
<div className="stat-card">
  <h2>📐 Total Farm Area</h2>
  <h3>
    {farms.reduce((total, farm) => total + Number(farm.area), 0)} acres
  </h3>
</div>

<div className="my-farms">
  <div className="my-farms-header">
    <h2>🌾 My Farms</h2>
    <button
      className="add-farm-btn"
      onClick={() => navigate("/farm-management")}
    >
      Add
    </button>
  </div>

  {farms.map((farm) => (
    <div className="farm-item" key={farm._id}>
      <h3>{farm.farmName}</h3>
      <p>📍 {farm.location}</p>
      <p>🌱 Crop: {farm.crop}</p>
      <p>📐 Area: {farm.area} acres</p>
    </div>
  ))}
</div>
        <div className="dashboard-grid">

          <WeatherCard />

          <Link to="/crop-health" className="card-link">

  <div className="card">

    <h2>🌿 Crop Health</h2>

    <p>Healthy</p>

    <span>98% AI Confidence</span>

  </div>

</Link>

          <Link to="/soil-moisture" className="card-link">
  <div className="card">
    <h2>💧 Soil Moisture</h2>
    <p>82%</p>
    <span>Irrigation Not Needed</span>
  </div>
</Link>

         <Link to="/drone-monitoring" className="card-link">
  <div className="card">
    <h2>🚁 Drone</h2>
    <p>Flying</p>
    <span>Battery: 91%</span>
  </div>
</Link>

         <Link to="/profit-estimation" className="card-link">
  <div className="card">
    <h2>📈 Estimated Profit</h2>
    <p>₹2,45,000</p>
    <span>This Season</span>
  </div>
</Link>

        <Link to="/ai-assistant" className="card-link">
  <div className="card">
    <h2>🤖 AI Assistant</h2>
    <p>Ready</p>
    <span>Ask Anything</span>
  </div>
</Link>

          <Link to="/disease-detection" className="card-link">
  <div className="card">
    <h2>🌿 Disease Detection</h2>
    <p>Detect crop diseases</p>
    <span>AI Image Analysis</span>
  </div>
</Link>

<Link to="/smart-irrigation" className="card-link">
  <div className="card">
    <h2>💧 Smart Irrigation</h2>
    <p>Monitor water usage</p>
    <span>Soil Moisture & Pump</span>
  </div>
</Link>

<Link to="/crop-recommendation" className="card-link">
  <div className="card">
    <h2>🌱 Crop Recommendation</h2>
    <p>AI Crop Suggestion</p>
    <span>Based on Soil & Weather</span>
  </div>
</Link>

        </div>

      </div>
    </>
  );
}

export default Dashboard;