const express = require("express");
const router = express.Router();

const { addFarm, getMyFarms, deleteFarm } = require("../controllers/farmController");
const protect = require("../middleware/authMiddleware");

// Add Farm
router.post("/add", protect, addFarm);
router.get("/", protect, getMyFarms);
router.delete("/:id", protect, deleteFarm);

module.exports = router;