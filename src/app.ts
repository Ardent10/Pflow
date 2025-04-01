import express from "express";
import "express-async-errors";
import cors from "cors";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import swaggerDocs from "./docs/swagger";
import { errorHandler } from "./middleware/errorHandler";
import policyRoutes from "./routes/policy";
import acknowledgementRoutes from "./routes/acknowledgement";
import templateRoutes from "./routes/template";
import authRoutes from "./routes/auth";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/templates", templateRoutes);
app.use("/api/v1/policies", policyRoutes);
app.use("/api/v1/acknowledgements", acknowledgementRoutes);

// Swagger documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(errorHandler);

export default app;
