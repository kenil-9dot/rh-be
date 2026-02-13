import express from "express";
import authController from "./auth.controller.js";
import validate from "../../middlewares/validate.middleware.js";
import { loginSchema, registerSchema } from "./auth.validation.js";

const router = express.Router();

router.post("/login", validate(loginSchema), authController.login);
router.post("/register", validate(registerSchema), authController.register);
router.get("/refresh-token", authController.refreshToken);
router.get("/logout", authController.logout);
router.get("/logout-all", authController.logoutAll);

export default router;
