import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// router import

import userRouter from "./routes/user.routes.js";
import blogRouter from "./routes/blog.routes.js";
import categoryRouter from "./routes/category.routes.js";
import commentRouter from "./routes/comment.routes.js";
import { ApiError } from "./utils/ApiError.js";

export const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.use("/api/v1/user", userRouter);
app.use("/api/v1/blog", blogRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/comment", commentRouter);

app.use((err, req, res, next) => {
  if (err instanceof ApiError) {
    // Handle ApiError here
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
    });
  } else {
    // Handle other errors
    console.error(err); // Log the error for debugging purposes
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});
