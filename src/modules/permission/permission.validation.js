import Joi from "joi";
import { objectId, statusSchema } from "../../validations/common.validation.js";

export const createSchema = Joi.object({
  name: Joi.string().trim().lowercase().min(2).max(50).required(),
  description: Joi.string().trim().max(100).required(),
  module: objectId.required(),
  isActive: Joi.boolean().optional(),
});

export const updateSchema = Joi.object({
  name: Joi.string().trim().lowercase().min(2).max(50).optional(),
  description: Joi.string().trim().max(100).optional(),
  module: objectId.optional(),
  ...statusSchema,
}).min(1);
