import moduleService from "./module.service.js";
import asyncMiddleware from "../../middlewares/async.middleware.js";
import apiResponse from "../../utils/apiResponse.js";
import throwError from "../../utils/throwError.js";
import MESSAGES from "../../constants/responseMessages.js";
import { HTTP_STATUS } from "../../constants/constant.js";

const create = asyncMiddleware(async (req, res) => {
  await moduleService.ensureUnique({ name: req.body.name });

  const data = await moduleService.create(req.body);

  return apiResponse(res, { message: MESSAGES.CREATE_SUCCESS, data });
});

const getAll = asyncMiddleware(async (req, res) => {
  const data = await moduleService.getAll({}, req.validated.query);

  return apiResponse(res, { message: MESSAGES.FETCH_SUCCESS, data });
});

const getById = asyncMiddleware(async (req, res) => {
  const data = await moduleService.getById(req.params.id);
  if (!data) throwError(MESSAGES.DATA_NOT_FOUND, HTTP_STATUS.NOT_FOUND);

  return apiResponse(res, { message: MESSAGES.FETCH_SUCCESS, data });
});

const updateById = asyncMiddleware(async (req, res) => {
  await moduleService.ensureNotReferenced(req.params.id);

  await moduleService.ensureUnique({ name: req.body.name }, req.params.id);

  const data = await moduleService.updateById(req.params.id, req.body);
  if (!data) throwError(MESSAGES.DATA_NOT_FOUND, HTTP_STATUS.NOT_FOUND);

  return apiResponse(res, { message: MESSAGES.UPDATE_SUCCESS, data });
});

const deleteById = asyncMiddleware(async (req, res) => {
  await moduleService.ensureNotReferenced(req.params.id);

  const update = { isDeleted: true };
  const data = await moduleService.updateById(req.params.id, update);
  if (!data) throwError(MESSAGES.DATA_NOT_FOUND, HTTP_STATUS.NOT_FOUND);

  return apiResponse(res, { message: MESSAGES.DELETE_SUCCESS, data });
});

export default {
  create,
  getAll,
  getById,
  updateById,
  deleteById,
};
