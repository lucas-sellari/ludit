import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import { MikroORM } from "@mikro-orm/core";
import path from "path";

export default {
  entities: [Post],
  migrations: {
    path: path.join(__dirname, "./migrations"),
    glob: "!(*.d).{js,ts}",
  },
  dbName: "ludit",
  port: 5100,
  user: "postgres",
  password: "essasenha123",
  type: "postgresql",
  debug: !__prod__,
  allowGlobalContext: true,
} as Parameters<typeof MikroORM.init>[0];
