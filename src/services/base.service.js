/**
 * Base service for Prisma models.
 * @param {import('@prisma/client').PrismaClient} prisma - Prisma client
 * @param {string} modelName - Model name (user, role, permission, module, session)
 */
class BaseService {
  constructor(prisma, modelName) {
    this.prisma = prisma;
    this.modelName = modelName;
    this.model = prisma[modelName];
  }

  async create(data) {
    return await this.model.create({ data });
  }

  async getAll(filter = {}, options = {}) {
    const {
      page = 1,
      limit = 10,
      pagination = true,
      select,
      sortBy = "createdAt",
      sortOrder = "desc",
      search = "",
      searchFields = [],
      include,
    } = options;

    const where = { ...filter };
    if (this.modelName !== "session") where.isDeleted = false;

    if (search && searchFields.length) {
      where.OR = searchFields.map((field) => ({
        [field]: { contains: search, mode: "insensitive" },
      }));
    }

    const orderBy = { [sortBy]: sortOrder };

    const skip = pagination ? (page - 1) * limit : undefined;
    const take = pagination ? limit : undefined;

    const [data, total] = await Promise.all([
      this.model.findMany({
        where,
        orderBy,
        skip,
        take,
        ...(select && { select }),
        ...(include && { include }),
      }),
      this.model.count({ where }),
    ]);

    return { data, total, page, limit };
  }

  async getById(id, options = {}) {
    const { select, include } = options;
    return await this.model.findUnique({
      where: { id },
      ...(select && { select }),
      ...(include && { include }),
    });
  }

  async getOneByFilter(filter = {}, options = {}) {
    const { select, include } = options;
    return await this.model.findFirst({
      where: filter,
      ...(select && { select }),
      ...(include && { include }),
    });
  }

  async updateById(id, data, options = {}) {
    return await this.model.update({
      where: { id },
      data,
      ...options,
    });
  }

  async updateOneByFilter(filter, data, options = {}) {
    const found = await this.model.findFirst({ where: filter });
    if (!found) return null;
    return await this.model.update({
      where: { id: found.id },
      data,
      ...options,
    });
  }

  async deleteById(id) {
    return await this.model.delete({ where: { id } });
  }

  async deleteOne(filter) {
    const found = await this.model.findFirst({ where: filter });
    if (!found) return null;
    return await this.model.delete({ where: { id: found.id } });
  }

  async deleteMany(filter = {}) {
    return await this.model.deleteMany({ where: filter });
  }

  async isExist(filter = {}, excludeId = null) {
    const where = { ...filter };
    if (this.modelName !== "session") where.isDeleted = false;
    if (excludeId) where.id = { not: excludeId };
    const count = await this.model.count({ where });
    return count > 0;
  }
}

export default BaseService;
