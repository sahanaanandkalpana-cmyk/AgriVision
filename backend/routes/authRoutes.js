const express = require("express");
const router = express.Router();

const { registerFarmer, loginFarmer } = require("../controllers/authController");

// Register Route
router.post("/register", registerFarmer);
// Login Route
router.post("/login", loginFarmer);

module.exports = router;