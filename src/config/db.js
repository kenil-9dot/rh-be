import { PrismaClient } from "@prisma/client";
import env from "./env.js";

const prisma = new PrismaClient({
  log: env.DEBUG_MODE ? ["query", "error", "warn"] : ["error"],
});

const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log("✅ PostgreSQL connected (Prisma)");
  } catch (error) {
    console.error("❌ PostgreSQL connection failed", error);
    process.exit(1);
  }
};

export { prisma };
export default connectDB;
