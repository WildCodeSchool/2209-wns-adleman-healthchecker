import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageLocalDefault,
} from "apollo-server-core";
import { ApolloServer } from "apollo-server-express";
import http from "http";
import express, { Router } from "express";
import { env } from "./environment";
import { buildSchema } from "type-graphql";
import { UrlResolver } from "./resolver/UrlResolver";
import { ResponseResolver } from "./resolver/ResponseResolver";
import swaggerUi from "swagger-ui-express";
import { apiDocumentation } from "../docs/apidoc";

const start = async (): Promise<void> => {
  const router = Router();
  const app = express();
  app.use(router);

  router.post("/users");

  const httpServer = http.createServer(app);

  const schema = await buildSchema({
    resolvers: [UrlResolver, ResponseResolver],
  });

  const server = new ApolloServer({
    schema,
    csrfPrevention: true,
    cache: "bounded",
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    ],
  });

  app.use("/documentation", swaggerUi.serve, swaggerUi.setup(apiDocumentation));

  await server.start();
  httpServer.listen({ port: env.SERVER_PORT }, () =>
    console.log(`🚀 Server ready at ${env.SERVER_HOST}:${env.SERVER_PORT}`)
  );
};
console.log("hello world");
void start();
