import pg from "pg";
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

// Parse URL and get connection to default 'postgres' database
const parsed = new URL(url);
const dbName = parsed.pathname.slice(1).split("?")[0];
parsed.pathname = "/postgres";
const postgresUrl = parsed.toString();

const client = new pg.Client({ connectionString: postgresUrl });

async function createDb() {
  try {
    await client.connect();
    const res = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [dbName],
    );
    if (res.rows.length > 0) {
      console.log(`✅ Database "${dbName}" already exists`);
      return;
    }
    await client.query(`CREATE DATABASE "${dbName}"`);
    console.log(`✅ Database "${dbName}" created`);
  } catch (err) {
    if (err.code === "42P04") {
      console.log(`✅ Database "${dbName}" already exists`);
    } else {
      console.error("❌ Failed to create database:", err.message);
      process.exit(1);
    }
  } finally {
    await client.end();
  }
}

createDb();
