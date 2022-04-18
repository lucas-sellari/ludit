import React from "react";
import { Form, Formik } from "formik";
import { Button } from "@chakra-ui/react";

import Wrapper from "../components/Wrapper";
import InputField from "../components/InputField";
import { useRegisterMutation } from "../generated/graphql";
import toErrorMap from "../utils/toErrorMap";
import { useRouter } from "next/router";

interface registerProps {}

export const Register: React.FC<registerProps> = ({}) => {
  const [{}, register] = useRegisterMutation();
  const router = useRouter();
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{
          username: "",
          password: "",
        }}
        onSubmit={async (values, { setErrors }) => {
          const response = await register(values);

          if (response.data?.register.errors) {
            setErrors(toErrorMap(response.data?.register.errors));
          } else if (response.data?.register.user) {
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
              Registrar
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default Register;
