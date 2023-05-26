import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useGetProfileQuery,
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

export default function MyUrl() {
  let navigate = useNavigate();

  const [urlList, setUrlList] = useState<IUrl[]>([]);

  const { data } = useGetUrlsByUserIdQuery();

  useEffect(() => {
    // console.log(data?.getUrlsByUserId);
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
  );
}
