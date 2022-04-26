import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
} from "typeorm";
import { Field, Int, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => String)
  @Column({ type: "text", unique: true })
  username!: string;

  @Field(() => String)
  @Column({ type: "text", unique: true })
  email!: string;

  @Column({ type: "text" })
  password!: string;
}
