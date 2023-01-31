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
import cors from "cors";
import cookieParser from "cookie-parser";
import { sendNewRequestToAllUrls } from "./services/cronService";
import jwt from "jsonwebtoken";

import User from "./entity/User";
import { UserResolver } from "./resolver/UserResolver";

export interface ContextType {
  req: express.Request;
  res: express.Response;
  currentUser?: User;
  jwtPayload?: jwt.JwtPayload;
}

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

  app.use(cookieParser());
  const schema = await buildSchema({
    resolvers: [UrlResolver, UserResolver],
    authChecker: async ({ context }: { context: ContextType }, roles) => {
      const tokenInHeaders = context.req.headers.authorization?.split(" ")[1];
      const tokenInCookie = context.req.cookies?.token;
      const token = tokenInHeaders ?? tokenInCookie;

      console.log({ tokenInCookie, tokenInHeaders });

      try {
        let decoded;
        // https://www.npmjs.com/package/jsonwebtoken#jwtverifytoken-secretorpublickey-options-callback
        if (typeof token !== "undefined")
          decoded = jwt.verify(token, env.JWT_PRIVATE_KEY);
        if (typeof decoded === "object") context.jwtPayload = decoded;
      } catch (err) {}

      let user = null;
      if (
        context.jwtPayload !== null &&
        typeof context.jwtPayload !== "undefined"
      )
        user = await datasource
          .getRepository(User)
          .findOne({ where: { id: context.jwtPayload.userId } });

      if (user === null) return false;

      context.currentUser = user;
      return roles.length === 0 || roles.includes(user.role);
    },
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

  setInterval(sendNewRequestToAllUrls, 3600000);
};

void start();
