import fs from "fs";
import path from "path";
import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import env from "../config/env.js";

// Create logs directory if it doesn't exist
const logDir = path.join(process.cwd(), "logs");
fs.mkdirSync(logDir, { recursive: true });

// Custom log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf(({ timestamp, level, message, user }) => {
    return `[${timestamp}] [${level.toUpperCase()}] [User: ${user?.id || "Unknown"}] ${message}`;
  }),
);

// Transports
const transports = [new winston.transports.Console({ format: logFormat })];

// File logging only in production
if (env.NODE_ENV === "production") {
  transports.push(
    new DailyRotateFile({
      filename: "logs/teriopay-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "10m",
      maxFiles: "30d",
    }),
  );
}

const logger = winston.createLogger({
  level: "info",
  format: logFormat,
  transports: transports,
});

export default logger;
