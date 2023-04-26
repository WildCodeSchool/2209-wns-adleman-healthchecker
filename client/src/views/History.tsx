import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useGetUrlByIdQuery } from "../graphql/generated/schema";
import { formatDate, formatUrl } from "../utils/utils";

interface IResponse {
  id: number;
  response_status: number;
  latency: number;
  created_at: Date;
}

export default function History() {
  const { id } = useParams();

  const [responseList, setResponseList] = useState<IResponse[]>([]);

  const idFormat = parseInt(id!);

  const { data, startPolling } = useGetUrlByIdQuery({
    variables: {
      urlId: idFormat,
    },
  });
  useEffect(() => {
    if (data) {
      let responseList = data.getUrlById.responses
        .map((r) => {
          return {
            id: r.id,
            response_status: r.response_status,
            latency: r.latency,
            created_at: r.created_at,
          };
        })
        .sort((a, b) => b.created_at.localeCompare(a.created_at));

      setResponseList(responseList);
      startPolling(5000);
    }
  }, [data]);

  return (
    <div className="container">
      <h2>{data && formatUrl(data.getUrlById.url)}</h2>
      <div className="header flex">
        <div>Statut</div>
        <div>Latence</div>
        <div>Date</div>
      </div>
      <div className="body">
        {responseList.map((r) => (
          <div className="row flex" key={r.id}>
            <div>{r.response_status}</div>
            <div>{r.latency}</div>
            <div>{formatDate(r.created_at.toString())}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
