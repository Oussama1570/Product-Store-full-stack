const express = require('express');
const { postAProduct, getAllProducts, getSingleProduct, updateProduct, deleteAProduct } = require('./product.controller');
const verifyAdminToken = require('../middleware/verifyAdminToken');
const router = express.Router();

// POST a product (Create)
router.post("/create-product", verifyAdminToken, postAProduct);

// GET all products
router.get("/", getAllProducts);

// GET a single product by ID
router.get("/:id", getSingleProduct);

// PUT (Update) a product
router.put("/edit/:id", verifyAdminToken, updateProduct); // Ensure this matches the controller function name

// DELETE a product by ID
router.delete("/:id", verifyAdminToken, deleteAProduct);

module.exports = router;
