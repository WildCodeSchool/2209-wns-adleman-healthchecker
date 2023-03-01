import { useEffect, useState } from "react";
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
  url: string;
  lastStatus: number;
  lastDate: string;
  lastLatency: number;
  responses: IResponse[];
}

export default function MyUrl() {
  const [urlList, setUrlList] = useState<IUrl[]>([]);
  const { data: currentUser, client } = useGetProfileQuery({
    errorPolicy: "ignore",
  });

  const { data } = useGetUrlsByUserIdQuery({
    variables: {
      userId: currentUser?.profile.id || 0,
    },
  });

  useEffect(() => {
    if (data?.getUrlsByUserId) {
      let newList = data.getUrlsByUserId.urls.map((u) => {
        let lastLatency = u.responses[u.responses.length - 1].latency;
        let lastDate = u.responses[u.responses.length - 1].created_at;
        let lastStatus = u.responses[u.responses.length - 1].response_status;
        let responseList = u.responses.map((r) => {
          return {
            latency: r.latency,
            status: r.response_status,
            date: r.created_at,
          };
        });
        return {
          url: u.url,
          responses: responseList,
          lastDate,
          lastStatus,
          lastLatency,
        };
      });
      setUrlList(newList);
    }
  }, [data]);

  if (!urlList) return <div>Pas d'adresse trouvée</div>;

  return (
    <div className="container">
      <div className="header flex">
        <div>URL</div>
        <div>Latence</div>
        <div>Status</div>
      </div>
      {urlList &&
        urlList.map((u) => (
          <div className="row flex">
            <div>{u.url}</div>
            <div>{u.lastLatency}</div>
            <div>{u.lastStatus}</div>
          </div>
        ))}
    </div>
  );
}
