const Farmer = require("../models/Farmer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register Farmer
const registerFarmer = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if farmer already exists
    const existingFarmer = await Farmer.findOne({ email });

    if (existingFarmer) {
      return res.status(400).json({
        message: "Farmer already exists",
      });
    }

    // Encrypt Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new farmer
    const farmer = await Farmer.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Farmer Registered Successfully",
      farmer,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// Login Farmer
const loginFarmer = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if farmer exists
    const farmer = await Farmer.findOne({ email });

    if (!farmer) {
      return res.status(400).json({
        message: "Invalid Email or Password",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, farmer.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid Email or Password",
      });
    }

    // Create JWT token
    const token = jwt.sign(
      {
        id: farmer._id,
        email: farmer.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.status(200).json({
      message: "Login Successful",
      token,
      farmer: {
        id: farmer._id,
        name: farmer.name,
        email: farmer.email,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = {
  registerFarmer,
  loginFarmer,
};