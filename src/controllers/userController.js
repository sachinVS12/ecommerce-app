const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const Order = require("../models/Order");

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const { name, phone, address } = req.body;
  const user = await User.findById(req.user.id);

  if (name) user.name = name;
  if (phone) user.phone = phone;
  if (address) user.address = address;

  await user.save();

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc    Get user orders
// @route   GET /api/users/orders
// @access  Private
const getUserOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user.id })
    .populate("orderItems.product", "name price images")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders,
  });
});

// @desc    Change password
// @route   PUT /api/users/change-password
// @access  Private
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user.id).select("+password");

  // Check current password
  const isPasswordMatch = await user.matchPassword(currentPassword);
  if (!isPasswordMatch) {
    res.status(401);
    throw new Error("Current password is incorrect");
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Password updated successfully",
  });
});

// @desc    Get wishlist
// @route   GET /api/users/wishlist
// @access  Private
const getWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).populate("wishlist");
  res.status(200).json({
    success: true,
    data: user.wishlist || [],
  });
});

// @desc    Add to wishlist
// @route   POST /api/users/wishlist
// @access  Private
const addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const user = await User.findById(req.user.id);

  if (!user.wishlist) {
    user.wishlist = [];
  }

  if (user.wishlist.includes(productId)) {
    res.status(400);
    throw new Error("Product already in wishlist");
  }

  user.wishlist.push(productId);
  await user.save();

  res.status(200).json({
    success: true,
    message: "Added to wishlist",
  });
});

// @desc    Remove from wishlist
// @route   DELETE /api/users/wishlist/:productId
// @access  Private
const removeFromWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  user.wishlist = user.wishlist.filter(
    (item) => item.toString() !== req.params.productId,
  );
  await user.save();

  res.status(200).json({
    success: true,
    message: "Removed from wishlist",
  });
});

module.exports = {
  getUserProfile,
  updateUserProfile,
  getUserOrders,
  changePassword,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
};
