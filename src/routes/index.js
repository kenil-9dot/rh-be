import express from "express";
import authRoutes from "../modules/auth/auth.routes.js";
import employeeRoutes from "../modules/employee/employee.routes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/employees", employeeRoutes);

export default router;
