import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../../api/authApi";
import "../styles/Login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [showPassword, setShowPassword] = useState(false);
const [loading, setLoading] = useState(false);

 const handleLogin = async () => {
  if (email === "" || password === "") {
    alert("Please enter your email and password.");
    return;
  }

  setLoading(true);

  try {
    const response = await API.post("/login", {
      email,
      password,
    });

   alert(response.data.message);

// Save JWT token
localStorage.setItem("token", response.data.token);

// Save farmer details
localStorage.setItem(
  "farmer",
  JSON.stringify(response.data.farmer)
);

navigate("/dashboard");
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
    <>
      <Navbar />

      <div className="login-page">
        <div className="login-card">

          

          <div className="login-header">

  <div className="farmer-icon">
    👨‍🌾
  </div>

  <h1>AgriVision</h1>

  <h2>Welcome Back, Farmer!</h2>

  <p>
    Login to access your smart farming dashboard and manage your crops with AI-powered insights.
  </p>

</div>

          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="password-box">

  <input
    type={showPassword ? "text" : "password"}
    placeholder="Enter Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
  />

  <span
    className="eye-icon"
    onClick={() => setShowPassword(!showPassword)}
  >
    {showPassword ? "🙈" : "👁️"}
  </span>

</div>
<div className="login-options">

  <label className="remember-me">
    <input type="checkbox" />
    Remember Me
  </label>

  <span
    className="forgot-password"
    onClick={() => alert("Forgot Password feature coming soon!")}
  >
    Forgot Password?
  </span>

</div>

          <button onClick={handleLogin} disabled={loading}>
  {loading ? "⏳ Logging In..." : "🚀 Login to Dashboard"}
</button>
<p className="register-link">
  Don't have an account?{" "}
  <span onClick={() => navigate("/register")}>
    Register here
  </span>
</p>
<p className="login-footer">
  🌱 Smart Farming Powered by AI
</p>

        </div>
      </div>
    </>
  );
}

export default Login;