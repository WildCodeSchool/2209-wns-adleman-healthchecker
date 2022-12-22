import { DataSource } from "typeorm";
import Url from "./entity/Url";
import Response from "./entity/Response";
import { env } from "./environment";

export default new DataSource({
  type: "postgres",
  host: env.DATABASE_HOST,
  port: 5432,
  username: "postgres",
  password: "postgres",
  database: "postgres",
  synchronize: true,
  entities: [Url, Response],
  logging: ["query", "error"],
});
