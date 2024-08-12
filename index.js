const express = require("express");
const connectDB = require("./config/db");
const itemRoutes = require("./routes/itemRoutes"); // Route import
const userRoutes = require("./routes/userRoutes");
const homeRoutes = require("./routes/homeRoutes");

const path = require("path");
const app = express();
const port = 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Midd
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Serve uploaded images
console.log("__dirname", __dirname);
connectDB();
app.use("/", homeRoutes); // Items Route setup
app.use("/api/items", itemRoutes); // Items Route setup
app.use("/api/users", userRoutes); // Use user routes

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
