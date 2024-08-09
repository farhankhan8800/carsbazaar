const express = require("express");
const {
  createUser,
  sendOTP,
  verifyOTP,
} = require("../controllers/userController");

const router = express.Router();

// Define the user-related routes
router.post("/create", createUser); // Route for creating a user
router.post("/send-otp", sendOTP); // Route for sending OTP
router.post("/verify-otp", verifyOTP); // Route for verifying OTP

module.exports = router;
