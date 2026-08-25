const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const {
  getDashboardStats,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getSalesAnalytics,
} = require("../controllers/adminController");

// All admin routes are protected and require admin role
router.use(protect, authorize("admin"));

router.get("/dashboard", getDashboardStats);
router.get("/users", getUsers);
router.get("/users/:id", getUserById);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);
router.get("/analytics/sales", getSalesAnalytics);

module.exports = router;
