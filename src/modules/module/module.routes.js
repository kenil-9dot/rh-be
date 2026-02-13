import express from "express";
import moduleController from "./module.controller.js";
import permission from "../../middlewares/permission.middleware.js";
import validate from "../../middlewares/validate.middleware.js";
import { createSchema, updateSchema } from "./module.validation.js";
import { listSchema, idSchema } from "../../validations/common.validation.js";

const router = express.Router();

router.post(
  "/",
  permission("module:create"),
  validate(createSchema),
  moduleController.create,
);

router.get(
  "/",
  permission("module:read"),
  validate(listSchema, "query"),
  moduleController.getAll,
);

router.get(
  "/:id",
  permission("module:read"),
  validate(idSchema, "params"),
  moduleController.getById,
);

router.put(
  "/:id",
  permission("module:update"),
  validate(idSchema, "params"),
  validate(updateSchema),
  moduleController.updateById,
);

router.delete(
  "/:id",
  permission("module:delete"),
  validate(idSchema, "params"),
  moduleController.deleteById,
);

export default router;
