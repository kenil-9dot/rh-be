import asyncMiddleware from "./async.middleware.js";
import throwError from "../utils/throwError.js";
import MESSAGES from "../constants/responseMessages.js";
import { HTTP_STATUS } from "../constants/constant.js";

const validateMiddleware = (schema, property = "body") => {
  return asyncMiddleware((req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      allowUnknown: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = {};

      error.details.forEach((detail) => {
        const field = detail.path.join(".");
        errors[field] = detail.message.replace(/"/g, "");
      });

      throwError(MESSAGES.VALIDATION_FAILED, HTTP_STATUS.BAD_REQUEST, errors);
    }

    if (property === "query") {
      if (!req.validated) req.validated = {};
      req.validated[property] = value;
    } else {
      req[property] = value;
    }

    next();
  });
};

export default validateMiddleware;
