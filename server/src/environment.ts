import { load } from "ts-dotenv";

export const env = load({
  CORS_ALLOWED_ORIGINS: String,
  NODE_ENV: ["production" as const, "development" as const],
  SERVER_HOST: String,
  SERVER_PORT: Number,
  POSTGRES_PASSWORD: String,
  POSTGRES_USER: String,
  POSTGRES_DATABASE: String,
});
