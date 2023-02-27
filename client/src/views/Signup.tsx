import React, { useState } from "react";

import { useNavigate } from "react-router-dom";
import {
  useCreateUserMutation,
  useGetProfileQuery,
  useLoginMutation,
} from "../graphql/generated/schema";

export default function Signup() {
  const [userInfos, setUserInfo] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [passwordError, setPasswordError] = useState(false);
  const [createUser] = useCreateUserMutation();
  const navigate = useNavigate();
  const [login] = useLoginMutation();
  const { client } = useGetProfileQuery({
    errorPolicy: "ignore",
  });

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!userInfos.password.match(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/))
            return setPasswordError(true);

          createUser({ variables: { data: userInfos } })
            .then(async () => {
              await login({
                variables: {
                  data: {
                    email: userInfos.email,
                    password: userInfos.password,
                  },
                },
              });
              await client.resetStore();
              navigate("/login");
            })
            .catch((err) => {});
        }}
      >
        <label htmlFor="email">
          Email
          <input
            data-testid="signup-email"
            type="email"
            id="email"
            name="email"
            value={userInfos.email}
            onChange={(e) =>
              setUserInfo({ ...userInfos, email: e.target.value })
            }
          />
        </label>

        <label htmlFor="username">
          Username
          <input
            data-testid="signup-username"
            type="text"
            id="username"
            name="username"
            value={userInfos.username}
            onChange={(e) =>
              setUserInfo({ ...userInfos, username: e.target.value })
            }
          />
        </label>

        <label htmlFor="password">
          Password
          <input
            data-testid="signup-password"
            type="password"
            id="password"
            name="password"
            minLength={8}
            value={userInfos.password}
            onChange={(e) => {
              setUserInfo({ ...userInfos, password: e.target.value });
              setPasswordError(false);
            }}
          />
        </label>

        {passwordError && (
          <div>
            The password must contain at least 8 caracters and include an
            uppercase letter and a number
          </div>
        )}

        <button type="submit">Register</button>
      </form>
    </div>
  );
}
