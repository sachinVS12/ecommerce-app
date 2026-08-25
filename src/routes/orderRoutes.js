const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const { validateOrder } = require("../middleware/validation");
const {
  createOrder,
  getOrderById,
  getMyOrders,
  updateOrderStatus,
  processPayment,
  cancelOrder,
  getAdminOrders,
} = require("../controllers/orderController");

router.post("/", protect, validateOrder, createOrder);
router.get("/my-orders", protect, getMyOrders);
router.get("/admin", protect, authorize("admin"), getAdminOrders);
router.get("/:id", protect, getOrderById);
router.put("/:id/status", protect, authorize("admin"), updateOrderStatus);
router.put("/:id/pay", protect, processPayment);
router.put("/:id/cancel", protect, cancelOrder);

module.exports = router;
