const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // await mongoose.connect("mongodb://localhost:27017/carsbazar");
    await mongoose.connect(
      "mongodb+srv://farhan:Me%40Engineer123@cluster0-carsbazar.fvswv.mongodb.net/"
    );
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
