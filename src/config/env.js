import dotenv from "dotenv";
import path from "path";

const NODE_ENV = process.env.NODE_ENV || "development";

console.log(process.cwd(), `.env.${NODE_ENV}`);

// Load correct .env file
dotenv.config({
  path: path.resolve(process.cwd(), `.env.${NODE_ENV}`),
});

const {
  PORT,
  DEBUG_MODE,
  DATABASE_URL,
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
  JWT_ACCESS_EXPIRES_IN,
  JWT_REFRESH_EXPIRES_IN,
  INIT_ADMIN_USERNAME,
  INIT_ADMIN_PASSWORD,
} = process.env;

// Basic validation
const requiredVars = ["DATABASE_URL", "JWT_ACCESS_SECRET", "JWT_REFRESH_SECRET"];
requiredVars.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`❌ Missing required env variable: ${key}`);
  }
});

const env = {
  NODE_ENV,
  DEBUG_MODE: DEBUG_MODE === "true",
  PORT: PORT || 5000,
  DATABASE_URL,
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
  JWT_ACCESS_EXPIRES_IN: JWT_ACCESS_EXPIRES_IN || "15m",
  JWT_REFRESH_EXPIRES_IN: JWT_REFRESH_EXPIRES_IN || "1d",
  INIT_ADMIN_USERNAME: INIT_ADMIN_USERNAME || "admin",
  INIT_ADMIN_PASSWORD: INIT_ADMIN_PASSWORD || "Admin@123",
};

export default env;
