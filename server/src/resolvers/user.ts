import { RequiredEntityData } from "@mikro-orm/core";
import { User } from "../entities/User";
import { MyContext } from "src/types";
import {
  Field,
  InputType,
  Mutation,
  Resolver,
  Arg,
  Ctx,
  ObjectType,
  Query,
} from "type-graphql";
import argon2 from "argon2";
//import { EntityManager } from "@mikro-orm/postgresql";

@InputType()
class UsernamePasswordInput {
  @Field(() => String)
  username: string;

  @Field(() => String)
  password: string;
}

@ObjectType()
class FieldError {
  @Field(() => String)
  field: string;

  @Field(() => String)
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  @Query(() => User, { nullable: true })
  async me(@Ctx() { em, req }: MyContext): Promise<User | null> {
    if (!req.session.userId) {
      return null;
    }

    // se tem um cookie, está logado
    const user = await em.findOne(User, { id: req.session.userId });

    return user;
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("options", () => UsernamePasswordInput) options: UsernamePasswordInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    if (options.username.length <= 2) {
      return {
        errors: [
          {
            field: "username",
            message: "length must be greater than 2",
          },
        ],
      };
    }

    if (options.password.length <= 3) {
      return {
        errors: [
          {
            field: "password",
            message: "length must be greater than 3",
          },
        ],
      };
    }

    const hashedPassword = await argon2.hash(options.password);

    const user = em.create(User, {
      username: options.username,
      password: hashedPassword,
    } as RequiredEntityData<User>);
    //let user;
    try {
      //antigamente dava problema, então usávamos isso aqui comentado com a queryBuilder
      //const result = await (em as EntityManager)
      //  .createQueryBuilder(User)
      //  .getKnexQuery()
      //  .insert({
      //    username: options.username,
      //    password: hashedPassword,
      //    created_at: new Date(),
      //    updated_at: new Date(),
      //  })
      //  .returning("*");
      //user = result[0];

      await em.persistAndFlush(user);
    } catch (error) {
      if (error.code === "23505") {
        //erro: nome de usuário já existente
        return {
          errors: [
            {
              field: "username",
              message: "username already taken",
            },
          ],
        };
      }
      console.log("!ERRO: " + error.message);
    }

    // login automático do usuário (vai guardar o id do user no cookie)
    req.session.userId = user.id;

    return {
      user,
    };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("options", () => UsernamePasswordInput) options: UsernamePasswordInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    const user = await em.findOne(User, { username: options.username });

    if (!user) {
      return {
        errors: [
          {
            field: "username",
            message: "that username does not exist",
          },
        ],
      };
    }
    const valid = await argon2.verify(user.password, options.password);

    if (!valid) {
      return {
        errors: [
          {
            field: "password",
            message: "incorrect password",
          },
        ],
      };
    }

    req.session.userId = user.id;

    return {
      user,
    };
  }
}
