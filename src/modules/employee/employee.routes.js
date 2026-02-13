import express from "express";
import employeeController from "./employee.controller.js";
import authMiddleware from "../../middlewares/auth.middleware.js";
import validate from "../../middlewares/validate.middleware.js";
import {
  createSchema,
  updateSchema,
  listSchema,
  idSchema,
} from "./employee.validation.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", validate(createSchema), employeeController.create);
router.get("/", validate(listSchema, "query"), employeeController.getAll);
router.get("/:id", validate(idSchema, "params"), employeeController.getById);
router.put(
  "/:id",
  validate(idSchema, "params"),
  validate(updateSchema),
  employeeController.updateById,
);
router.delete(
  "/:id",
  validate(idSchema, "params"),
  employeeController.deleteById,
);

export default router;
