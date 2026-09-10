const mongoose = require("mongoose");

const farmSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Farmer",
      required: true,
    },
    farmName: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    crop: {
      type: String,
      required: true,
    },
    area: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Farm", farmSchema);