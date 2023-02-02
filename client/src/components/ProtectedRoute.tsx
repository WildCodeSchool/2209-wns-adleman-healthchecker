import { useGetProfileQuery } from "../graphql/generated/schema";
import { Navigate } from "react-router-dom";

export type ProtectedRouteProps = {
  outlet: JSX.Element;
};

export default function ProtectedRoute({ outlet }: ProtectedRouteProps) {
  const { data: currentUser } = useGetProfileQuery({
    errorPolicy: "ignore",
  });

  if (currentUser) {
    return outlet;
  } else {
    return <Navigate to={{ pathname: "/login" }} />;
  }
}
