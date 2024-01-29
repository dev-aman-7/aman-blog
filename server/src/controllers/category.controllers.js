import { Category } from "../models/category.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createCategory = asyncHandler(async (req, res) => {
  const { name, categoryCode } = req.body;

  if (!(name && categoryCode)) {
    throw new ApiError(400, "All fields are required");
  }

  const existingCategory = await Category.findOne({ categoryCode });

  if (existingCategory) {
    throw new ApiError(400, "Category already exists with this category code");
  }

  const category = await Category.create({
    name,
    categoryCode,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, category, "Category created successfully"));
});

const getCategoryList = asyncHandler(async (req, res) => {
  const { limit = 20, current_page = 1 } = req.query;
  const category = await Category.find({})
    .limit(limit)
    .skip((current_page - 1) * limit);

  return res
    .status(200)
    .json(new ApiResponse(200, category, "Category list fetched successfully"));
});

export { createCategory, getCategoryList };
