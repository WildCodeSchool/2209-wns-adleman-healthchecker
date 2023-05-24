import { Link } from "react-router-dom";
import {
  useGetProfileQuery,
  useLogoutMutation,
} from "../graphql/generated/schema";
export default function Header() {
  const { data: currentUser, client } = useGetProfileQuery({
    errorPolicy: "ignore",
  });

  const [logout] = useLogoutMutation();

  return (
    <header>
      <nav>
        <ul className="navbarList">
          <li data-testid="accueil">
            <Link to="/">Accueil</Link>
          </li>
          {currentUser ? (
            <>
              <li>
                <Link to="/myurl">Mes URLs</Link>
              </li>
              <li>
                <button
                  onClick={async () => {
                    await logout();
                    await client.resetStore();
                  }}
                  className="logoutButton"
                >
                  Log out
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/signup">S'enregistrer</Link>
              </li>
              <li>
                <Link to="/login">Se connecter</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}
