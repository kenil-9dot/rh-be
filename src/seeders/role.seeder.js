import { prisma } from "../config/db.js";

const DEFAULT_ROLES = [{ name: "admin" }, { name: "subadmin" }, { name: "user" }];

const seedRoles = async () => {
  try {
    for (const role of DEFAULT_ROLES) {
      const exists = await prisma.role.findFirst({
        where: { name: role.name, isDeleted: false },
      });

      if (exists) continue;

      await prisma.role.create({ data: { name: role.name } });
    }

    console.log("🎉 Roles seeded");
  } catch (err) {
    console.error("❌ Roles seeder failed:", err);
  }
};

export default seedRoles;
