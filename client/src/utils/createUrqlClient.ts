import { cacheExchange, QueryInput } from "@urql/exchange-graphcache";
import { NextUrqlClientConfig } from "next-urql";
import Router from "next/router";
import { dedupExchange, errorExchange, fetchExchange } from "urql";
import {
  LoginMutation,
  LogoutMutation,
  MeDocument,
  MeQuery,
  RegisterMutation,
} from "../generated/graphql";
import { betterUpdateQuery } from "./betterUpdateQuery";

const createUrqlClient = (ssrExchange: any) => {
  return {
    url: "http://localhost:3333/graphql",
    fetchOptions: {
      credentials: "include",
    },
    exchanges: [
      dedupExchange,
      cacheExchange({
        updates: {
          Mutation: {
            logout: (_result, args, cache, info) => {
              betterUpdateQuery<LogoutMutation, MeQuery>(
                cache,
                {
                  query: MeDocument,
                } as unknown as QueryInput,
                _result,
                () => ({
                  me: null,
                })
              );
            },

            login: (_result, args, cache, info) => {
              betterUpdateQuery<LoginMutation, MeQuery>(
                cache,
                {
                  query: MeDocument,
                } as unknown as QueryInput,
                _result,
                (result, query) => {
                  if (result.login.errors) {
                    return query;
                  } else {
                    return {
                      me: result.login.user,
                    };
                  }
                }
              );
            },

            register: (_result, args, cache, info) => {
              betterUpdateQuery<RegisterMutation, MeQuery>(
                cache,
                {
                  query: MeDocument,
                } as unknown as QueryInput,
                _result,
                (result, query) => {
                  if (result.register.errors) {
                    return query;
                  } else {
                    return {
                      me: result.register.user,
                    };
                  }
                }
              );
            },
          },
        },
      }),
      errorExchange({
        onError(error) {
          if (error.message.includes("not logged in")) {
            Router.replace("/login");
          }
        },
      }),
      ssrExchange,
      fetchExchange,
    ],
  } as unknown as NextUrqlClientConfig & { url: string };
};

export default createUrqlClient;
