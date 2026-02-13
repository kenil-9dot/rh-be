import express from "express";
import userController from "./user.controller.js";
import permission from "../../middlewares/permission.middleware.js";
import validate from "../../middlewares/validate.middleware.js";
import { createSchema, updateSchema } from "./user.validation.js";
import { listSchema, idSchema } from "../../validations/common.validation.js";

const router = express.Router();

router.post(
  "/",
  permission("user:create"),
  validate(createSchema),
  userController.create,
);

router.get(
  "/",
  permission("user:read"),
  validate(listSchema, "query"),
  userController.getAll,
);

router.get(
  "/:id",
  permission("user:read"),
  validate(idSchema, "params"),
  userController.getById,
);

router.put(
  "/:id",
  permission("user:update"),
  validate(idSchema, "params"),
  validate(updateSchema),
  userController.updateById,
);

router.delete(
  "/:id",
  permission("user:delete"),
  validate(idSchema, "params"),
  userController.deleteById,
);

export default router;
