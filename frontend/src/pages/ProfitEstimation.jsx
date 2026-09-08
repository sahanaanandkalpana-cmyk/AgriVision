import { useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/ProfitEstimation.css";

function ProfitEstimation() {

  const profits = [
    {
      crop: "🌾 Rice",
      area: "5 Acres",
      yield: "28 Tons",
      price: "₹2200 / Ton",
      profit: "₹61,600"
    },
    {
      crop: "🌽 Maize",
      area: "4 Acres",
      yield: "22 Tons",
      price: "₹1800 / Ton",
      profit: "₹39,600"
    },
    {
      crop: "🍅 Tomato",
      area: "3 Acres",
      yield: "18 Tons",
      price: "₹3500 / Ton",
      profit: "₹63,000"
    },
    {
      crop: "🥔 Potato",
      area: "6 Acres",
      yield: "35 Tons",
      price: "₹1700 / Ton",
      profit: "₹59,500"
    }
  ];

  const [data, setData] = useState(profits[0]);

  const calculateProfit = () => {
    const random =
      profits[Math.floor(Math.random() * profits.length)];

    setData(random);
  };

  return (
    <>
      <Navbar />

      <div className="profit-page">

        <h1>📈 Profit Estimation</h1>

        <p>
          Estimate your farming profit using crop production data.
        </p>

        <div className="profit-grid">

          <div className="profit-card">
            <h2>🌱 Crop</h2>
            <h3>{data.crop}</h3>
          </div>

          <div className="profit-card">
            <h2>🌍 Area</h2>
            <h3>{data.area}</h3>
          </div>

          <div className="profit-card">
            <h2>🌾 Expected Yield</h2>
            <h3>{data.yield}</h3>
          </div>

          <div className="profit-card">
            <h2>💰 Market Price</h2>
            <h3>{data.price}</h3>
          </div>

        </div>

        <div className="profit-result">

          <h2>Estimated Profit</h2>

          <h1>{data.profit}</h1>

          <button onClick={calculateProfit}>
            Calculate Again
          </button>

        </div>

      </div>
    </>
  );
}

export default ProfitEstimation;