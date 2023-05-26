import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import Constants from "expo-constants";
const env = Constants.expoConfig?.extra || {};

export default new ApolloClient({
  cache: new InMemoryCache(),
  defaultOptions: {
    query: {
      fetchPolicy: "cache-first",
    },
  },
  link: createHttpLink({
    uri: env.GRAPHQL_API_URL as string,
    credentials: "include",
  }),
});
