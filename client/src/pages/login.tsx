import { Flex, Link } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React from "react";
import InputField from "../components/InputField";
import StyledButton from "../components/StyledButton";
import Wrapper from "../components/Wrapper";
import { useLoginMutation } from "../generated/graphql";
import createUrqlClient from "../utils/createUrqlClient";
import toErrorMap from "../utils/toErrorMap";

interface loginProps {}

const Login: React.FC<loginProps> = ({}) => {
  const [{}, login] = useLoginMutation();
  const router = useRouter();

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{
          usernameOrEmail: "",
          password: "",
        }}
        onSubmit={async (values, { setErrors }) => {
          const response = await login(values);

          if (response.data?.login.errors) {
            setErrors(toErrorMap(response.data.login.errors));
          } else if (response.data?.login.user) {
            if (typeof router.query.next === "string") {
              router.push(router.query.next);
            } else {
              router.push("/");
            }
          }
        }}
      >
        {({ isSubmitting, handleChange }) => (
          <Form>
            <InputField
              name="usernameOrEmail"
              placeholder="Nome de usuário ou e-mail"
              label="Nome de usuário ou e-mail"
              onChange={handleChange}
            />

            <InputField
              name="password"
              placeholder="Senha"
              label="Senha"
              type="password"
              onChange={handleChange}
            />

            <StyledButton isLoading={isSubmitting}>Login</StyledButton>

            <Flex>
              <NextLink href="/forgot-password">
                <Link ml="auto">Esqueceu a senha?</Link>
              </NextLink>
            </Flex>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(Login); //sem ssr, já que é página estática
