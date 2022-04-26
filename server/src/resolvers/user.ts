import argon2 from "argon2";
import { MyContext } from "src/types";
import {
  Arg,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { v4 } from "uuid";
import { COOKIE_NAME, FORGET_PASSWORD_PREFIX } from "../constants";
import { User } from "../entities/User";
import sendEmail from "../utils/sendEmail";
import validateRegister from "../utils/validateRegister";
import { UsernamePasswordInput } from "./UsernamePasswordInput";

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
  async me(@Ctx() { req }: MyContext): Promise<User | null> {
    if (!req.session.userId) {
      return null;
    }
    // se tem um cookie, está logado
    return await User.findOne({ where: { id: req.session.userId } });
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("options", () => UsernamePasswordInput) options: UsernamePasswordInput,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const errors = validateRegister(options);

    if (errors) {
      return { errors };
    }

    const user = User.create({
      username: options.username,
      email: options.email,
      password: await argon2.hash(options.password),
    });

    try {
      await user.save();
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

    req.session.userId = user.id;

    return {
      user,
    };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("usernameOrEmail", () => String) usernameOrEmail: string,
    @Arg("password", () => String) password: string,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const user = await User.findOne({
      where: usernameOrEmail.includes("@")
        ? { email: usernameOrEmail }
        : { username: usernameOrEmail },
    });

    if (!user) {
      return {
        errors: [
          {
            field: "usernameOrEmail",
            message: "incorrect password or email",
          },
        ],
      };
    }
    const valid = await argon2.verify(user.password, password);

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

  @Mutation(() => Boolean)
  async logout(@Ctx() { req, res }: MyContext): Promise<Boolean> {
    // remover a session do Redis
    return new Promise((resolve) =>
      req.session.destroy((error) => {
        res.clearCookie(COOKIE_NAME); // apagar o cookie, mesmo que não consigamos remover a session do Redis
        if (error) {
          console.log(error);
          resolve(false);
          return;
        }
        resolve(true);
      })
    );
  }

  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg("email", () => String) email: string,
    @Ctx() { redis }: MyContext
  ): Promise<Boolean> {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      // o email não existe no BD
      return true;
    }

    const token = v4();

    await redis.set(FORGET_PASSWORD_PREFIX + token, user.id);
    await redis.expire(FORGET_PASSWORD_PREFIX + token, 60 * 60 * 24 * 3); // expira em 3 dias

    await sendEmail(
      email,
      `<a href='http://localhost:3000/change-password/${token}'>Clique aqui para redefinir a senha</a>`
    );

    return true;
  }

  @Mutation(() => UserResponse)
  async changePassword(
    @Arg("token", () => String) token: string,
    @Arg("newPassword", () => String) newPassword: string,
    @Ctx() { redis, req }: MyContext
  ): Promise<UserResponse> {
    if (newPassword.length <= 3) {
      return {
        errors: [
          {
            field: "newPassword",
            message: "length must be greater than 3",
          },
        ],
      };
    }

    const key = FORGET_PASSWORD_PREFIX + token;
    const userId = await redis.get(key);

    if (!userId) {
      return {
        errors: [
          {
            field: "token",
            message: "the token is invalid or has expired",
          },
        ],
      };
    }

    const userIdParsed = Number.parseInt(userId);

    const user = await User.findOne({ where: { id: userIdParsed } });

    if (!user) {
      return {
        errors: [
          {
            field: "token",
            message: "the user associated to the token no longer exists",
          },
        ],
      };
    }

    await User.update(
      { id: userIdParsed },
      { password: await argon2.hash(newPassword) }
    );
    await redis.del(key);

    req.session.userId = user.id;

    return { user };
  }
}
