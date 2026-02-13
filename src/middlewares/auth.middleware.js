import asyncMiddleware from "./async.middleware.js";
import { verifyAccessToken } from "../utils/token.js";
import throwError from "../utils/throwError.js";
import MESSAGES from "../constants/responseMessages.js";
import { HTTP_STATUS } from "../constants/constant.js";

const authMiddleware = asyncMiddleware((req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7)
    : authHeader?.trim() || null;

  if (!token) throwError(MESSAGES.TOKEN_NOT_FOUND, HTTP_STATUS.UNAUTHORIZED);

  const decoded = verifyAccessToken(token);
  if (!decoded) throwError(MESSAGES.TOKEN_INVALID, HTTP_STATUS.UNAUTHORIZED);

  req.user = decoded; // { id, role }
  next();
});

export default authMiddleware;
