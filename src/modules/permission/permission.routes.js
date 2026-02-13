import express from "express";
import permissionController from "./permission.controller.js";
import permission from "../../middlewares/permission.middleware.js";
import validate from "../../middlewares/validate.middleware.js";
import { createSchema, updateSchema } from "./permission.validation.js";
import { listSchema, idSchema } from "../../validations/common.validation.js";

const router = express.Router();

router.post(
  "/",
  permission("permission:create"),
  validate(createSchema),
  permissionController.create,
);

router.get(
  "/",
  permission("permission:read"),
  validate(listSchema, "query"),
  permissionController.getAll,
);

router.get(
  "/:id",
  permission("permission:read"),
  validate(idSchema, "params"),
  permissionController.getById,
);

router.put(
  "/:id",
  permission("permission:update"),
  validate(idSchema, "params"),
  validate(updateSchema),
  permissionController.updateById,
);

router.delete(
  "/:id",
  permission("permission:delete"),
  validate(idSchema, "params"),
  permissionController.deleteById,
);

export default router;
