import swaggerJsdoc from "swagger-jsdoc";
import dotenv from "dotenv";
dotenv.config();

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Policy Management API",
      version: "1.0.0",
      description:
        "API documentation for policy management system for SOC2 Compliance.",
    },
    servers: [
      {
        url: "/",
        description: "Production server",
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
  apis: ["./src/docs/routes/*.ts"],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
export default swaggerDocs;
