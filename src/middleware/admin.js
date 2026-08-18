const { protect, authorize } = require("./auth");

// Admin middleware - combines protect and authorize
const admin = [protect, authorize("admin")];

// Super admin middleware (if needed)
const superAdmin = [protect, authorize("admin")]; // Add 'super_admin' role if needed

module.exports = { admin, superAdmin };
