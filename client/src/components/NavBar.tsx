import { Box, Button, Flex, Link } from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const [{ data, fetching }] = useMeQuery();
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();

  let body;

  // carregando dados
  if (fetching) {
    body = null;
    // usuario não logado
  } else if (!data?.me) {
    body = (
      <>
        <NextLink href="/login">
          <Link color={"white"} mr={4}>
            Login
          </Link>
        </NextLink>
        <NextLink href="/register">
          <Link color={"white"} mr={4}>
            Register
          </Link>
        </NextLink>
      </>
    );
    // usuário logado
  } else {
    body = (
      <Flex>
        <Box color={"white"} mr={4}>
          {data.me.username}
        </Box>
        <Button
          variant={"link"}
          color={"white"}
          mr={4}
          onClick={() => logout()}
          isLoading={logoutFetching}
        >
          Logout
        </Button>
      </Flex>
    );
  }

  return (
    <Flex bg="tomato" p={4}>
      <Box ml={"auto"}>{body}</Box>
    </Flex>
  );
};
