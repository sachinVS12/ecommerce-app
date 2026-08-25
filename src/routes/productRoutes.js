const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const { validateProduct } = require("../middleware/validation");
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  addProductRating,
} = require("../controllers/productController");

router.get("/", getProducts);
router.get("/:id", getProduct);
router.post("/", protect, authorize("admin"), validateProduct, createProduct);
router.put("/:id", protect, authorize("admin"), validateProduct, updateProduct);
router.delete("/:id", protect, authorize("admin"), deleteProduct);
router.post("/:id/rating", protect, addProductRating);

module.exports = router;
