import swaggerJsdoc from "swagger-jsdoc";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

dotenv.config();

function logCurrentDirectory() {
  console.log("🚀 Current Working Directory:", process.cwd());

  try {
    const currentDir = process.cwd();
    const items = fs.readdirSync(currentDir);
    console.log("📂 Directory Contents:");
    items.forEach((item) => {
      const fullPath = path.join(currentDir, item);
      const stats = fs.statSync(fullPath);
      console.log(`- ${item} (${stats.isDirectory() ? "Folder" : "File"})`);
    });
  } catch (err) {
    console.error("❌ Error reading directory:", err);
  }
}

// Call the function to log the directory
logCurrentDirectory();

function findSwaggerPaths(): string[] {
  const baseDir = process.cwd();
  const possibleDirs = [
    path.join(baseDir, "dist", "docs", "routes"), // Production build on Vercel
    path.join(baseDir, "docs", "routes"), // Local or alternative setup
    path.join(baseDir, "src", "docs", "routes"), // Dev environment with TypeScript
  ];

  for (const dir of possibleDirs) {
    console.log(`🔍 Checking directory: ${dir}`);

    if (fs.existsSync(dir)) {
      const files = fs
        .readdirSync(dir)
        .filter((file) => file.endsWith(".js") || file.endsWith(".ts"));
      if (files.length > 0) {
        const fullPath = path.join(dir, "*.js");
        console.log(`✅ Found Swagger routes at: ${fullPath}`);
        return [fullPath];
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
