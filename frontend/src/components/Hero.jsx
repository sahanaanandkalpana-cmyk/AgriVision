import "../styles/Hero.css";
import Navbar from "./Navbar";

function Hero() {
  return (
    <section className="hero">

      <div className="shape shape1"></div>
      <div className="shape shape2"></div>
      <div className="shape shape3"></div>
      <div className="shape shape4"></div>

      <Navbar />

      <div className="hero-card">

        <div className="hero-logo">
          🌱
        </div>

        <h1>AgriVision</h1>

        <h2>Smart AI Farming Assistant</h2>

        <p>
          Helping farmers improve crop health,
          detect diseases, predict crop yield and
          maximize profits using Artificial Intelligence.
        </p>

        <div className="hero-buttons">

          <button className="primary-btn">
            🚀 Get Started
          </button>

          <button className="secondary-btn">
            ▶ Watch Demo
          </button>

        </div>

      </div>

    </section>
  );
}

export default Hero;