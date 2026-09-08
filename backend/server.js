const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const weatherRoutes = require("./routes/weatherRoutes");
const farmRoutes = require("./routes/farmRoutes");
const assistantRoutes = require("./routes/assistantRoutes");

// Load environment variables
dotenv.config();

// Connect Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api/farms", farmRoutes);
app.use("/api/assistant", assistantRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("🚀 AgriVision Backend Running Successfully!");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});