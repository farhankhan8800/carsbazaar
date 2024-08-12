const Item = require("../models/item");
const sendResponse = require("../utils/response");

const createItem = async (req, res) => {
  const newItem = new Item(req.body);
  try {
    const savedItem = await newItem.save();
    // Successful response
    sendResponse(res, 201, true, "Item successfully created", savedItem);
  } catch (err) {
    // Error response
    sendResponse(res, 400, false, "Failed to create item", null, err.message);
  }
};

const getItems = async (req, res) => {
  try {
    // Fetch all items from the database
    const items = await Item.find();
    console.log("items", items);
    // Send successful response
    sendResponse(res, 200, true, "Items fetched successfully", items);
  } catch (err) {
    // Send error response
    sendResponse(res, 500, false, "Failed to fetch items", null, err.message);
  }
};

const updateItemAvailability = async (req, res) => {
  const itemId = req.params.id; // URL se item ka ID lo
  console.log("Item ID:", itemId); // Log the item ID

  const { isAvailable } = req.body; // Request body se isAvailable field lo
  console.log("isAvailable:", isAvailable); // Log the isAvailable value

  try {
    // Item ko find aur update karo
    const updatedItem = await Item.findByIdAndUpdate(
      itemId,
      { isAvailable: isAvailable },
      { new: true } // Yeh option update ke baad updated document return karega
    );

    if (!updatedItem) {
      console.log("Item not found");
      return sendResponse(res, 404, false, "Item not found");
    }

    console.log("Updated Item:", updatedItem); // Log the updated item

    // Successful update ka response
    sendResponse(
      res,
      200,
      true,
      "Item availability updated successfully",
      updatedItem
    );
  } catch (err) {
    console.error("Error:", err.message); // Log the error message
    // Error response
    sendResponse(
      res,
      400,
      false,
      "Failed to update item availability",
      null,
      err.message
    );
  }
};

module.exports = {
  createItem,
  getItems,
  updateItemAvailability,
};
