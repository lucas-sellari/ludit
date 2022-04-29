import { DataSourceOptions } from "typeorm";
import { Post } from "./entities/Post";
import { User } from "./entities/User";
import path from "path";

export default {
  type: "postgres",
  host: "localhost",
  port: 5100,
  username: "postgres",
  password: "essasenha123",
  database: "ludit2",
  entities: [Post, User],
  logging: true,
  synchronize: true, //não precisa ficar criando migrations na mão :D
  migrations: [path.join(__dirname, "./migrations/*.ts")],
} as unknown as DataSourceOptions;
