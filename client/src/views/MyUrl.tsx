import { useGetProfileQuery } from "../graphql/generated/schema";

export default function MyUrl() {
  const { data: currentUser, client } = useGetProfileQuery({
    errorPolicy: "ignore",
  });

  console.log(currentUser);
  return <h1>Ma page url</h1>;
}
