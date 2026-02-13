import Joi from "joi";
import { objectId, statusSchema } from "../../validations/common.validation.js";

export const createSchema = Joi.object({
  name: Joi.string().trim().lowercase().min(2).max(50).required(),
  description: Joi.string().trim().optional(),
  type: Joi.string().valid("module", "submodule").default("module"),
  parentModule: Joi.when("type", {
    is: "submodule",
    then: objectId.required(),
    otherwise: Joi.forbidden(),
  }),
  isActive: Joi.boolean().optional(),
});

export const updateSchema = Joi.object({
  name: Joi.string().trim().lowercase().min(2).max(50).optional(),
  description: Joi.string().trim().optional(),
  type: Joi.string().valid("module", "submodule").optional(),
  parentModule: Joi.when("type", {
    is: "submodule",
    then: objectId.required(),
    otherwise: Joi.forbidden(),
  }),
  ...statusSchema,
}).min(1);
