import BaseService from "../../services/base.service.js";
import { prisma } from "../../config/db.js";
import throwError from "../../utils/throwError.js";
import MESSAGES from "../../constants/responseMessages.js";
import { HTTP_STATUS } from "../../constants/constant.js";

class EmployeeService extends BaseService {
  constructor() {
    super(prisma, "employee");
  }

  async create(data) {
    const payload = {
      firstName: data.firstName,
      lastName: data.lastName,
      userId: data.userId,
      departmentId: data.departmentId,
      address: data.address,
      photoUrl: data.photoUrl ?? null,
      gender: data.gender ?? 1,
      dob: data.dob ? new Date(data.dob) : null,
      maritalStatus: data.maritalStatus ?? 1,
      idPhotoUrl: data.idPhotoUrl ?? null,
      personalPhone: data.personalPhone ?? null,
      workPhone: data.workPhone ?? null,
      personalEmail: data.personalEmail ?? null,
      workEmail: data.workEmail ?? null,
      status: data.status ?? 1,
    };
    return await this.model.create({ data: payload });
  }

  async updateById(id, data, options = {}) {
    const payload = { ...data };
    if (payload.dob !== undefined) payload.dob = payload.dob ? new Date(payload.dob) : null;
    return await this.model.update({
      where: { id },
      data: payload,
      ...options,
    });
  }

  async ensureExists(id) {
    const employee = await this.getById(id);
    if (!employee) throwError(MESSAGES.EMPLOYEE_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    return employee;
  }
}

export default new EmployeeService();
