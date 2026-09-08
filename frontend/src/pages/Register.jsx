import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/authApi";
import "../styles/Register.css";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      alert("Please fill all fields.");
      return;
    }

    setLoading(true);

    try {
      const response = await API.post("/register", {
        name,
        email,
        password,
      });

      alert(response.data.message);

      // Go to login after successful registration
      navigate("/login");

    } catch (error) {
      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert("Server Error");
      }
    }

    setLoading(false);
  };

  return (
    <div className="register-page">
      <div className="register-card">

        <h1>🌱 Create Farmer Account</h1>

        <p>Join AgriVision and manage your farm smarter.</p>

        <form onSubmit={handleRegister}>

          <input
            type="text"
            placeholder="Enter Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" disabled={loading}>
            {loading
              ? "⏳ Creating Account..."
              : "🌾 Create Farmer Account"}
          </button>

        </form>

        <p>
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            style={{ cursor: "pointer" }}
          >
            Login
          </span>
        </p>

      </div>
    </div>
  );
}

export default Register;