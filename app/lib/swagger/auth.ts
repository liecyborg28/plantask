export const authPaths = {
  "/auth/register": {
    post: {
      tags: ["Auth"],
      summary: "Register a new user",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                email: { type: "string", example: "user@example.com" },
                password: { type: "string", example: "password123" },
              },
              required: ["email", "password"],
            },
          },
        },
      },
      responses: {
        200: { description: "User registered successfully" },
        400: { description: "Error registering user" },
      },
    },
  },
  "/auth/login": {
    post: {
      tags: ["Auth"],
      summary: "Login user",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                email: { type: "string", example: "user@example.com" },
                password: { type: "string", example: "password123" },
              },
              required: ["email", "password"],
            },
          },
        },
      },
      responses: {
        200: { description: "User logged in successfully" },
        401: { description: "Invalid credentials" },
      },
    },
  },
};
