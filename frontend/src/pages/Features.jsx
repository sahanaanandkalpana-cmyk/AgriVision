import Navbar from "../components/Navbar";
import "../styles/Features.css";

function Features() {

  const features = [
    {
      icon: "🌿",
      title: "AI Disease Detection",
      description: "Detect crop diseases using AI image analysis."
    },
    {
      icon: "💧",
      title: "Smart Irrigation",
      description: "Monitor soil moisture and control irrigation."
    },
    {
      icon: "🌦",
      title: "Live Weather",
      description: "Get weather forecasts and climate updates."
    },
    {
      icon: "🌱",
      title: "Crop Recommendation",
      description: "AI recommends the best crop for your farm."
    },
    {
      icon: "🚁",
      title: "Drone Monitoring",
      description: "Monitor large farms using drone technology."
    },
    {
      icon: "📈",
      title: "Profit Estimation",
      description: "Estimate seasonal income based on crop yield."
    },
    {
      icon: "🤖",
      title: "AI Assistant",
      description: "Ask farming questions and receive AI guidance."
    },
    {
      icon: "📊",
      title: "Smart Dashboard",
      description: "Manage every farming activity from one place."
    }
  ];

  return (
    <>
      <Navbar />

      <div className="features-page">

        <h1>✨ AgriVision Features</h1>

        <p>
          Discover the intelligent tools available to make farming smarter,
          easier, and more productive.
        </p>

        <div className="features-grid">

          {features.map((feature, index) => (
            <div className="feature-card" key={index}>

              <div className="feature-icon">
                {feature.icon}
              </div>

              <h2>{feature.title}</h2>

              <p>{feature.description}</p>

            </div>
          ))}

        </div>

      </div>
    </>
  );
}

export default Features;
