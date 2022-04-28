import { Box, Heading, Stack, Text } from "@chakra-ui/react";
import React from "react";

interface PostListProps {
  posts: {
    __typename?: "Post" | undefined;
    id: number;
    createdAt: string;
    updatedAt: string;
    title: string;
    textSnippet: string;
  }[];
}

const PostList: React.FC<PostListProps> = ({ posts }) => {
  return (
    <Stack spacing={8}>
      {posts.map((post) => (
        <Box key={post.id} p={5} shadow="md" borderWidth="1px" borderRadius={8}>
          <Heading fontSize={"xl"}>{post.title}</Heading>
          <Text mt={4}>{post.textSnippet}</Text>
        </Box>
      ))}
    </Stack>
  );
};

export default PostList;
