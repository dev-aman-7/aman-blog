import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import {
  createBlog,
  getBlogById,
  getBlogList,
  getUserBlogList,
  updateBlog,
} from "../controllers/blog.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router
  .route("/")
  .post(
    verifyJwt,
    upload.fields([{ name: "thumbnail", maxCount: 1 }]),
    createBlog
  );
router
  .route("/:blogId")
  .put(
    verifyJwt,
    upload.fields([{ name: "thumbnail", maxCount: 1 }]),
    updateBlog
  );

router.route("/").get(getBlogList);
router.route("/user-blog").get(verifyJwt, getUserBlogList);
router.route("/:blogId").get(getBlogById);

export default router;
