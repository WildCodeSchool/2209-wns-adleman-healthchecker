import { StyleSheet, Text, View, FlatList, ScrollView } from "react-native";
import { Url } from "../../graphql/generated/schema";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
type UrlWithoutUser = Omit<Url, "userToUrls">;

type RootStackParamList = {
  Home: undefined;
  Historical: { url: UrlWithoutUser };
};

type HistoricalProps = NativeStackScreenProps<
  RootStackParamList,
  "Historical",
  "Tab"
>;

export default function HistoricalScreen({ route }: HistoricalProps) {
  const { url } = route.params;

  const formatDate = (newDate: string) => {
    var date = new Date(newDate);
    var dateStr =
      ("00" + (date.getMonth() + 1)).slice(-2) +
      "/" +
      ("00" + date.getDate()).slice(-2) +
      "/" +
      date.getFullYear() +
      " " +
      ("00" + date.getHours()).slice(-2) +
      ":" +
      ("00" + date.getMinutes()).slice(-2) +
      ":" +
      ("00" + date.getSeconds()).slice(-2);

    return dateStr;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{url.url}</Text>
      <View style={styles.containerList}>
        <FlatList
          keyExtractor={(item: any) => item.id}
          // contentContainerStyle={{ paddingBottom: 30 }}
          // ItemSeparatorComponent={() => <View style={style.separator} />}
          // ListEmptyComponent={() => <Text>No wilders for now</Text>}
          scrollEnabled={true}
          data={url.responses}
          // refreshing={loadingWilders}
          renderItem={({ item }) => (
            <View style={styles.listElement}>
              <Text>{formatDate(item.created_at)} </Text>
              <Text>Status : {item.response_status}</Text>
              <Text>Latency : {item.latency}</Text>
            </View>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // alignItems: "center",
    padding: 10,
    justifyContent: "space-between",
  },
  containerList: {
    // backgroundColor: "#fff",
    // // alignItems: "center",
    // flex: 2,
    alignSelf: "flex-start",
    justifyContent: "space-between",
    padding: 10,
  },
  listElement: {
    // flex: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    // alignContent: "flex-start",
  },
  title: {
    fontSize: 15,
    textAlign: "center",
  },
});
