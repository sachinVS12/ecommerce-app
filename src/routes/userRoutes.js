const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
  getUserProfile,
  updateUserProfile,
  getUserOrders,
  changePassword,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} = require("../controllers/userController");

router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);
router.get("/orders", protect, getUserOrders);
router.put("/change-password", protect, changePassword);
router.get("/wishlist", protect, getWishlist);
router.post("/wishlist", protect, addToWishlist);
router.delete("/wishlist/:productId", protect, removeFromWishlist);

module.exports = router;
