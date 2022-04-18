import React from "react";
import { Form, Formik } from "formik";
import { Button } from "@chakra-ui/react";
import { useMutation } from "urql";

import Wrapper from "../components/Wrapper";
import InputField from "../components/InputField";

interface registerProps {}

const REGISTER_MUTATION = `mutation Register($username: String!, $password: String!) {
  register(options: {
    username: $username,
    password: $password
  }) {
    errors {
      field
      message
    }
    user {
      id
      username
    }
  }
}`;

export const Register: React.FC<registerProps> = ({}) => {
  const [{}, register] = useMutation(REGISTER_MUTATION);
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{
          username: "",
          password: "",
        }}
        onSubmit={(values) => {
          return register(values);
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
              Registrar
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default Register;
