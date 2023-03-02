import { useState } from "react";
import {
  useGetProfileQuery,
  useLoginMutation,
  // useLogoutMutation,
} from "../graphql/generated/schema";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [login] = useLoginMutation();

  const { data: currentUser, client } = useGetProfileQuery({
    errorPolicy: "ignore",
  });

  // const [logout] = useLogoutMutation();
  const navigate = useNavigate();

  return (
    <div>
      {currentUser ? (
        <div>
          <div
          // data-testid="logged-in-message"
          >
            Logged in as {currentUser.profile.username}
          </div>
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            login({ variables: { data: credentials } })
              .then(async () => {
                await client.resetStore();
                navigate("/myurl");
              })
              .catch((err) => {
                // setTimeout
                setError("Identifiants incorrect");
                setTimeout(() => {
                  setError("");
                }, 5000);
              });
          }}
        >
          <label htmlFor="email">
            Email
            <input
              // data-testid="login-email"
              type="email"
              id="email"
              name="email"
              value={credentials.email}
              onChange={(e) =>
                setCredentials({ ...credentials, email: e.target.value })
              }
            />
          </label>

          <label htmlFor="password">
            Password
            <input
              // data-testid="login-password"
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={(e) =>
                setCredentials({ ...credentials, password: e.target.value })
              }
            />
          </label>
          <span>{error && error}</span>
          <button type="submit" className="button">
            Login
          </button>
        </form>
      )}
    </div>
  );
}
