import asyncMiddleware from "./async.middleware.js";
import throwError from "../utils/throwError.js";
import MESSAGES from "../constants/responseMessages.js";
import { HTTP_STATUS, ROLES } from "../constants/constant.js";

const roleMiddleware = (...allowedRoles) => {
  return asyncMiddleware((req, res, next) => {
    const role = req?.user?.role;
    if (!role) throwError(MESSAGES.ACCESS_DENIED, HTTP_STATUS.FORBIDDEN);

    // Admin can access all
    if (role === ROLES.ADMIN) return next();

    // Check if role is allowed
    if (!allowedRoles.includes(role)) {
      throwError(MESSAGES.ACCESS_DENIED, HTTP_STATUS.FORBIDDEN);
    }

    next();
  });
};

export default roleMiddleware;
