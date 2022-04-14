import { Entity, OptionalProps, PrimaryKey, Property } from "@mikro-orm/core";

@Entity()
export class Post {
  [OptionalProps]?: "id" | "title" | "updateAt" | "createdAt";
  //4 colunas
  @PrimaryKey()
  id!: number;

  @Property({ type: "date" })
  createdAt: Date = new Date();

  @Property({ type: "date", onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @Property({ type: "text" })
  title!: string;
}
