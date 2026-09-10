const express = require("express");

const router = express.Router();
const { detectDisease } = require("../controllers/diseaseController");

router.post("/", detectDisease);

module.exports = router;