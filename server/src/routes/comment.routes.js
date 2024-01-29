import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import {
  createComment,
  fetchCommentForPost,
} from "../controllers/comment.controllers.js";

const router = Router();

router.route("/").post(verifyJwt, createComment);
router.route("/:postId").get(fetchCommentForPost);

export default router;
