import mongoose, { Schema } from "mongoose";

const categorySchema = Schema(
  {
    name: {
      type: String,
      required: true,
    },
    categoryCode: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

export const Category = mongoose.model("Category", categorySchema);
