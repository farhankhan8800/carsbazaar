const User = require("../models/userauth");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: "Gmail", // Use your email service provider
  auth: {
    user: "your-email@gmail.com", // Your email address
    pass: "your-email-password", // Your email password
  },
});

const generateOTP = () => {
  return crypto.randomBytes(3).toString("hex"); // Generates a 6-digit OTP
};

const sendOTP = async (req, res) => {
  const { email } = req.body;

  try {
    // Check if user exists, if not, create one
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ email });
    }

    // Generate OTP and expiration time
    const otp = generateOTP();
    const otpExpires = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes

    // Save OTP and expiration time to the user's document
    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    // Send OTP via email
    const mailOptions = {
      from: "your-email@gmail.com",
      to: email,
      subject: "Your OTP for Login",
      text: `Your OTP for login is ${otp}. It is valid for 10 minutes.`,
    };

    // await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: "OTP sent to your email." });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to send OTP",
      error: err.message,
    });
  }
};

module.exports = {
  sendOTP,
};
