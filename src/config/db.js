import { PrismaClient } from "@prisma/client";
import env from "./env.js";

const prisma = new PrismaClient({
  log: env.DEBUG_MODE ? ["query", "error", "warn"] : ["error"],
});

const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log("✅ MySQL connected (Prisma)");
  } catch (error) {
    console.error("❌ MySQL connection failed", error);
    process.exit(1);
  }
};

export { prisma };
export default connectDB;
