import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";

export default new ApolloClient({
  cache: new InMemoryCache(),
  defaultOptions: {
    query: {
      fetchPolicy: "cache-first",
    },
  },
  link: createHttpLink({
    uri: process.env.REACT_APP_GRAPHQL_API_URL,
    credentials: "include",
  }),
});
