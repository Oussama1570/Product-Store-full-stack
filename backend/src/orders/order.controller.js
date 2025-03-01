const Order = require("./order.model");

const createAOrder = async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    const savedOrder = await newOrder.save();
    res.status(200).json(savedOrder);
  } catch (error) {
    console.error("Error creating order", error);
    res.status(500).json({ message: "Failed to create order" });
  }
};

const getOrderByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const orders = await Order.find({ email }).sort({ createdAt: -1 });
    if (!orders) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

// Handle PATCH request to update paid, delivered, and productCreationStatus
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { paid, delivered, productCreationStatus } = req.body;

    // Check if any fields are provided
    if (paid === undefined && delivered === undefined && productCreationStatus === undefined) {
      return res.status(400).json({ message: "No fields to update" });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { $set: { paid, delivered, productCreationStatus } },
      { new: true } // Return the updated document
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error("Error updating order", error);
    res.status(500).json({ message: "Failed to update order" });
  }
};

module.exports = {
  createAOrder,
  getOrderByEmail,
  getAllOrders,
  updateOrderStatus, // Ensure this function is exported
};
