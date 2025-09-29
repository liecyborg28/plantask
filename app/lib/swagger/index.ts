import { authPaths } from "./auth";

export const swaggerSpec = {
  openapi: "3.0.3",
  info: {
    title: "Task Master API",
    version: "1.0.0",
    description: "API documentation for Task Master app",
  },
  servers: [{ url: "http://localhost:3000/api" }],
  paths: {
    ...authPaths,
  },
};
