import { PrismaClient } from "@prisma/client";
import logger from "../utils/logger";

const prisma = new PrismaClient();

export async function connectToDatabase() {
  try {
    await prisma.$connect();
    logger.info("🚀 Successfully connected to the database!");
  } catch (error) {
    logger.info("❌ Failed to connect to the database:"+ error);
    process.exit(1);
  }
}

export default prisma;
