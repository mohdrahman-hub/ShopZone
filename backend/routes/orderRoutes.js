const express = require("express");
const Order = require("../models/Order");

const router = express.Router();

// =========================================
// CREATE A NEW ORDER
// =========================================

router.post("/", async (req, res) => {
  try {
    const {
      customerName,
      email,
      phone,
      address,
      items,
      total,
    } = req.body;

    // Validate order details
    if (
      !customerName ||
      !email ||
      !phone ||
      !address ||
      !items ||
      items.length === 0
    ) {
      return res.status(400).json({
        message: "Please provide all order details",
      });
    }

    // Create order
    const order = new Order({
      customerName,
      email,
      phone,
      address,
      items,
      total,
    });

    // Save order to MongoDB
    await order.save();

    res.status(201).json({
      message: "Order placed successfully 🎉",
      order,
    });

  } catch (error) {
    console.error("Order error:", error);

    res.status(500).json({
      message: "Failed to place order",
      error: error.message,
    });
  }
});


// =========================================
// GET ORDERS
// =========================================

router.get("/", async (req, res) => {
  try {
    const { email } = req.query;

    // If email is provided, get only that user's orders.
    // Otherwise, get all orders.
    const filter = email ? { email } : {};

    const orders = await Order.find(filter).sort({
      createdAt: -1,
    });

    res.json(orders);

  } catch (error) {
    console.error("Fetch orders error:", error);

    res.status(500).json({
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
});


// =========================================
// EXPORT ROUTER
// =========================================

module.exports = router;