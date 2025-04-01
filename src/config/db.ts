import { PrismaClient } from "../../prisma/generated/client";
import logger from "../utils/logger";

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient({
    log: ["info"],
  });
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      log: ["info"],
    });
  }
  prisma = global.prisma;
}

export async function connectToDatabase() {
  try {
    await prisma.$connect();
    logger.info("🚀 Successfully connected to the database!");
  } catch (error) {
    logger.info("❌ Failed to connect to the database:" + error);
    process.exit(1);
  }
}

export default prisma;
