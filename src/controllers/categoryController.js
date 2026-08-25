const asyncHandler = require("express-async-handler");
const Category = require("../models/Category");
const Product = require("../models/Product");
const { redisClient } = require("../config/redis");

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
  // Check cache
  const cachedData = await redisClient.get("categories:all");
  if (cachedData) {
    return res.status(200).json(JSON.parse(cachedData));
  }

  const categories = await Category.find({ isActive: true }).populate(
    "parentCategory",
    "name",
  );

  const response = {
    success: true,
    data: categories,
  };

  // Cache for 1 hour
  await redisClient.set("categories:all", JSON.stringify(response), {
    EX: 3600,
  });

  res.status(200).json(response);
});

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Public
const getCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id).populate(
    "parentCategory",
    "name",
  );

  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  res.status(200).json({
    success: true,
    data: category,
  });
});

// @desc    Create category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = asyncHandler(async (req, res) => {
  const { name, description, parentCategory } = req.body;

  // Check if category already exists
  const categoryExists = await Category.findOne({ name });
  if (categoryExists) {
    res.status(400);
    throw new Error("Category already exists");
  }

  const category = await Category.create({
    name,
    description,
    parentCategory,
  });

  // Clear cache
  await redisClient.del("categories:all");

  res.status(201).json({
    success: true,
    data: category,
  });
});

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  // Clear cache
  await redisClient.del("categories:all");

  res.status(200).json({
    success: true,
    data: category,
  });
});

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  // Check if category has products
  const productCount = await Product.countDocuments({
    category: req.params.id,
  });
  if (productCount > 0) {
    res.status(400);
    throw new Error("Cannot delete category with existing products");
  }

  await category.deleteOne();

  // Clear cache
  await redisClient.del("categories:all");

  res.status(200).json({
    success: true,
    message: "Category deleted successfully",
  });
});

module.exports = {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
