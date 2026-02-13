import Joi from "joi";

// Params come as strings; accept and convert to number
const idSchema = Joi.object({
  id: Joi.alternatives()
    .try(
      Joi.number().integer().positive(),
      Joi.string().pattern(/^\d+$/),
    )
    .required()
    .custom((v) => (typeof v === "string" ? parseInt(v, 10) : v)),
});

export const createSchema = Joi.object({
  firstName: Joi.string().min(1).trim().required(),
  lastName: Joi.string().min(1).trim().required(),
  userId: Joi.number().integer().positive().required(),
  departmentId: Joi.number().integer().positive().required(),
  address: Joi.string().min(1).trim().required(),
  photoUrl: Joi.string().uri().allow("", null).optional(),
  gender: Joi.number().integer().min(0).optional(),
  dob: Joi.date().iso().allow(null).optional(),
  maritalStatus: Joi.number().integer().min(0).optional(),
  idPhotoUrl: Joi.string().uri().allow("", null).optional(),
  personalPhone: Joi.string().allow("", null).optional(),
  workPhone: Joi.string().allow("", null).optional(),
  personalEmail: Joi.string().email().allow("", null).optional(),
  workEmail: Joi.string().email().allow("", null).optional(),
  status: Joi.number().integer().min(0).optional(),
});

export const updateSchema = Joi.object({
  firstName: Joi.string().min(1).trim().optional(),
  lastName: Joi.string().min(1).trim().optional(),
  userId: Joi.number().integer().positive().optional(),
  departmentId: Joi.number().integer().positive().optional(),
  address: Joi.string().min(1).trim().optional(),
  photoUrl: Joi.string().uri().allow("", null).optional(),
  gender: Joi.number().integer().min(0).optional(),
  dob: Joi.date().iso().allow(null).optional(),
  maritalStatus: Joi.number().integer().min(0).optional(),
  idPhotoUrl: Joi.string().uri().allow("", null).optional(),
  personalPhone: Joi.string().allow("", null).optional(),
  workPhone: Joi.string().allow("", null).optional(),
  personalEmail: Joi.string().email().allow("", null).optional(),
  workEmail: Joi.string().email().allow("", null).optional(),
  status: Joi.number().integer().min(0).optional(),
}).min(1);

const paginationSchema = {
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  pagination: Joi.boolean().default(true),
};

const sortSchema = {
  sortBy: Joi.string().default("createdAt"),
  sortOrder: Joi.string().valid("asc", "desc").default("desc"),
};

const searchSchema = {
  search: Joi.string().allow("").trim().default(""),
  searchFields: Joi.string()
    .trim()
    .custom((value) => {
      if (!value) return [];
      return value.split(",").map((f) => f.trim()).filter(Boolean);
    })
    .default([]),
};

export const listSchema = Joi.object({
  ...paginationSchema,
  ...sortSchema,
  ...searchSchema,
});

export { idSchema };
