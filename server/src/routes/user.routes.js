import { Router } from "express";
import {
  generateNewOtp,
  login,
  logout,
  signup,
  updateAccount,
  verifyUserEmail,
} from "../controllers/user.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").post(
  upload.fields([
    {
      name: "profileImage",
      maxCount: 1,
    },
  ]),
  signup
);
router.route("/verify-account").patch(verifyUserEmail);
router.route("/resend-otp").post(generateNewOtp);
router.route("/login").post(login);
router.route("/logout").post(verifyJwt, logout);
router.route("/").put(verifyJwt, updateAccount);

export default router;
