const express = require("express");

const router = express.Router();

const { getAssistantAdvice } = require("../controllers/assistantController");
const protect = require("../middleware/authMiddleware");

router.post("/", protect, getAssistantAdvice);

module.exports = router;
