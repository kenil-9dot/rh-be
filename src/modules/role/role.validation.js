import Joi from "joi";
import { statusSchema } from "../../validations/common.validation.js";

export const createSchema = Joi.object({
  name: Joi.string().trim().lowercase().min(2).max(50).required(),
  description: Joi.string().trim().max(100).allow("").optional(),
  isActive: Joi.boolean().optional(),
});

export const updateSchema = Joi.object({
  name: Joi.string().trim().lowercase().min(2).max(50).required(),
  description: Joi.string().trim().max(100).allow("").optional(),
  ...statusSchema,
}).min(1);
