import Joi from "joi";

// Prisma uses cuid() by default - non-empty string id
export const id = Joi.string().min(1).trim().required();
export const objectId = id; // alias for backward compatibility in module validations

export const paginationSchema = {
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  pagination: Joi.boolean().default(true),
};

export const sortSchema = {
  sortBy: Joi.string().default("createdAt"),
  sortOrder: Joi.string().valid("asc", "desc").default("desc"),
};

export const searchSchema = {
  search: Joi.string().allow("").trim().default(""),
  searchFields: Joi.string()
    .trim()
    .custom((value) => {
      if (!value) return [];
      return value
        .split(",")
        .map((field) => field.trim())
        .filter(Boolean);
    })
    .default([]),
};

export const statusSchema = {
  isActive: Joi.boolean().optional(),
  isDeleted: Joi.boolean().optional(),
};

export const listSchema = Joi.object({
  ...paginationSchema,
  ...sortSchema,
  ...searchSchema,
  ...statusSchema,
});

export const idSchema = Joi.object({
  id: id.required(),
});
