import { Button, Flex, Heading } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import { useState } from "react";
import Layout from "../components/Layout";
import PostList from "../components/PostList";
import { usePostsQuery } from "../generated/graphql";
import createUrqlClient from "../utils/createUrqlClient";

const Index = () => {
  const [variables, setVariables] = useState({
    limit: 10,
    cursor: null as string | null,
  });
  const [{ data, fetching }] = usePostsQuery({
    variables: variables,
  });

  if (!fetching && !data) {
    return (
      <div>Por algum motivo, houve uma falha ao requisitar os dados ☹️</div>
    );
  }

  return (
    <Layout>
      <Flex alignItems={"center"}>
        <Heading>LuDit</Heading>
        <NextLink href="/create-post">
          <Button
            colorScheme="teal"
            size={"sm"}
            variant={"outline"}
            ml={"auto"}
            textColor={"black"}
          >
            Criar post
          </Button>
        </NextLink>
      </Flex>
      <br />
      {!data && fetching ? (
        <div>Carregando...</div>
      ) : (
        <PostList posts={data!.posts.posts} />
      )}

      {data && data?.posts.hasMore ? (
        <Flex>
          <Button
            colorScheme="teal"
            size={"sm"}
            variant={"outline"}
            textColor={"black"}
            m={"auto"}
            my={8}
            isLoading={fetching}
            onClick={() => {
              setVariables({
                limit: variables.limit,
                cursor: data.posts.posts[data.posts.posts.length - 1].createdAt,
              });
            }}
          >
            Carregar mais...
          </Button>
        </Flex>
      ) : null}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
