import { createUser } from "./users";

const apiDocumentation = {
  openapi: "3.0.1",
  info: {
    version: "1.0.0",
    title: "My REST API - Documentation",
    description: "TEST api",
  },
  tags: [
    {
      name: "Roles",
    },
    {
      name: "Users",
    },
  ],
  paths: {
    users: {
      post: createUser,
    },
  },
};

export { apiDocumentation };
