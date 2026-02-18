import mysql from "mysql2/promise";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const NODE_ENV = process.env.NODE_ENV || "development";

dotenv.config({
  path: path.resolve(__dirname, "..", `.env.${NODE_ENV}`),
});

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("❌ DATABASE_URL is not set");
  process.exit(1);
}

// Parse MySQL URL and get connection without database
const parsed = new URL(url);
const dbName = parsed.pathname.slice(1).replace(/\/$/, "").split("?")[0];

if (!dbName) {
  console.error("❌ No database name in DATABASE_URL");
  process.exit(1);
}

const connectionConfig = {
  host: parsed.hostname,
  port: parseInt(parsed.port || "3306", 10),
  user: parsed.username,
  password: parsed.password,
};

async function createDb() {
  let connection;
  try {
    connection = await mysql.createConnection(connectionConfig);
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    console.log(`✅ Database "${dbName}" created or already exists`);
  } catch (err) {
    console.error("❌ Failed to create database:", err.message);
    process.exit(1);
  } finally {
    if (connection) await connection.end();
  }
}

createDb();
