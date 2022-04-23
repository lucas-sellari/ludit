import { MikroORM, RequiredEntityData } from "@mikro-orm/core";
import {
  ApolloServerPluginLandingPageDisabled,
  ApolloServerPluginLandingPageGraphQLPlayground,
} from "apollo-server-core";
import { ApolloServer } from "apollo-server-express";
import connectRedis from "connect-redis";
import cors from "cors";
import express from "express";
import session from "express-session";
import Redis from "ioredis";
import { buildSchema } from "type-graphql";
import { COOKIE_NAME, __prod__ } from "./constants";
import config from "./mikro-orm.config";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import { MyContext } from "./types";

const main = async () => {
  const orm = await MikroORM.init(config);
  //orm.em.nativeDelete(User, {});
  await orm.getMigrator().up();

  const app = express();

  const RedisStore = connectRedis(session);
  const redis = new Redis();

  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );

  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redis,
        disableTouch: true,
      } as RequiredEntityData<typeof connectRedis>),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 anos kkk
        httpOnly: true, // cookie inacessível pelo front
        secure: __prod__, // se o cookie vai funcionar apenas em https
        sameSite: "lax", // defesa contra csrf
      },
      saveUninitialized: false,
      secret: "gotasecretcanyoukeepit",
      resave: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    plugins: [
      __prod__
        ? ApolloServerPluginLandingPageDisabled()
        : ApolloServerPluginLandingPageGraphQLPlayground(),
    ],
    context: ({ req, res }): MyContext => ({ em: orm.em, req, res, redis }),
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({
    app,
    cors: false,
  });

  app.listen(3333, () => {
    console.log("✨ server ready and listening on port 3333 ^^ ✨");
  });
};

main().catch((error) => {
  console.log("!ERRO: " + error);
});
