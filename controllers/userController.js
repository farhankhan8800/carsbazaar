const User = require("../models/user");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const sendResponse = require("../utils/response");
const path = require("path");

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads/"));
  },
  filename: function (req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // Limit file size to 5MB
}).single("profileImage");

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "farhankhan99009ww@gmail.com",
    pass: "khan@fkm",
  },
});

// Generate a secure OTP
const generateOTP = () => {
  return crypto.randomBytes(3).toString("hex").toUpperCase(); // Generates a 6-character OTP
};

// Function to create a user with image upload
const createUser = async (req, res) => {
  upload(req, res, async function (err) {
    if (err) {
      return sendResponse(
        res,
        400,
        false,
        "File upload error",
        null,
        err.message
      );
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendResponse(
        res,
        400,
        false,
        "Validation failed",
        null,
        errors.array()
      );
    }

    try {
      const { name, email, password } = req.body;
      const profileImage = req.file ? req.file.path : null;

      if (!profileImage) {
        return sendResponse(res, 400, false, "Profile image is required");
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        profileImage,
      });

      const savedUser = await newUser.save();

      // Generate OTP
      const otp = generateOTP();
      const otpExpires = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes

      savedUser.otp = otp;
      savedUser.otpExpires = otpExpires;
      await savedUser.save();

      // Send OTP to user's email
      const mailOptions = {
        from: "noreply@yourdomain.com",
        to: email,
        subject: "Your OTP for Login",
        text: `Your OTP for login is ${otp}. It is valid for 10 minutes.`,
      };

      // await transporter.sendMail(mailOptions);

      return sendResponse(
        res,
        201,
        true,
        "User successfully created and OTP sent to your email",
        savedUser
      );
    } catch (err) {
      return sendResponse(
        res,
        500,
        false,
        "Failed to create user",
        null,
        err.message
      );
    }
  });
};

// Function to send OTP
const sendOTP = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return sendResponse(res, 400, false, "User not found");
    }

    const otp = generateOTP();
    const otpExpires = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    const mailOptions = {
      from: "noreply@yourdomain.com",
      to: email,
      subject: "Your OTP for Login",
      text: `Your OTP for login is ${otp}. It is valid for 10 minutes.`,
    };

    // await transporter.sendMail(mailOptions);

    return sendResponse(res, 200, true, "OTP sent to your email");
  } catch (err) {
    return sendResponse(
      res,
      500,
      false,
      "Failed to send OTP",
      null,
      err.message
    );
  }
};

// Function to verify OTP and generate JWT
const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return sendResponse(res, 400, false, "User not found");
    }

    if (user.otp !== otp) {
      return sendResponse(res, 400, false, "Invalid OTP");
    }

    if (user.otpExpires < Date.now()) {
      return sendResponse(res, 400, false, "OTP has expired");
    }

    user.otp = undefined; // Clear OTP after successful login
    user.otpExpires = undefined;
    await user.save();

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, email: user.email },
      "your_jwt_secret", // Replace with your secret or use an environment variable
      { expiresIn: "1h" } // Token expires in 1 hour
    );

    console.log("Generated JWT Token:", token); // Log the generated token

    return sendResponse(res, 200, true, "Login successful", { token });
  } catch (err) {
    console.error("Error verifying OTP:", err.message); // Log any errors
    return sendResponse(
      res,
      500,
      false,
      "Failed to verify OTP",
      null,
      err.message
    );
  }
};

module.exports = {
  createUser,
  sendOTP,
  verifyOTP,
};
