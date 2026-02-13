import bcrypt from "bcryptjs";
import BaseService from "../../services/base.service.js";
import { prisma } from "../../config/db.js";
import throwError from "../../utils/throwError.js";
import MESSAGES from "../../constants/responseMessages.js";
import { HTTP_STATUS, ROLES } from "../../constants/constant.js";

class UserService extends BaseService {
  constructor() {
    super(prisma, "user");
  }

  async create(data) {
    const hashedPassword = data.password
      ? await bcrypt.hash(data.password, 10)
      : "";
    const payload = {
      fullName: data.fullName,
      username: data.username,
      password: hashedPassword,
      roleId: data.roleId,
      departmentId: data.departmentId,
    };
    return await this.model.create({ data: payload });
  }

  async updateById(id, data, options = {}) {
    const payload = { ...data };
    if (payload.password) {
      payload.password = await bcrypt.hash(payload.password, 10);
    }
    if (payload.roleId !== undefined) {
      // already roleId
    }
    return await this.model.update({
      where: { id },
      data: payload,
      ...options,
    });
  }

  async ensureUnique(filter, excludeId) {
    const exists = await this.isExist(filter, excludeId);
    if (exists) throwError(MESSAGES.USER_ALREADY_EXISTS);
  }

  async ensureDeletable(id) {
    const user = await this.getById(id, {
      include: { role: { select: { name: true } } },
    });
    if (!user) throwError(MESSAGES.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    if (user.role?.name?.toLowerCase() === ROLES.ADMIN) {
      throwError(MESSAGES.ACCESS_DENIED, HTTP_STATUS.FORBIDDEN);
    }
  }

  async getUserPermissions(userId) {
    return await this.getById(userId, {
      include: {
        role: { select: { name: true } },
      },
    });
  }
}

export default new UserService();
