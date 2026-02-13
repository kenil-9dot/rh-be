import BaseService from "../../services/base.service.js";
import { prisma } from "../../config/db.js";

class SessionService extends BaseService {
  constructor() {
    super(prisma, "session");
  }
}

export default new SessionService();
