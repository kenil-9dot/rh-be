import asyncMiddleware from "./async.middleware.js";
import userService from "../modules/user/user.service.js";
import throwError from "../utils/throwError.js";
import MESSAGES from "../constants/responseMessages.js";
import { HTTP_STATUS, ROLES } from "../constants/constant.js";

const permissionMiddleware = (permission) => {
  return asyncMiddleware(async (req, res, next) => {
    const role = req?.user?.role;
    if (!role) throwError(MESSAGES.ACCESS_DENIED, HTTP_STATUS.FORBIDDEN);

    // Admin can access all
    if (role === ROLES.ADMIN) return next();

    const user = await userService.getUserPermissions(req?.user?.id);
    const userPermissions = user?.permissions?.map((p) => p.name) || [];

    // Check if permission is allowed
    if (!userPermissions.includes(permission)) {
      throwError(MESSAGES.ACCESS_DENIED, HTTP_STATUS.FORBIDDEN);
    }

    next();
  });
};

export default permissionMiddleware;
