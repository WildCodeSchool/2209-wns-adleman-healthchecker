import { DataSource } from "typeorm";
import Url from "./entity/Url";
import Response from "./entity/Response";
import { env } from "./environment";
import User from "./entity/User";
import UserToUrl from "./entity/UserToUrl";

export default new DataSource({
  type: "postgres",
  host: env.DB_HOST ?? "database",
  port: env.DB_PORT ?? 5432,
  username: env.DB_USER ?? "postgres",
  password: env.DB_PASS ?? "postgres",
  database: env.DB_NAME ?? "postgres",
  synchronize: true,
  entities: [Url, Response, User, UserToUrl],
  // logging: ["query", "error"],
});
