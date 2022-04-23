import { Box, Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import React, { useState } from "react";
import InputField from "../components/InputField";
import Wrapper from "../components/Wrapper";
import { useForgotPasswordMutation } from "../generated/graphql";
import createUrqlClient from "../utils/createUrqlClient";

const ForgotPassword: React.FC<{}> = ({}) => {
  const [{}, forgotPassword] = useForgotPasswordMutation();
  const [complete, setComplete] = useState(false);

  return (
    <Wrapper variant="regular">
      <Formik
        initialValues={{
          email: "",
        }}
        onSubmit={async (values) => {
          await forgotPassword({ email: values.email });

          setComplete(true);
        }}
      >
        {({ isSubmitting, handleChange, values }) =>
          complete ? (
            <Box>
              Se existir uma conta vinculada ao e-mail <b>{values.email}</b>, iremos
              enviar um e-mail com um link para redefinição da senha. 🤠
            </Box>
          ) : (
            <Form>
              <InputField
                name="email"
                placeholder="E-mail"
                label="E-mail"
                type="email"
                onChange={handleChange}
              />

              <Button
                type="submit"
                colorScheme="teal"
                mt={4}
                isLoading={isSubmitting}
              >
                Enviar link de recuperação
              </Button>
            </Form>
          )
        }
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(ForgotPassword);
