const express = require("express");

const router = express.Router();

const { getWeather } = require("../controllers/weathercontroller");

const protect = require("../middleware/authMiddleware");

router.get("/", protect, getWeather);

module.exports = router;