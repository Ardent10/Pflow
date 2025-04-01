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
import path from "path";

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
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocs, {
    customCssUrl: "/swagger-ui/swagger-ui.css",
    customJs: "/swagger-ui/swagger-ui-bundle.js",
  })
);

// Serve Swagger UI static files
app.use(
  "/swagger-ui",
  express.static(path.join(__dirname, "../node_modules/swagger-ui-dist"))
);

app.use(errorHandler);

export default app;
