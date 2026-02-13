import { prisma } from "../config/db.js";

const DEFAULT_DEPARTMENTS = [{ name: "General" }];

const seedDepartments = async () => {
  try {
    for (const dept of DEFAULT_DEPARTMENTS) {
      const exists = await prisma.department.findFirst({
        where: { name: dept.name, isDeleted: false },
      });
      if (exists) continue;
      await prisma.department.create({ data: { name: dept.name } });
    }
    console.log("🎉 Departments seeded");
  } catch (err) {
    console.error("❌ Departments seeder failed:", err);
  }
};

export default seedDepartments;
