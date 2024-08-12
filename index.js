const express = require("express");
const connectDB = require("./config/db");
const itemRoutes = require("./routes/itemRoutes"); // Route import
const userRoutes = require("./routes/userRoutes");
const homeRoutes = require("./routes/homeRoutes");
require("dotenv").config();
const path = require("path");
const app = express();
const port = process.env.PORT || 8000; // Use environment variable PORT or default to 8000

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Middleware
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Serve uploaded images

console.log("__dirname", __dirname);
connectDB();

app.use("/", homeRoutes); // Home Route setup
app.use("/api/items", itemRoutes); // Items Route setup
app.use("/api/users", userRoutes); // User Route setup

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
