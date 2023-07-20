import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  useGetProfileQuery,
  useLogoutMutation,
} from "../graphql/generated/schema";

export default function Header() {
  const { data: currentUser, client } = useGetProfileQuery({
    errorPolicy: "ignore",
  });

  const location = useLocation();

  const [logout] = useLogoutMutation();

  return (
    <header>
      <nav className="container">
        <ul className="navbarList">
          <li
            data-testid="accueil"
            className={`firstNav ${
              location.pathname === "/" ||
              (location.pathname.includes("/history") && !currentUser)
                ? "active"
                : ""
            }`}
          >
            <Link to="/">Home</Link>
          </li>
          {currentUser ? (
            <>
              <li
                className={`secondNav ${
                  location.pathname === "/myurl" ||
                  (location.pathname.includes("/history") && currentUser)
                    ? "active"
                    : ""
                }`}
              >
                <Link to="/myurl">My URLs</Link>
              </li>
              <li
                className="thirdNav"
                onClick={async () => {
                  await logout();
                  await client.resetStore();
                }}
              >
                Logout
              </li>
            </>
          ) : (
            <>
              <li
                className={`fourNav ${
                  location.pathname === "/login" ||
                  location.pathname === "/register"
                    ? "active"
                    : ""
                }`}
              >
                <Link to="/login">Login</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}
