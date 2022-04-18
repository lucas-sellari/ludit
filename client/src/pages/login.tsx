import React from "react";
import { Form, Formik } from "formik";
import { Button } from "@chakra-ui/react";

import Wrapper from "../components/Wrapper";
import InputField from "../components/InputField";
import { useLoginMutation } from "../generated/graphql";
import toErrorMap from "../utils/toErrorMap";
import { useRouter } from "next/router";

interface loginProps {}

export const Login: React.FC<loginProps> = ({}) => {
  const [{}, login] = useLoginMutation();
  const router = useRouter();

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{
          username: "",
          password: "",
        }}
        onSubmit={async (values, { setErrors }) => {
          const response = await login(values);

          if (response.data?.login.errors) {
            setErrors(toErrorMap(response.data.login.errors));
          } else if (response.data?.login.user) {
            //funfou, ir para a landing page
            router.push("/");
          }
        }}
      >
        {({ isSubmitting, handleChange }) => (
          <Form>
            <InputField
              name="username"
              placeholder="Nome de usuário"
              label="Nome de usuário"
              onChange={handleChange}
            />

            <InputField
              name="password"
              placeholder="Senha"
              label="Senha"
              type="password"
              onChange={handleChange}
            />

            <Button
              type="submit"
              colorScheme="teal"
              mt={4}
              isLoading={isSubmitting}
            >
              Login
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default Login;
