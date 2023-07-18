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
  const { data: currentUser } = useGetProfileQuery({
    errorPolicy: "ignore",
  });

  if (!currentUser?.profile) {
    return <Navigate to={{ pathname: "/login" }} />;
  } else {
    return React.cloneElement(outlet, { currentUser });
  }
}
