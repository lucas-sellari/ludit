import { Post } from "../entities/Post";
import { Arg, Int, Mutation, Query, Resolver } from "type-graphql";

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  async posts(): Promise<Post[]> {
    return await Post.find();
  }

  @Query(() => Post, { nullable: true })
  async post(@Arg("id", () => Int) id: number): Promise<Post | null> {
    return await Post.findOne({ where: { id } });
  }

  @Mutation(() => Post)
  async createPost(@Arg("title", () => String) title: string): Promise<Post> {
    return await Post.create({ title }).save();
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
}
