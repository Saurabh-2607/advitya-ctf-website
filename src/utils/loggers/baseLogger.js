import winston from "winston";
import { existsSync, mkdirSync } from "fs";
import path from "path";

const logDir = path.join(process.cwd(), "logs");

if (!existsSync(logDir)) {
  mkdirSync(logDir, { recursive: true });
}

export function createLogger(filename, level = "info") {
  return winston.createLogger({
    level,
    format: winston.format.combine(
      winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
      winston.format.errors({ stack: true }),
      winston.format.json()
    ),
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple()
        )
      }),
      new winston.transports.File({
        filename: path.join(logDir, filename),
        maxsize: 5 * 1024 * 1024,
        maxFiles: 5,
      })
    ]
  });
}