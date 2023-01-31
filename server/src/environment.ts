import { load } from "ts-dotenv";

export const env = load({
  CORS_ALLOWED_ORIGINS: String,
  NODE_ENV: ["production" as const, "development" as const],
  SERVER_HOST: String,
  SERVER_PORT: Number,
  DATABASE_HOST: ["database" as const, "testDB" as const, "localhost" as const],
  JWT_PRIVATE_KEY: String,
});
