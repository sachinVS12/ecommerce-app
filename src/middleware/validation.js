const { body, validationResult } = require("express-validator");

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }
  next();
};

// User registration validation
const validateUserRegistration = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  validate,
];

// User login validation
const validateUserLogin = [
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
  validate,
];

// Product validation
const validateProduct = [
  body("name").trim().notEmpty().withMessage("Product name is required"),
  body("price").isNumeric().withMessage("Price must be a number"),
  body("category").notEmpty().withMessage("Category is required"),
  body("sku").notEmpty().withMessage("SKU is required"),
  body("stock")
    .isInt({ min: 0 })
    .withMessage("Stock must be a positive number"),
  validate,
];

// Order validation
const validateOrder = [
  body("shippingAddress.street").notEmpty().withMessage("Street is required"),
  body("shippingAddress.city").notEmpty().withMessage("City is required"),
  body("shippingAddress.state").notEmpty().withMessage("State is required"),
  body("shippingAddress.zipCode")
    .notEmpty()
    .withMessage("Zip code is required"),
  body("shippingAddress.country").notEmpty().withMessage("Country is required"),
  body("paymentMethod")
    .isIn(["credit_card", "paypal", "cash_on_delivery"])
    .withMessage("Invalid payment method"),
  validate,
];

module.exports = {
  validate,
  validateUserRegistration,
  validateUserLogin,
  validateProduct,
  validateOrder,
};
