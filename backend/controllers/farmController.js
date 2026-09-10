const Farm = require("../models/Farm");

// Add a new farm
const addFarm = async (req, res) => {
  try {
    const { farmName, location, crop, area } = req.body;

    // Create farm
    const farm = await Farm.create({
      farmer: req.user.id,
      farmName,
      location,
      crop,
      area,
    });

    res.status(201).json({
      message: "Farm added successfully",
      farm,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// Get farms belonging to the logged-in farmer
const getMyFarms = async (req, res) => {
  try {
    const farms = await Farm.find({ farmer: req.user.id });

    res.status(200).json({
      farms,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};
// Delete a farm
const deleteFarm = async (req, res) => {
  try {
    const farm = await Farm.findOneAndDelete({
      _id: req.params.id,
      farmer: req.user.id,
    });

    if (!farm) {
      return res.status(404).json({
        message: "Farm not found",
      });
    }

    res.status(200).json({
      message: "Farm deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = {
  addFarm,
  getMyFarms,
  deleteFarm,
};