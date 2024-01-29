import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    post: {
      type: mongoose.Types.ObjectId,
      ref: "Blog",
    },
  },
  { timestamps: true }
);

export const Comment = mongoose.model("Comment", commentSchema);
