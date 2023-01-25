import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { useGetUrlsQuery } from "./graphql/generated/schema";
import { ApolloProvider } from "@apollo/client";
import client from "./graphql/client";
import { useEffect } from "react";
import UrlList from "./components/UrlList";

export default function App() {
  return (
    <ApolloProvider client={client}>
      <UrlList />
    </ApolloProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
