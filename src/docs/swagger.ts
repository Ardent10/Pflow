import swaggerJsdoc from "swagger-jsdoc";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

// const apiPaths = [
//   // path.join(__dirname, "./routes/auth.js"),
//   // path.join(__dirname, "./routes/policy.js"),
//   // path.join(__dirname, "./routes/template.js"),
//   // path.join(__dirname, "../src/routes/*.ts"),
// ];

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
        url: "https://pflow-xi.vercel.app",
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
  apis: ["./src/routes/*.ts", "./routes/*.js"],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
export default swaggerDocs;
