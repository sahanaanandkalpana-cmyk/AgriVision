import { useEffect, useState } from "react";

function FarmManagement() {
  const [farms, setFarms] = useState([]);
  const [farmName, setFarmName] = useState("");
  const [location, setLocation] = useState("");
  const [crop, setCrop] = useState("");
  const [area, setArea] = useState("");

  useEffect(() => {
    const fetchFarms = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:5000/api/farms", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        setFarms(data.farms);
      } catch (error) {
        console.error("Error fetching farms:", error);
      }
    };

    fetchFarms();
  }, []);
  const deleteFarm = async (farmId) => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `http://localhost:5000/api/farms/${farmId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (response.ok) {
      setFarms((previousFarms) =>
        previousFarms.filter((farm) => farm._id !== farmId)
      );

      alert("🗑️ Farm deleted successfully!");
    } else {
      alert(data.message || "Failed to delete farm");
    }
  } catch (error) {
    console.error(error);
    alert("Server Error");
  }
};

  return (
    <div>
      <h1>🌾 Farm Management</h1>

      <input
        type="text"
        placeholder="Farm Name"
        value={farmName}
        onChange={(e) => setFarmName(e.target.value)}
      />

      <input
        type="text"
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />

      <input
        type="text"
        placeholder="Crop"
        value={crop}
        onChange={(e) => setCrop(e.target.value)}
      />

      <input
        type="number"
        placeholder="Area (acres)"
        value={area}
        onChange={(e) => setArea(e.target.value)}
      />

      <button
  onClick={async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/farms/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            farmName,
            location,
            crop,
            area,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
  setFarms((previousFarms) => [...previousFarms, data.farm]);

  alert("🌾 Farm added successfully!");
  }else {
        alert(data.message || "Failed to add farm");
      }
    } catch (error) {
      console.error(error);
      alert("Server Error");
    }
  }}
>
  Add Farm
      </button>

      <h2>🌾 My Farms</h2>

      {farms.map((farm) => (
        <div key={farm._id}>
          <h3>{farm.farmName}</h3>
          <p>📍 Location: {farm.location}</p>
          <p>🌱 Crop: {farm.crop}</p>
          <p>📐 Area: {farm.area} acres</p>
          <button onClick={() => deleteFarm(farm._id)}>
          🗑️ Delete Farm
           </button>
        </div>
      ))}
    </div>
  );
}

export default FarmManagement;