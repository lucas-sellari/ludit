import { Button, Flex, Heading } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import Layout from "../components/Layout";
import PostList from "../components/PostList";
import { usePostsQuery } from "../generated/graphql";
import createUrqlClient from "../utils/createUrqlClient";

const Index = () => {
  const [{ data, fetching }] = usePostsQuery({
    variables: {
      limit: 10,
    },
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
        <PostList posts={data!.posts} />
      )}

      {data ? (
        <Flex>
          <Button
            colorScheme="teal"
            size={"sm"}
            variant={"outline"}
            textColor={"black"}
            m={"auto"}
            my={8}
            isLoading={fetching}
          >
            Carregar mais...
          </Button>
        </Flex>
      ) : null}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
