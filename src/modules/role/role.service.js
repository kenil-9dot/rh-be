import BaseService from "../../services/base.service.js";
import { prisma } from "../../config/db.js";
import throwError from "../../utils/throwError.js";
import MESSAGES from "../../constants/responseMessages.js";

class RoleService extends BaseService {
  constructor() {
    super(prisma, "role");
  }

  async create(data) {
    const payload = { name: data.name };
    return await this.model.create({ data: payload });
  }

  async ensureUnique(filter, excludeId) {
    const exists = await this.isExist(filter, excludeId);
    if (exists) throwError(MESSAGES.DATA_ALREADY_EXISTS);
  }

  async isReferenced(id) {
    const count = await prisma.user.count({ where: { roleId: id, isDeleted: false } });
    return count > 0;
  }

  async ensureNotReferenced(id) {
    const referenced = await this.isReferenced(id);
    if (referenced) throwError(MESSAGES.DATA_IN_USE);
  }
}

export default new RoleService();
