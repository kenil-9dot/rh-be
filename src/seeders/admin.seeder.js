import bcrypt from "bcryptjs";
import env from "../config/env.js";
import { prisma } from "../config/db.js";

const seedAdmin = async () => {
  try {
    const adminUsername = env.INIT_ADMIN_USERNAME || "admin";

    const isExist = await prisma.user.findFirst({
      where: { username: adminUsername, isDeleted: false },
    });
    if (isExist) return console.log("🎉 Admin already seeded");

    const adminRole = await prisma.role.findFirst({
      where: { name: "admin", isDeleted: false },
    });
    if (!adminRole) {
      console.error("❌ Admin role not found. Run role seeder first.");
      return;
    }

    const department = await prisma.department.findFirst({
      where: { isDeleted: false },
    });
    if (!department) {
      console.error("❌ No department found. Run department seeder first.");
      return;
    }

    const hashedPassword = await bcrypt.hash(
      env.INIT_ADMIN_PASSWORD || "Admin@123",
      10,
    );

    await prisma.user.create({
      data: {
        fullName: "Super Admin",
        username: adminUsername,
        password: hashedPassword,
        roleId: adminRole.id,
        departmentId: department.id,
      },
    });

    console.log("🎉 Admin seeded");
  } catch (err) {
    console.error("❌ Admin seeder failed:", err);
  }
};

export default seedAdmin;
