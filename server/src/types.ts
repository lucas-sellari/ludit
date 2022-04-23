import { Connection, EntityManager, IDatabaseDriver } from "@mikro-orm/core";
import * as express from "express";
import session from "express-session";
import Redis from "ioredis";

export type MyContext = {
  em: EntityManager<IDatabaseDriver<Connection>>;
  req: express.Request & { session?: session.Session & { userId?: number } }; // join de types
  res: express.Response;
  redis: Redis;
};
