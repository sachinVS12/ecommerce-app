const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const Category = require("../models/Category");

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getDashboardStats = asyncHandler(async (req, res) => {
  const [
    totalUsers,
    totalProducts,
    totalOrders,
    totalRevenue,
    recentOrders,
    lowStockProducts,
  ] = await Promise.all([
    User.countDocuments(),
    Product.countDocuments({ isActive: true }),
    Order.countDocuments(),
    Order.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]),
    Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "name email"),
    Product.find({ stock: { $lt: 10 }, isActive: true })
      .select("name sku stock")
      .limit(5),
  ]);

  res.status(200).json({
    success: true,
    data: {
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      recentOrders,
      lowStockProducts,
    },
  });
});

// @desc    Get all users (Admin)
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const { search, role, page = 1, limit = 20 } = req.query;
  const filter = {};

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }
  if (role) filter.role = role;

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  const users = await User.find(filter)
    .select("-password")
    .sort({ createdAt: -1 })
    .limit(limitNum)
    .skip(skip);

  const total = await User.countDocuments(filter);

  res.status(200).json({
    success: true,
    data: users,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum),
    },
  });
});

// @desc    Get single user (Admin)
// @route   GET /api/admin/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc    Update user (Admin)
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const { name, email, role, isActive, address, phone } = req.body;
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Don't allow admin to change own role
  if (req.user.id === req.params.id) {
    delete req.body.role;
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    { name, email, role, isActive, address, phone },
    { new: true, runValidators: true },
  ).select("-password");

  res.status(200).json({
    success: true,
    data: updatedUser,
  });
});

// @desc    Delete user (Admin)
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Prevent admin from deleting themselves
  if (req.user.id === req.params.id) {
    res.status(400);
    throw new Error("Cannot delete your own account");
  }

  await user.deleteOne();

  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});

// @desc    Get sales analytics
// @route   GET /api/admin/analytics/sales
// @access  Private/Admin
const getSalesAnalytics = asyncHandler(async (req, res) => {
  const { period = "month" } = req.query;
  let groupFormat;

  switch (period) {
    case "day":
      groupFormat = "%Y-%m-%d";
      break;
    case "week":
      groupFormat = "%Y-%U";
      break;
    case "month":
      groupFormat = "%Y-%m";
      break;
    case "year":
      groupFormat = "%Y";
      break;
    default:
      groupFormat = "%Y-%m";
  }

  const salesData = await Order.aggregate([
    {
      $match: {
        isPaid: true,
        createdAt: {
          $gte: new Date(new Date().setMonth(new Date().getMonth() - 12)),
        },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: groupFormat, date: "$createdAt" } },
        totalOrders: { $sum: 1 },
        totalRevenue: { $sum: "$totalPrice" },
        averageOrderValue: { $avg: "$totalPrice" },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.status(200).json({
    success: true,
    data: salesData,
  });
});

module.exports = {
  getDashboardStats,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getSalesAnalytics,
};
