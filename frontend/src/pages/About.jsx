import Navbar from "../components/Navbar";
import "../styles/About.css";

function About() {
  return (
    <>
      <Navbar />

      <div className="about-page">

        <h1>🌱 About AgriVision</h1>

        <div className="about-card">

          <h2>Who We Are</h2>

          <p>
            AgriVision is an AI-powered smart farming platform designed to
            help farmers make better decisions using modern technology.
          </p>

          <h2>Our Mission</h2>

          <p>
            Our mission is to improve agricultural productivity by combining
            Artificial Intelligence, weather forecasting, smart irrigation,
            crop recommendation, drone monitoring, and profit estimation
            into one intelligent platform.
          </p>

          <h2>Our Vision</h2>

          <p>
            We envision a future where every farmer can access affordable,
            intelligent farming solutions that increase productivity,
            reduce resource wastage, and promote sustainable agriculture.
          </p>

        </div>

      </div>
    </>
  );
}

export default About;