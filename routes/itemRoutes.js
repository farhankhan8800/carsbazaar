const express = require("express");
const {
  getItems,
  createItem,
  updateItemAvailability,
} = require("../controllers/itemController");

const router = express.Router();

router.get("/", getItems); // GET route
router.post("/", createItem); // POST route
router.put("/:id/availability", updateItemAvailability); // Update

module.exports = router;
