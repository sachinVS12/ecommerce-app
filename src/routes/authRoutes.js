const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
  validateUserRegistration,
  validateUserLogin,
} = require("../middleware/validation");
const {
  register,
  login,
  logout,
  getMe,
  forgotPassword,
} = require("../controllers/authController");

//auth.js
router.post("/register", validateUserRegistration, register);
router.post("/login", validateUserLogin, login);
router.post("/logout", protect, logout);
router.get("/me", protect, getMe);
router.post("/forgot-password", forgotPassword);

module.exports = router;
