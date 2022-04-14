import { MikroORM, RequiredEntityData } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import config from "./mikro-orm.config";

const main = async () => {
  const orm = await MikroORM.init(config);

  await orm.getMigrator().up();

  // Acessar todos os dados da tabela post ^^
  //const post = await orm.em.find(Post, {});
  //console.log(post);
  
  //const post = orm.em.create(Post, {
  //  id: 2,
  //  title: "my second post",
  //} as RequiredEntityData<Post>);

  //await orm.em.persistAndFlush(post);
};

main().catch(error => {
  console.log("ERRO: " + error);
});
