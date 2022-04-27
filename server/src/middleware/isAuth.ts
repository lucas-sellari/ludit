import { MyContext } from "src/types";
import { MiddlewareFn } from "type-graphql";

const isAuth: MiddlewareFn<MyContext> = ({ context }, next) => {
  if (!context.req.session.userId) {
    throw new Error("You are not logged in! 😵");
  }

  return next();
};

export default isAuth;
