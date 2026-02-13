import Joi from "joi";
import { objectId, statusSchema } from "../../validations/common.validation.js";

export const createSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  email: Joi.string().trim().lowercase().email().required(),
  password: Joi.string().min(8).max(30).required(),
  role: objectId.required(),
  permissions: Joi.array().items(objectId).default([]),
  isActive: Joi.boolean().optional(),
});

export const updateSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).optional(),
  email: Joi.string().trim().lowercase().email().optional(),
  password: Joi.string().min(8).max(30).optional(),
  role: objectId.optional(),
  permissions: Joi.array().items(objectId).optional(),
  ...statusSchema,
}).min(1);