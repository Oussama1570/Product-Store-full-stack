const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const port = process.env.PORT || 5000;

// Define allowed origins dynamically from environment variables
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : [
      "http://localhost:5173", // Local development
      "https://product-app-frontend-chi.vercel.app", // Deployed frontend
    ];

// Enable CORS with allowed origins
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: "GET, POST, PUT, DELETE, PATCH", // Include PATCH method here
    credentials: true, // If using cookies or authentication
  })
);

// Enable JSON parsing
app.use(express.json());

// Routes
const productRoutes = require("./src/products/product.route");
const orderRoutes = require("./src/orders/order.route");
const userRoutes = require("./src/users/user.route");
const adminRoutes = require("./src/stats/admin.stats");

app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/auth", userRoutes);
app.use("/api/admin", adminRoutes);

// MongoDB Connection with retry mechanism
async function main() {
  try {
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully!");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    setTimeout(main, 5000); // Retry after 5 seconds in case of failure
  }
}

main();

// Default route
app.get("/", (req, res) => {
  res.send("Product Store Server is running!");
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
