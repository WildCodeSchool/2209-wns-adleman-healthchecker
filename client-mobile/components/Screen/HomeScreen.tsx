import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Button,
  TextInput,
  Pressable,
} from "react-native";
import { useState, useEffect } from "react";
import { Url, useGetUrlsQuery } from "../../graphql/generated/schema";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useCreateUrlMutation } from "../../graphql/generated/schema";
import { Response } from "../../graphql/generated/schema";
type UrlWithoutUser = Omit<Url, "userToUrls">;
type RootStackParamList = {
  Home: undefined;
  Historical: { url: UrlWithoutUser };
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

  const navigateToHistorical = (url: UrlWithoutUser) => {
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
          <Text style={styles.label}>Ici, entrer votre URL : </Text>
          <TextInput
            style={styles.input}
            placeholder="http://toto.fr"
            onChangeText={(url) => handleChangeUrl(url)}
            value={url}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <Pressable
            onPress={handleValidate}
            disabled={isDisabled || !isValid}
            style={styles.button}
          >
            <Text style={styles.buttontext}>Rechercher</Text>
          </Pressable>
        </View>
        <View style={styles.response}>
          <Text style={styles.text}>
            Status: {response?.response_status && response.response_status}
          </Text>
          <Text style={styles.text}>
            Latency: {response?.latency && response.latency}
          </Text>
        </View>
      </View>
      <View style={styles.containerList}>
        <FlatList
          keyExtractor={(item: any) => item.id}
          contentContainerStyle={{ paddingBottom: 30 }}
          data={urlList}
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <Text
                style={styles.text}
                onPress={() => navigateToHistorical(item)}
              >
                {item.url}
              </Text>
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
  },
  containerInput: {
    backgroundColor: "#f5ebe0",
    width: 400,
    flexDirection: "row",
    padding: 15,
    borderRadius: 10,
    marginTop: 15,
  },
  containerList: {
    flex: 1,
    backgroundColor: "#f5ebe0",
    padding: 5,
    borderRadius: 10,
    marginTop: 15,
    width: 400,
  },
  input: {
    backgroundColor: "#fff",
    height: 40,
    margin: 12,
    width: 200,
    padding: 10,
    borderRadius: 10,
    color: "#38383f",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "#dba39a",
  },
  buttontext: {
    fontSize: 16,
    lineHeight: 30,
    fontWeight: "600",
    letterSpacing: 0.25,
    color: "white",
  },
  response: {
    width: 140,
    backgroundColor: "#dba39a",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    marginLeft: 10,
  },
  text: {
    color: "#38383f",
    fontWeight: "600",
  },
  label: {
    color: "#38383f",
    fontWeight: "600",
    marginLeft: 50,
  },
  listItem: {
    backgroundColor: "#dba39a",
    padding: 10,
    margin: 5,
    borderRadius: 4,
    alignItems: "center",
  },
});
