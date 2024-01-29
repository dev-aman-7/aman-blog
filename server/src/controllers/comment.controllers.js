import mongoose from "mongoose";
import { Blog } from "../models/blog.model.js";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ObjectId } from "mongodb";

const createComment = asyncHandler(async (req, res) => {
  const { comment, postId } = req.body;

  const post = await Blog.findById(postId);

  if (!post) {
    throw new ApiError(400, "Post not found");
  }

  const newComment = await Comment.create({
    user: req?.user._id,
    comment,
    post: postId,
  });

  if (!newComment) {
    throw new ApiError(400, "Comment not created");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, newComment, "Comment created successfully"));
});

const fetchCommentForPost = asyncHandler(async (req, res) => {
  const postId = req.params?.postId;
  const { current_page = 1, limit = 20 } = req.query;

  if (!postId) {
    throw new ApiError(400, "Please provide post id");
  }

  const comment = await Comment.aggregate([
    {
      $match: { post: new ObjectId(postId) },
    },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: "$user",
    },
    {
      $project: {
        "user.password": 0,
        "user.isEmailVarified": 0,
        "user.refreshToken": 0,
      },
    },
    { $sort: { updatedAt: -1 } },
    {
      $skip: (parseInt(current_page) - 1) * parseInt(limit),
    },
    {
      $limit: parseInt(limit),
    },
  ]);
  console.log(limit);

  return res.json(
    new ApiResponse(200, comment, "Comment fetched successfully")
  );
});

export { createComment, fetchCommentForPost };
