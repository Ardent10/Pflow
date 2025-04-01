import dotenv from "dotenv";
import app from "./app";
import logger from "./utils/logger";
import { connectToDatabase } from "./config/db";

dotenv.config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info("Swagger docs available at /api-docs endpoint.");
});

connectToDatabase();
