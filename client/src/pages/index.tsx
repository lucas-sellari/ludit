import { Link } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import Layout from "../components/Layout";
import { usePostsQuery } from "../generated/graphql";
import createUrqlClient from "../utils/createUrqlClient";
import NextLink from "next/link";

const Index = () => {
  const [{ data }] = usePostsQuery({
    variables: {
      limit: 10,
    },
  });

  return (
    <Layout>
      <NextLink href="/create-post">
        <Link color={"black"}>Escrever publicação</Link>
      </NextLink>
      <h1>Hello, world!</h1>
      <br />
      {!data ? (
        <div>Carregando...</div>
      ) : (
        data.posts.map((post) => <div key={post.id}>{post.title}</div>)
      )}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
