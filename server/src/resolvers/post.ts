import { MyContext } from "src/types";
import {
  Arg,
  Ctx,
  Field,
  FieldResolver,
  InputType,
  Int,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from "type-graphql";
import { AppDataSource } from "../createDataSource";
import { Post } from "../entities/Post";
import isAuth from "../middleware/isAuth";

@InputType()
class PostInput {
  @Field(() => String)
  title: string;

  @Field(() => String)
  text: string;
}

@Resolver(Post)
export class PostResolver {
  @Query(() => [Post])
  async posts(
    @Arg("limit", () => Int) limit: number,
    @Arg("cursor", () => String, { nullable: true }) cursor: string | null
  ): Promise<Post[]> {
    const realLimit = Math.min(50, limit);

    const queryBuilder = AppDataSource.getRepository(Post)
      .createQueryBuilder("posts")
      .orderBy('"createdAt"', "DESC")
      .take(realLimit);

    if (cursor) {
      queryBuilder.where('"createdAt" < :cursor', {
        cursor: new Date(Number.parseInt(cursor)),
      });
    }

    return await queryBuilder.getMany();
  }

  @Query(() => Post, { nullable: true })
  async post(@Arg("id", () => Int) id: number): Promise<Post | null> {
    return await Post.findOne({ where: { id } });
  }

  @Mutation(() => Post)
  @UseMiddleware(isAuth)
  async createPost(
    @Arg("options", () => PostInput) options: PostInput,
    @Ctx() { req }: MyContext
  ): Promise<Post> {
    return await Post.create({
      ...options,
      creatorId: req.session.userId,
    }).save();
  }

  @Mutation(() => Post, { nullable: true })
  async updatePost(
    @Arg("id", () => Int) id: number,
    @Arg("title", () => String, { nullable: true }) title: string
  ): Promise<Post | null> {
    const post = await Post.findOne({ where: { id } });

    if (!post) {
      return null;
    }
    if (typeof title !== "undefined") {
      post.title = title;
      await Post.update({ id }, { title });
    }
    return post;
  }

  @Mutation(() => Boolean)
  async deletePost(@Arg("id", () => Int) id: number): Promise<boolean> {
    try {
      await Post.delete({ id });
      return true;
    } catch {
      return false;
    }
  }

  @FieldResolver(() => String)
  textSnippet(@Root() root: Post) {
    return `${root.text.slice(0, 100)}...`;
  }
}
