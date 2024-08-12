const express = require("express");
const { Home } = require("../controllers/homeController");

const router = express.Router();

router.get("/", Home); // GET routee
module.exports = router;
