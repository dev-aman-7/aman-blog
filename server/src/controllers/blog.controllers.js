import { Blog } from "../models/blog.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const createBlog = asyncHandler(async (req, res) => {
  const { title, slug, post, category } = req.body;

  if (!(title && slug && post && category)) {
    throw new ApiError(400, "All fields are required");
  }

  const existingSlug = await Blog.findOne({ slug });

  if (existingSlug) {
    throw new ApiError(400, "Slug is already exists");
  }

  const thumbnailLocalPath = req.files?.thumbnail[0].path;
  if (!thumbnailLocalPath) {
    throw new ApiError(400, "Thumbnail is required");
  }

  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

  if (!thumbnail) {
    throw new ApiError(500, "Error while uploding thumbnail");
  }

  const blog = await Blog.create({
    title,
    slug,
    post,
    category,
    thumbnail: thumbnail.url,
    createdBy: req.user?._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, blog, "Blog created successfully"));
});

const updateBlog = asyncHandler(async (req, res) => {
  const { title, post } = req.body;

  const blog = await Blog.findById(req.params?.blogId);

  console.log(blog.createdBy, req?.user._id);

  if (blog.createdBy.toString() !== req?.user._id.toString()) {
    throw new ApiError(401, "You are not authorize to edit other's blog");
  }

  if (!blog) {
    throw new ApiError(400, "Blog not found");
  }

  if (title) {
    blog.title = title;
  }

  if (post) {
    blog.post = post;
  }

  if (req.files?.thumbnail) {
    const thumbnailLocalPath = req.files?.thumbnail[0].path;
    if (thumbnailLocalPath) {
      const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
      if (!thumbnail) {
        throw new ApiError(500, "Error while updating thumbnail");
      }

      blog.thumbnail = thumbnail?.url;
    }
  }

  await blog.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, blog, "Blog updated successfully"));
});

const getBlogList = asyncHandler(async (req, res) => {
  const { current_page, limit, slug, title } = req.query;
  const pageLimit = parseInt(limit) || 20;
  const currentPage = parseInt(current_page) || 1;

  const matchStage = {
    $match: {},
  };

  if (slug) {
    matchStage.$match["slug"] = slug;
  }

  if (title) {
    matchStage.$match["title"] = { $regex: new RegExp(title, "i") }; // Case-insensitive title search
  }

  const blogLists = await Blog.aggregate([
    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "category",
      },
    },
    {
      $unwind: "$category",
    },
    matchStage,
    {
      $skip: (currentPage - 1) * pageLimit,
    },
    { $limit: pageLimit },
  ]);

  const totalDocument = await Blog.countDocuments(matchStage.$match);

  const totalPage = Math.ceil(totalDocument / pageLimit);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        blogLists: blogLists,
        pagination: {
          currentPage: currentPage,
          totalPage: totalPage,
          totalItem: totalDocument,
        },
      },
      "Blog list fetched successfully"
    )
  );
});

const getUserBlogList = asyncHandler(async (req, res) => {
  const { current_page = 1, limit = 20, slug, title } = req.query;

  let filter = {};

  if (slug) {
    filter.slug = { $regex: slug };
  }
  if (title) {
    filter.title = { $regex: title };
  }
  const blogList = await Blog.find({ createdBy: req?.user._id, ...filter })
    .skip(limit * (current_page - 1))
    .limit(limit);

  const totalDocument = await Blog.countDocuments({
    createdBy: req?.user._id,
    ...filter,
  });
  const totalPage = Math.ceil(totalDocument / limit);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        blogLists: blogList,
        pagination: {
          currentPage: current_page,
          totalPage,
          totalItem: totalDocument,
        },
      },
      "Blog list fetched successfully"
    )
  );
});

const getBlogById = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params?.blogId);

  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, blog, "Blog fetched successfully"));
});

export { createBlog, updateBlog, getBlogList, getUserBlogList, getBlogById };
