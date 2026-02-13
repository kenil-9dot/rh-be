import bcrypt from "bcryptjs";
import env from "../../config/env.js";
import { prisma } from "../../config/db.js";
import userService from "../user/user.service.js";
import roleService from "../role/role.service.js";
import sessionService from "../session/session.service.js";
import asyncMiddleware from "../../middlewares/async.middleware.js";
import apiResponse from "../../utils/apiResponse.js";
import throwError from "../../utils/throwError.js";
import MESSAGES from "../../constants/responseMessages.js";
import { HTTP_STATUS, LOGIN_TYPE } from "../../constants/constant.js";
import { getExpiryDate, isExpired } from "../../utils/date.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../utils/token.js";

const validateLoginType = (loginType, roleName) => {
  if (loginType === LOGIN_TYPE.ADMIN)
    return ["admin", "subadmin"].includes(roleName?.toLowerCase());

  if (loginType === LOGIN_TYPE.USER) return roleName?.toLowerCase() === "user";

  return false;
};

const login = asyncMiddleware(async (req, res) => {
  const { username, password, loginType } = req.body;

  const user = await userService.getOneByFilter(
    { username, status: 1 },
    {
      select: {
        id: true,
        fullName: true,
        username: true,
        password: true,
        roleId: true,
        role: { select: { name: true } },
      },
    },
  );

  if (!user) throwError(MESSAGES.INVALID_CREDENTIAL, HTTP_STATUS.UNAUTHORIZED);

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throwError(MESSAGES.INVALID_CREDENTIAL, HTTP_STATUS.UNAUTHORIZED);

  const isValid = validateLoginType(loginType, user.role?.name);
  if (!isValid) throwError(MESSAGES.ACCESS_DENIED, HTTP_STATUS.FORBIDDEN);

  const tokenData = { id: user.id, role: user.role.name };
  const accessToken = generateAccessToken(tokenData);
  const refreshToken = generateRefreshToken(tokenData);

  await sessionService.create({
    userId: user.id,
    refreshToken,
    userAgent: req.headers["user-agent"],
    ipAddress: req.ip,
    expiresAt: getExpiryDate(env.JWT_REFRESH_EXPIRES_IN),
  });

  const { password: _, ...userWithoutPassword } = user;
  return apiResponse(res, {
    message: MESSAGES.LOGIN_SUCCESS,
    data: { user: userWithoutPassword, accessToken, refreshToken },
  });
});

const ensureDefaultRoleAndDepartment = async () => {
  let role = await roleService.getOneByFilter({});
  if (!role) {
    role = await prisma.role.create({ data: { name: "user" } });
  }
  let department = await prisma.department.findFirst({
    where: { isDeleted: false },
  });
  if (!department) {
    department = await prisma.department.create({ data: { name: "General" } });
  }
  return { role, department };
};

const register = asyncMiddleware(async (req, res) => {
  const { username, fullName, password, roleId, departmentId } = req.body;

  const isExist = await userService.getOneByFilter({ username, status: 1 });
  if (isExist) throwError(MESSAGES.USER_ALREADY_EXISTS);

  let role;
  let department;

  if (roleId) {
    role = await roleService.getById(roleId);
    if (!role) throwError(MESSAGES.ROLE_NOT_FOUND);
  }
  if (departmentId) {
    department = await prisma.department.findFirst({
      where: { id: departmentId, isDeleted: false },
    });
    if (!department) throwError(MESSAGES.DEPARTMENT_NOT_FOUND);
  }

  if (!role || !department) {
    const defaults = await ensureDefaultRoleAndDepartment();
    role = role ?? defaults.role;
    department = department ?? defaults.department;
  }

  const user = await userService.create({
    username,
    fullName,
    password,
    roleId: role.id,
    departmentId: department.id,
  });

  return apiResponse(res, {
    message: MESSAGES.REGISTER_SUCCESS,
    data: user,
  });
});

const getRefreshTokenFromHeader = (req) => {
  const token = req.headers.refreshtoken?.split(" ")[1];
  if (!token) throwError(MESSAGES.TOKEN_NOT_FOUND, HTTP_STATUS.UNAUTHORIZED);
  return token;
};

const refreshToken = asyncMiddleware(async (req, res) => {
  const oldRefreshToken = getRefreshTokenFromHeader(req);

  const decoded = verifyRefreshToken(oldRefreshToken);
  if (!decoded) throwError(MESSAGES.TOKEN_INVALID, HTTP_STATUS.UNAUTHORIZED);

  const session = await sessionService.getOneByFilter({
    refreshToken: oldRefreshToken,
  });
  if (!session || isExpired(session.expiresAt)) {
    throwError(MESSAGES.SESSION_EXPIRED, HTTP_STATUS.UNAUTHORIZED);
  }

  const user = await userService.getById(session.userId, {
    include: { role: { select: { name: true } } },
  });

  const tokenData = { id: user.id, role: user.role.name };
  const accessToken = generateAccessToken(tokenData);
  const refreshToken = generateRefreshToken(tokenData);

  await sessionService.updateById(session.id, {
    refreshToken,
    expiresAt: getExpiryDate(env.JWT_REFRESH_EXPIRES_IN),
  });

  return apiResponse(res, {
    message: MESSAGES.CREATE_SUCCESS,
    data: { accessToken, refreshToken },
  });
});

const logout = asyncMiddleware(async (req, res) => {
  const refreshToken = getRefreshTokenFromHeader(req);

  await sessionService.deleteMany({ refreshToken });

  return apiResponse(res, { message: MESSAGES.LOGOUT_SUCCESS });
});

const logoutAll = asyncMiddleware(async (req, res) => {
  const refreshToken = getRefreshTokenFromHeader(req);

  const decoded = verifyRefreshToken(refreshToken);
  if (!decoded) throwError(MESSAGES.TOKEN_INVALID, HTTP_STATUS.UNAUTHORIZED);

  await sessionService.deleteMany({ userId: decoded.id });

  return apiResponse(res, { message: MESSAGES.LOGOUT_ALL_SUCCESS });
});

export default { login, register, refreshToken, logout, logoutAll };
