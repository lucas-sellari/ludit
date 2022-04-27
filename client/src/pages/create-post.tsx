import { Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import InputField from "../components/InputField";
import Layout from "../components/Layout";
import { useCreatePostMutation } from "../generated/graphql";
import createUrqlClient from "../utils/createUrqlClient";
import useIsAuth from "../utils/useIsAuth";

const CreatePost: React.FC<{}> = ({}) => {
  const [{}, createPost] = useCreatePostMutation();
  const router = useRouter();

  useIsAuth();

  return (
    <Layout variant="regular">
      <Formik
        initialValues={{
          title: "",
          text: "",
        }}
        onSubmit={async (values, { setErrors }) => {
          const { error } = await createPost({ options: values });

          if (!error) {
            router.push("/");
          }
        }}
      >
        {({ isSubmitting, handleChange }) => (
          <Form>
            <InputField
              name="title"
              placeholder="Insira aqui o título do post"
              label="Título"
              onChange={handleChange}
            />

            <InputField
              name="text"
              placeholder="Insira aqui o corpo do post"
              label="Texto"
              textarea={true}
              onChange={handleChange}
            />

            <Button
              type="submit"
              colorScheme="teal"
              mt={4}
              isLoading={isSubmitting}
            >
              Publicar
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(CreatePost);
