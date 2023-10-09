import * as dotenv from "dotenv";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express from "express";
import { createServer } from "http";
import cors, { CorsOptions } from "cors";
import { json } from "body-parser";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { PrismaClient } from "@prisma/client";
import typeDefs from "./graphql/typeDefs";
import resolvers from "./graphql/resolvers";

import { IGraphQLContext } from "./utils/types/context.types";
import cookieParser from "cookie-parser";
import getSession from "./utils/helper/getSession";

const main = async () => {
  dotenv.config();
  const app = express();
  const httpServer = createServer(app);

  const schema = makeExecutableSchema({ typeDefs, resolvers });

  const server = new ApolloServer({
    schema,
    csrfPrevention: true,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  const corsOptions: CorsOptions = {
    origin: process.env.BASE_URL,
    credentials: true,
  };

  const prisma = new PrismaClient();

  app.use(
    "/graphql",
    cors<cors.CorsRequest>(corsOptions),
    cookieParser(),
    json(),
    expressMiddleware(server, {
      context: async ({ req }): Promise<IGraphQLContext> => {
        let token = req.cookies["next-auth.session-token"];
        let session = await getSession(token);
        return { session, prisma };
      },
    }),
  );

  const PORT: number = +(process.env.PORT || 8080);

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: PORT }, resolve),
  );
  console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
};

main().catch((err) => console.log("hi hello", err));
