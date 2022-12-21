import { DataSource } from "typeorm";
import Url from "./entity/Url";
import { env } from "./environment";

export default new DataSource({
  type: "postgres",
  host: "database",
  port: 5432,
  username: env.POSTGRES_USER,
  password: env.POSTGRES_PASSWORD,
  database: env.POSTGRES_DATABASE,
  synchronize: true,
  entities: [Url],
  logging: ["query", "error"],
});
