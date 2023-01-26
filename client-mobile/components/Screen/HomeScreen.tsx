import { StyleSheet, Text, View, FlatList, Button } from "react-native";
import { Url, useGetUrlsQuery } from "../../graphql/generated/schema";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

type RootStackParamList = {
  Home: undefined;
  Historical: { url: Url };
};

type HomeProps = NativeStackScreenProps<RootStackParamList, "Home", "Tab">;

export default function HomeScreen({ route, navigation }: HomeProps) {
  const { data, refetch } = useGetUrlsQuery();
  const urlList = data?.getUrls;

  const navigateToHistorical = (url: Url) => {
    navigation.navigate("Historical", { url: url });
  };

  return (
    <View style={styles.container}>
      <FlatList
        keyExtractor={(item: any) => item.id}
        contentContainerStyle={{ paddingBottom: 30 }}
        // ItemSeparatorComponent={() => <View style={style.separator} />}
        // ListEmptyComponent={() => <Text>No wilders for now</Text>}
        data={urlList}
        // refreshing={loadingWilders}
        renderItem={({ item }) => (
          <View style={styles.container}>
            <Text onPress={() => navigateToHistorical(item)}>{item.url}</Text>
          </View>
        )}
      />
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
