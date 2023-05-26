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
        <View style={styles.columnTitle}>
          <Text style={styles.statut}>Statut</Text>
          <Text style={styles.latence}>Latence</Text>
          <Text style={styles.date}>Date</Text>
        </View>
        <FlatList
          keyExtractor={(item: any) => item.id}
          scrollEnabled={true}
          data={url.responses}
          renderItem={({ item }) => (
            <View style={styles.listElement}>
              <Text style={styles.text}>{item.response_status}</Text>
              <Text style={styles.text}>{item.latency}</Text>
              <Text style={styles.text}>{formatDate(item.created_at)} </Text>
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
    alignItems: "center",
    padding: 10,
  },
  containerList: {
    padding: 10,
    backgroundColor: "#f5ebe0",
    margin: 5,
    borderRadius: 4,
    alignItems: "center",
  },
  listElement: {
    flexDirection: "row",
    backgroundColor: "#dba39a",
    padding: 10,
    margin: 5,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "space-around",
    width: 350,
  },
  title: {
    fontSize: 15,
    textAlign: "center",
    color: "#38383f",
    fontWeight: "700",
  },
  text: {
    color: "#38383f",
    fontWeight: "600",
  },
  columnTitle: {
    flexDirection: "row",
    marginVertical: 20,
    width: 350,
  },
  statut: {
    marginLeft: 25,
    color: "#38383f",
    fontWeight: "600",
  },
  latence: {
    marginLeft: 30,
    color: "#38383f",
    fontWeight: "600",
  },
  date: {
    marginLeft: 90,
    color: "#38383f",
    fontWeight: "600",
  },
});
