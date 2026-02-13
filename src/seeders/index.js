import dotenv from "dotenv";
dotenv.config();

import connectDB from "../config/db.js";
import { prisma } from "../config/db.js";

import seedRoles from "./role.seeder.js";
import seedDepartments from "./department.seeder.js";
import seedAdmin from "./admin.seeder.js";

const runSeeders = async () => {
  console.log("🚀 Running seeders...\n");

  await seedRoles();
  await seedDepartments();
  await seedAdmin();

  console.log("\n🎉 All seeders completed successfully");
};

const run = async () => {
  try {
    await connectDB();
    await runSeeders();
  } catch (err) {
    console.error("❌ Seeder failed:", err);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
};

run();
