import mongoose, { Schema } from "mongoose";

const otpSchema = new Schema(
  {
    otp: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    expires_at: {
      type: Date,
      expires: 1,
    },
  },
  { timestamps: true }
);

export const Otp = mongoose.model("Otp", otpSchema);
