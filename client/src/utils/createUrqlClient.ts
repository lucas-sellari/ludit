import { cacheExchange, QueryInput, Resolver } from "@urql/exchange-graphcache";
import { NextUrqlClientConfig } from "next-urql";
import Router from "next/router";
import {
  dedupExchange,
  errorExchange,
  fetchExchange,
  stringifyVariables,
} from "urql";
import {
  LoginMutation,
  LogoutMutation,
  MeDocument,
  MeQuery,
  RegisterMutation,
} from "../generated/graphql";
import { betterUpdateQuery } from "./betterUpdateQuery";

const cursorPagination = (): Resolver => {
  return (_parent, fieldArgs, cache, info) => {
    const { parentKey: entityKey, fieldName } = info;

    // isso aqui vai inspecionar tudo que tiver a palavra query (entityKey) no cache
    const allFields = cache.inspectFields(entityKey);

    // vai filtrar e deixar apenas apenas os fields em que o fieldName bater com fieldName (nesse caso, posts)
    const fieldInfos = allFields.filter((info) => info.fieldName === fieldName);

    // se não tiver dados, vai retornar undefined
    const size = fieldInfos.length;
    if (size === 0) {
      return undefined;
    }

    // checar se os dados estão no cache e retornar eles do cache, combinando todos os dados de todas as páginas
    const fieldKey = `${fieldName}(${stringifyVariables(fieldArgs)})`;

    const isInCache = cache.resolve(entityKey, fieldKey); // se não tiver mais dados no cache, precisamos buscar no server
    info.partial = !isInCache;

    let results: string[] = [];

    fieldInfos.forEach((fi) => {
      const data = cache.resolve(entityKey, fi.fieldKey) as string[];
      results.push(...data);
    });

    console.log("Results: ", results);
    return results;
  };
};

const createUrqlClient = (ssrExchange: any) => {
  return {
    url: "http://localhost:3333/graphql",
    fetchOptions: {
      credentials: "include",
    },
    exchanges: [
      dedupExchange,
      cacheExchange({
        resolvers: {
          Query: {
            posts: cursorPagination(),
          },
        },
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
