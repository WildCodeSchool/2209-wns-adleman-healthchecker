import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { useGetUrlsQuery } from "../graphql/generated/schema";

export default function UrlList() {
  const { data, refetch } = useGetUrlsQuery();
  const urlList = data?.getUrls;

  console.log(data);

  return (
    <View style={styles.container}>
      <Text></Text>
      <Text></Text>
      <StatusBar style="auto" />
    </View>
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
