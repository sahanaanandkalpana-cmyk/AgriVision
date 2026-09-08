import { Link } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">
        🌱 <span>AgriVision</span>
      </div>

      <ul className="nav-links">
        <li>
          <Link to="/">Home</Link>
        </li>

        <li>
          <Link to="/features">Features</Link>
        </li>

        <li>
          <Link to="/how-it-works">How It Works</Link>
        </li>

        <li>
          <Link to="/about">About</Link>
        </li>

        <li>
          <Link to="/contact">Contact</Link>
        </li>

      </ul>

      <Link to="/login" className="get-started">
  Get Started
</Link>
    </nav>
  );
}

export default Navbar;