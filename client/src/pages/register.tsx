import React from "react";
import { Form, Formik } from "formik";
import { Button } from "@chakra-ui/react";

import Wrapper from "../components/Wrapper";
import InputField from "../components/InputField";

interface registerProps {}

export const Register: React.FC<registerProps> = ({}) => {
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{
          username: "",
          password: "",
        }}
        onSubmit={(values) => {
          console.log(values);
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
