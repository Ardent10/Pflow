import swaggerJsdoc from "swagger-jsdoc";
import dotenv from "dotenv";

dotenv.config();

const apiPaths =
  process.env.NODE_ENV === "production"
    ? [
        `${__dirname}/docs/routes/auth.js`,
        `${__dirname}/docs/routes/policy.js`,
        `${__dirname}/docs/routes/template.js`,
        `${__dirname}/docs/routes/acknowledgement.js`,
      ]
    : ["./src/docs/routes/*.ts"];

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
