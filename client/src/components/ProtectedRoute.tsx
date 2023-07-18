import { useGetProfileQuery } from "../graphql/generated/schema";
import { Navigate } from "react-router-dom";
import React from "react";

interface IProfileProps {
  currentUser: {
    profile: {
      id: number;
      username: string;
      email: string;
      last_connection: Date;
    };
  };
}

export type ProtectedRouteProps = {
  outlet: React.ReactElement<IProfileProps>;
};

export default function ProtectedRoute({ outlet }: ProtectedRouteProps) {
  const { data: currentUser, loading } = useGetProfileQuery({
    errorPolicy: "ignore",
  });

  return loading ? (
    <h1>Loading ..</h1>
  ) : !currentUser?.profile ? (
    <Navigate to={{ pathname: "/login" }} />
  ) : (
    React.cloneElement(outlet, { currentUser })
  );
}
