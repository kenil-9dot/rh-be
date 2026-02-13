import userService from "./user.service.js";
import asyncMiddleware from "../../middlewares/async.middleware.js";
import apiResponse from "../../utils/apiResponse.js";
import throwError from "../../utils/throwError.js";
import MESSAGES from "../../constants/responseMessages.js";
import { HTTP_STATUS } from "../../constants/constant.js";

const create = asyncMiddleware(async (req, res) => {
  await userService.ensureUnique({ email: req.body.email });

  const data = await userService.create(req.body);

  return apiResponse(res, { message: MESSAGES.CREATE_SUCCESS, data });
});

const getAll = asyncMiddleware(async (req, res) => {
  const options = {
    ...req.validated.query,
    include: { role: { select: { name: true } } },
  };

  const data = await userService.getAll({}, options);

  return apiResponse(res, { message: MESSAGES.FETCH_SUCCESS, data });
});

const getById = asyncMiddleware(async (req, res) => {
  const options = { include: { role: { select: { name: true } } } };

  const data = await userService.getById(req.params.id, options);
  if (!data) throwError(MESSAGES.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND);

  return apiResponse(res, { message: MESSAGES.FETCH_SUCCESS, data });
});

const updateById = asyncMiddleware(async (req, res) => {
  await userService.ensureUnique({ email: req.body.email }, req.params.id);

  const data = await userService.updateById(req.params.id, req.body);
  if (!data) throwError(MESSAGES.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND);

  return apiResponse(res, { message: MESSAGES.UPDATE_SUCCESS, data });
});

const deleteById = asyncMiddleware(async (req, res) => {
  await userService.ensureDeletable(req.params.id);

  const data = await userService.updateById(req.params.id, { isDeleted: true });
  if (!data) throwError(MESSAGES.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND);

  return apiResponse(res, { message: MESSAGES.DELETE_SUCCESS, data });
});

export default {
  create,
  getAll,
  getById,
  updateById,
  deleteById,
};
