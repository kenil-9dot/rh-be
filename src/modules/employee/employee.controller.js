import employeeService from "./employee.service.js";
import asyncMiddleware from "../../middlewares/async.middleware.js";
import apiResponse from "../../utils/apiResponse.js";
import throwError from "../../utils/throwError.js";
import MESSAGES from "../../constants/responseMessages.js";
import { HTTP_STATUS } from "../../constants/constant.js";

const create = asyncMiddleware(async (req, res) => {
  const data = await employeeService.create(req.body);
  return apiResponse(res, { message: MESSAGES.CREATE_SUCCESS, data });
});

const getAll = asyncMiddleware(async (req, res) => {
  const options = {
    ...req.validated.query,
    searchFields: req.validated.query.searchFields?.length
      ? req.validated.query.searchFields
      : ["firstName", "lastName", "workEmail", "personalEmail"],
    include: {
      department: { select: { id: true, name: true } },
      user: { select: { id: true, username: true, fullName: true } },
    },
  };
  const data = await employeeService.getAll({}, options);
  return apiResponse(res, { message: MESSAGES.FETCH_SUCCESS, data });
});

const getById = asyncMiddleware(async (req, res) => {
  const id = req.params.id;
  const data = await employeeService.getById(id, {
    include: {
      department: { select: { id: true, name: true } },
      user: { select: { id: true, username: true, fullName: true } },
    },
  });
  if (!data) throwError(MESSAGES.EMPLOYEE_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  return apiResponse(res, { message: MESSAGES.FETCH_SUCCESS, data });
});

const updateById = asyncMiddleware(async (req, res) => {
  const id = req.params.id;
  await employeeService.ensureExists(id);
  const data = await employeeService.updateById(id, req.body);
  return apiResponse(res, { message: MESSAGES.UPDATE_SUCCESS, data });
});

const deleteById = asyncMiddleware(async (req, res) => {
  const id = req.params.id;
  await employeeService.ensureExists(id);
  await employeeService.updateById(id, { isDeleted: true });
  const data = await employeeService.getById(id);
  return apiResponse(res, { message: MESSAGES.DELETE_SUCCESS, data });
});

export default {
  create,
  getAll,
  getById,
  updateById,
  deleteById,
};
