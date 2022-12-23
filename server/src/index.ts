import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageLocalDefault,
} from "apollo-server-core";
import { ApolloServer } from "apollo-server-express";
import http from "http";
import express from "express";
import { env } from "./environment";
import datasource from "./database";
import { buildSchema } from "type-graphql";
import { UrlResolver } from "./resolver/UrlResolver";
import { ResponseResolver } from "./resolver/ResponseResolver";
import cors from "cors";

const start = async (): Promise<void> => {
  await datasource.initialize();

  const app = express();
  const httpServer = http.createServer(app);
  const allowedOrigins = env.CORS_ALLOWED_ORIGINS.split(",");

  app.use(
    cors({
      credentials: true,
      origin: (origin, callback) => {
        if (typeof origin === "undefined" || allowedOrigins.includes(origin))
          return callback(null, true);
        callback(new Error("Not allowed by CORS"));
      },
    })
  );

  const corsOptions = { credentials: true, origin: true };
  app.use(cors(corsOptions));

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

  await server.start();

  server.applyMiddleware({ app, cors: false, path: "/" });
  httpServer.listen({ port: env.SERVER_PORT }, () =>
    console.log(`🚀 Server ready at ${env.SERVER_HOST}:${env.SERVER_PORT}`)
  );
};

void start();
