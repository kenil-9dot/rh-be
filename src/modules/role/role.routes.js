import express from "express";
import roleController from "./role.controller.js";
import permission from "../../middlewares/permission.middleware.js";
import validate from "../../middlewares/validate.middleware.js";
import { createSchema, updateSchema } from "./role.validation.js";
import { listSchema, idSchema } from "../../validations/common.validation.js";

const router = express.Router();

router.post(
  "/",
  permission("role:create"),
  validate(createSchema),
  roleController.create,
);

router.get(
  "/",
  permission("role:read"),
  validate(listSchema, "query"),
  roleController.getAll,
);

router.get(
  "/:id",
  permission("role:read"),
  validate(idSchema, "params"),
  roleController.getById,
);

router.put(
  "/:id",
  permission("role:update"),
  validate(idSchema, "params"),
  validate(updateSchema),
  roleController.updateById,
);

router.delete(
  "/:id",
  permission("role:delete"),
  validate(idSchema, "params"),
  roleController.deleteById,
);

export default router;
