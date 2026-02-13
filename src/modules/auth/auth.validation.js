import Joi from "joi";
import { LOGIN_TYPE } from "../../constants/constant.js";

export const loginSchema = Joi.object({
  username: Joi.string().trim().required().messages({
    "any.required": "Username is required",
  }),
  password: Joi.string().required().messages({
    "any.required": "Password is required",
  }),
  loginType: Joi.string()
    .valid(...Object.values(LOGIN_TYPE))
    .required()
    .messages({
      "any.only": "Invalid login type",
      "any.required": "Login type is required",
    }),
});

export const registerSchema = Joi.object({
  username: Joi.string().min(2).trim().required().messages({
    "any.required": "Username is required",
  }),
  fullName: Joi.string().min(2).required().messages({
    "string.empty": "Full name is required",
  }),
  password: Joi.string().min(8).required().messages({
    "string.min": "Password must be at least 8 characters long",
    "any.required": "Password is required",
  }),
  roleId: Joi.number().integer().optional(),
  departmentId: Joi.number().integer().optional(),
});
