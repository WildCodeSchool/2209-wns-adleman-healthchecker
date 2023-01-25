import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { useGetUrlsQuery } from "./graphql/generated/schema";
import { ApolloProvider } from "@apollo/client";
import client from "./graphql/client";
import { useEffect } from "react";
import UrlList from "./components/UrlList";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <ApolloProvider client={client}>
      <UrlList />
      {/* <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === "Camera") {
                iconName = focused ? "camera" : "camera-outline";
              } else if (route.name === "Images") {
                iconName = focused ? "image" : "image-outline";
              } else if (route.name === "Feed") {
                iconName = focused ? "share-social" : "share-social-outline";
              }
              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: "blue",
            tabBarInactiveTintColor: "gray",
          })}
        >
          <Tab.Screen
            name="Camera"
            component={CameraScreen}
            options={{ unmountOnBlur: true }}
          />
          <Tab.Screen name="Images" component={ImageScreen} />
          <Tab.Screen name="Feed" component={FeedScreen} />
        </Tab.Navigator>
      </NavigationContainer> */}
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
