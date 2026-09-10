import Navbar from "../components/Navbar";
import "../styles/HowItWorks.css";

function HowItWorks() {

  const steps = [
    {
      number: "1️⃣",
      title: "Upload Crop Image",
      description: "The farmer uploads a crop image or enters farm details."
    },
    {
      number: "2️⃣",
      title: "AI Image Analysis",
      description: "Artificial Intelligence analyzes the uploaded crop image."
    },
    {
      number: "3️⃣",
      title: "Disease Detection",
      description: "The system detects diseases and recommends suitable medicines."
    },
    {
      number: "4️⃣",
      title: "Weather & Soil Analysis",
      description: "Weather conditions and soil information are analyzed."
    },
    {
      number: "5️⃣",
      title: "Crop Recommendation",
      description: "The best crop is recommended based on the available data."
    },
    {
      number: "6️⃣",
      title: "Smart Irrigation",
      description: "The system provides irrigation recommendations to save water."
    },
    {
      number: "7️⃣",
      title: "Profit Estimation",
      description: "Expected yield and profit are calculated for the selected crop."
    }
  ];

  return (
    <>
      <Navbar />

      <div className="how-page">

        <h1>⚙️ How AgriVision Works</h1>

        <p>
          AgriVision combines Artificial Intelligence, weather data,
          and smart farming techniques to help farmers make better decisions.
        </p>

        <div className="timeline">

          {steps.map((step, index) => (

            <div className="step-card" key={index}>

              <div className="step-number">
                {step.number}
              </div>

              <h2>{step.title}</h2>

              <p>{step.description}</p>

            </div>

          ))}

        </div>

      </div>
    </>
  );
}

export default HowItWorks;