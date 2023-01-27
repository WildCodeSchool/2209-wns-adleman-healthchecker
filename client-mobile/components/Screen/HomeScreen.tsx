import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Button,
  TextInput,
} from "react-native";
import { useState, useEffect } from "react";
import { Url, useGetUrlsQuery } from "../../graphql/generated/schema";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useCreateUrlMutation } from "../../graphql/generated/schema";
import { Response } from "../../graphql/generated/schema";

type RootStackParamList = {
  Home: undefined;
  Historical: { url: Url };
};

type HomeProps = NativeStackScreenProps<RootStackParamList, "Home", "Tab">;

export default function HomeScreen({ route, navigation }: HomeProps) {
  const [url, setUrl] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [isDisabled, setIsDisabled] = useState(true);
  const [response, setResponse] = useState<Response | undefined>(undefined);

  const [createUrl] = useCreateUrlMutation();

  const { data, refetch } = useGetUrlsQuery();
  const urlList = data?.getUrls;

  useEffect(() => {
    const urlPattern =
      /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/;

    const reg = new RegExp(urlPattern);
    if (url.length === 0) {
      return;
    }
    if (!reg.test(url)) {
      setIsValid(false);
      setIsDisabled(true);
    } else {
      setIsValid(true);
      setIsDisabled(false);
    }
  }, [url]);

  const navigateToHistorical = (url: Url) => {
    navigation.navigate("Historical", { url: url });
  };

  const handleChangeUrl = (url: string) => {
    setUrl(url);
    setResponse(undefined);
  };

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

  const handleValidate = async () => {
    if (isValid && !isDisabled) {
      try {
        const res = await createUrl({ variables: { url: { url } } });
        setResponse(res?.data?.createUrl?.responses[0]);
      } catch (err) {
        console.error(err);
      } finally {
        refetch();
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.containerInput}>
        <View>
          <Text>Enter URL : </Text>
          <TextInput
            style={styles.input}
            placeholder="http://toto.fr"
            onChangeText={(url) => handleChangeUrl(url)}
            value={url}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <Button
            onPress={handleValidate}
            title="Validate"
            disabled={isDisabled || !isValid}
          />
        </View>
        <View>
          <Text>
            Status: {response?.response_status && response.response_status}
          </Text>
          <Text>Latency: {response?.latency && response.latency}</Text>
          {/* <Text>Date: {response?.created_at && response.created_at}</Text> */}
        </View>
      </View>
      <View style={styles.containerList}>
        <FlatList
          keyExtractor={(item: any) => item.id}
          contentContainerStyle={{ paddingBottom: 30 }}
          // ItemSeparatorComponent={() => <View style={style.separator} />}
          // ListEmptyComponent={() => <Text>No wilders for now</Text>}
          data={urlList}
          // refreshing={loadingWilders}
          renderItem={({ item }) => (
            <View>
              <Text onPress={() => navigateToHistorical(item)}>{item.url}</Text>
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
    justifyContent: "center",
    // borderColor: "red",
    // borderWidth: 1,
  },
  containerInput: {
    backgroundColor: "#fff",
    // borderColor: "blue",
    width: 400,
    borderWidth: 1,
    flexDirection: "row",
    padding: 5,
    borderRadius: 10,
    marginTop: 15,
  },
  containerList: {
    flex: 1,
    backgroundColor: "#fff",
    // alignItems: "center",
    // justifyContent: "flex-start",
    // borderColor: "green",
    // borderWidth: 1,
    padding: 5,
    borderRadius: 10,
    marginTop: 15,
  },
  input: {
    height: 40,
    margin: 12,
    width: 200,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
  },
});
