const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { spawn } = require("child_process");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const weatherRoutes = require("./routes/weatherRoutes");
const farmRoutes = require("./routes/farmRoutes");
const assistantRoutes = require("./routes/assistantRoutes");
const diseaseRoutes = require("./routes/diseaseRoutes");

// Load environment variables
dotenv.config();

// Connect Database
connectDB();

const app = express();

const diseaseModel = spawn(process.env.PYTHON_COMMAND || "python", ["ml/disease_service.py"], {
  cwd: __dirname,
  stdio: "inherit",
});

process.on("exit", () => diseaseModel.kill());

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use("/api/auth", authRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api/farms", farmRoutes);
app.use("/api/assistant", assistantRoutes);
app.use("/api/disease", diseaseRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("🚀 AgriVision Backend Running Successfully!");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});