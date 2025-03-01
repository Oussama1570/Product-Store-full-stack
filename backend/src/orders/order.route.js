const express = require("express");
const router = express.Router();
const Order = require("./order.model");  // Ensure you're importing the Order model

// Define the route for getting all orders
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find(); // Fetch all orders from the database
    res.status(200).json(orders); // Send the list of orders
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
});

// Define the route for getting orders by email
router.get("/email/:email", async (req, res) => {
  const { email } = req.params;
  try {
    const orders = await Order.find({ email }); // Find orders by email
    if (orders.length === 0) {
      return res.status(404).json({ message: "No orders found for this email" });
    }
    res.status(200).json(orders); // Send the found orders
  } catch (err) {
    console.error("Error fetching orders by email:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
});

// Define the route for creating an order
router.post("/", async (req, res) => {
  const newOrder = req.body;
  try {
    const order = new Order(newOrder); // Create a new order
    await order.save(); // Save the order to the database
    res.status(201).json(order); // Return the created order
  } catch (err) {
    console.error("Error creating order:", err);
    res.status(400).json({ message: "Bad request", error: err });
  }
});

router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { isPaid, isDelivered } = req.body;  

  try {
    // Debugging log to check values
    console.log(`Updating Order ID: ${id}, isPaid: ${isPaid}, isDelivered: ${isDelivered}`);

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { $set: { isPaid, isDelivered } }, // ✅ Correct field update
      { new: true }
    );
    
    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    console.log("Updated Order:", updatedOrder); // Debugging log

    res.status(200).json(updatedOrder); // ✅ Return the updated order
  } catch (err) {
    console.error("Error updating order:", err);
    res.status(400).json({ message: "Bad request", error: err });
  }
});



  // Delete an order
  router.delete('/delete/:id', async (req, res) => {
    try {
      const order = await Order.findByIdAndDelete(req.params.id);
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
      res.status(200).json({ message: 'Order deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Error deleting order', error: err.message });
    }
  });
  
  
  

module.exports = router;
