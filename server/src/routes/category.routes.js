import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import {
  createCategory,
  getCategoryList,
} from "../controllers/category.controllers.js";

const router = Router();

router.route("/").post(verifyJwt, createCategory);
router.route("/").get(verifyJwt, getCategoryList);

export default router;
