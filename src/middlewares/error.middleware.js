import env from "../config/env.js";
import logger from "../services/logger.service.js";
import apiResponse from "../utils/apiResponse.js";
import MESSAGES from "../constants/responseMessages.js";
import { HTTP_STATUS } from "../constants/constant.js";

const errorMiddleware = (err, req, res, next) => {
  console.error(err);

  logger.log({ level: "error", message: err?.message, user: req?.user });

  return apiResponse(res, {
    success: false,
    message: env.DEBUG_MODE ? err.message : MESSAGES.INTERNAL_SERVER_ERROR,
    statusCode: err.statusCode || HTTP_STATUS.SERVER_ERROR,
    data: err.data || null,
  });
};

export default errorMiddleware;
