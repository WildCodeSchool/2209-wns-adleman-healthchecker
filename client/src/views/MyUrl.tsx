import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  // useGetProfileQuery,
  useGetUrlsByUserIdQuery,
} from "../graphql/generated/schema";

interface IResponse {
  latency: number;
  status: number;
  date: string;
}

interface IUrl {
  id: number;
  url: string;
  lastStatus: number;
  lastDate: string;
  lastLatency: number;
  responses: IResponse[];
}

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

export default function MyUrl({ currentUser }: IProfileProps) {
  let navigate = useNavigate();

  const [urlList, setUrlList] = useState<IUrl[]>([]);

  const { data } = useGetUrlsByUserIdQuery();

  useEffect(() => {
    // Comparaison seuil et réponses
    // Si seuil < latence -> ajouter URL dans la liste "URL dépassant seuil"
    // Si on a des URL qui dépassent, on affiche la modale
    console.log(currentUser);

    if (data?.getUrlsByUserId) {
      let newList = data.getUrlsByUserId.userToUrls.map((u) => {
        let lastLatency = u.url.responses[u.url.responses.length - 1].latency;
        let lastDate = u.url.responses[u.url.responses.length - 1].created_at;
        let lastStatus =
          u.url.responses[u.url.responses.length - 1].response_status;
        let responseList = u.url.responses.map((r) => {
          return {
            latency: r.latency,
            status: r.response_status,
            date: r.created_at,
          };
        });
        return {
          id: u.url.id,
          url: u.url.url,
          responses: responseList,
          lastDate,
          lastStatus,
          lastLatency,
        };
      });
      setUrlList(newList);
    }
  }, [data]);

  function onUrlClick(urlId: number) {
    navigate(`/history/${urlId}`);
  }

  if (!urlList) return <div>Pas d'adresse trouvée</div>;

  return (
    <div className="container">
      <div className="header flex">
        <div>URL</div>
        <div>Latence</div>
        <div>Status</div>
      </div>
      {urlList &&
        urlList.map((u, i) => (
          <div className="row flex" onClick={() => onUrlClick(u.id)} key={i}>
            <div>{u.url}</div>
            <div>{u.lastLatency}</div>
            <div>{u.lastStatus}</div>
          </div>
        ))}
    </div>

    // MODAL non affiché par défaut
  );
}
