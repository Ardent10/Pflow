import swaggerJsdoc from "swagger-jsdoc";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

dotenv.config();

function findSwaggerPaths(): string[] {
  const possiblePaths = [
    path.join(__dirname, "docs", "routes", "*.js"), 
    path.join(__dirname, "..", "docs", "routes", "*.js"), 
    path.join(process.cwd(), "dist", "docs", "routes", "*.js"), // Vercel project root
    path.join(process.cwd(), "docs", "routes", "*.js"), // Local build or development
    path.join(process.cwd(), "src", "docs", "routes", "*.ts"), // Development (TypeScript)
  ];

  for (const apiPath of possiblePaths) {
    const directory = path.dirname(apiPath);
    console.log(`DIRECTORY: ${directory}`);

    if (fs.existsSync(directory)) {
      const files = fs
        .readdirSync(directory)
        .filter((file) => file.endsWith(".js") || file.endsWith(".ts"));
      if (files.length > 0) {
        console.log(`✅ Found Swagger routes at: ${apiPath}`);
        return [apiPath];
      }
    }
  }

  console.warn(
    "⚠️ No Swagger routes found. Please check your folder structure."
  );
  return [];
}

const apiPaths = findSwaggerPaths();

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Policy Management API",
      version: "1.0.0",
      description: "API documentation for the policy management system.",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT}`,
        description: "Development server",
      },
      {
        url: "https://pflow-ecru.vercel.app",
        description: "Production server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: apiPaths,
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
export default swaggerDocs;
