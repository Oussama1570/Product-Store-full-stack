const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  productCreationStatus: {
    type: String,
    enum: ["not_started", "in_progress", "almost_done", "completed"],
    default: "not_started", // Default is "not_started"
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  address: {
    street: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    country: String,
    state: String,
    zipcode: String,
  },
  phone: {
    type: Number,
    required: true,
  },
  productIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
  ],
  totalPrice: {
    type: Number,
    required: true,
  },
}, {
  timestamps: true,
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
