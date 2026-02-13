import BaseService from "../../services/base.service.js";
import { prisma } from "../../config/db.js";
import throwError from "../../utils/throwError.js";
import MESSAGES from "../../constants/responseMessages.js";

class ModuleService extends BaseService {
  constructor() {
    super(prisma, "module");
  }

  async create(data) {
    const payload = {
      name: data.name,
      description: data.description ?? data.name,
      type: data.type ?? "module",
      parentModuleId: data.parentModule ?? null,
      isActive: data.isActive ?? true,
    };
    return await this.model.create({ data: payload });
  }

  async updateById(id, data, options = {}) {
    const payload = { ...data };
    if (payload.parentModule !== undefined) {
      payload.parentModuleId = payload.parentModule;
      delete payload.parentModule;
    }
    return await this.model.update({
      where: { id },
      data: payload,
      ...options,
    });
  }

  async ensureUnique(filter, excludeId) {
    const exists = await this.isExist(filter, excludeId);
    if (exists) throwError(MESSAGES.DATA_ALREADY_EXISTS);
  }

  async isReferenced(id) {
    const count = await prisma.permission.count({
      where: { moduleId: id, isDeleted: false },
    });
    return count > 0;
  }

  async ensureNotReferenced(id) {
    const referenced = await this.isReferenced(id);
    if (referenced) throwError(MESSAGES.DATA_IN_USE);
  }
}

export default new ModuleService();
