import express from "express";
import { check, forgotPassword, login, logout, resetPassword, signup, updateMe, updatePassword } from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { createProperty, getUserProperty } from "../controllers/propertyController.js";

const router = express.Router();

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").get(logout);

router.route("/updateMe").patch(protect, updateMe);
router.route("/forgotPassword").post(forgotPassword);
router.route("/updateMyPassword").patch(protect,updatePassword);
router.route("/resetPassword/:token").patch(resetPassword);

router.route("/me").get(protect, check);

router.route("/newAccomodation").post(protect,createProperty);
router.route("/myAccomodation").get(protect,getUserProperty);

export { router };