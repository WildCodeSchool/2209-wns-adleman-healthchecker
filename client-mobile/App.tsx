import { StyleSheet, Text, View } from "react-native";
import { ApolloProvider } from "@apollo/client";
import client from "./graphql/client";
import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "./components/Screen/HomeScreen";
import HistoricalScreen from "./components/Screen/HistoricalScreen";
import { Url } from "./graphql/generated/schema";

import { createStackNavigator } from "@react-navigation/stack";

type RootStackParamList = {
  Home: undefined;
  Historical: { url: Url };
};

const Tab = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <ApolloProvider client={client}>
        <Tab.Navigator initialRouteName="Home">
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Historical" component={HistoricalScreen} />
        </Tab.Navigator>
      </ApolloProvider>
    </NavigationContainer>
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
