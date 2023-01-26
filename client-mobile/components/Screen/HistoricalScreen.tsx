import { StyleSheet, Text, View, FlatList } from "react-native";
import { Url } from "../../graphql/generated/schema";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

type RootStackParamList = {
  Home: undefined;
  Historical: { url: Url };
};

type HistoricalProps = NativeStackScreenProps<
  RootStackParamList,
  "Historical",
  "Tab"
>;

export default function HistoricalScreen({ route }: HistoricalProps) {
  const { url } = route.params;

  return (
    <View style={styles.container}>
      <FlatList
        keyExtractor={(item: any) => item.id}
        contentContainerStyle={{ paddingBottom: 30 }}
        // ItemSeparatorComponent={() => <View style={style.separator} />}
        // ListEmptyComponent={() => <Text>No wilders for now</Text>}
        data={url.responses}
        // refreshing={loadingWilders}
        renderItem={({ item }) => (
          <View style={styles.container}>
            <Text>Status : {item.response_status}</Text>
            <Text>Latency : {item.latency}</Text>
            <Text>Date : {item.created_at}</Text>
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
