import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  useGetUrlByIdQuery,
  useUpdateFrequencyMutation,
} from "../graphql/generated/schema";
import { formatDate, formatUrl } from "../utils/utils";
import { Ioption } from "../components/Select";
import Select from "../components/Select";

interface IResponse {
  id: number;
  response_status: number;
  latency: number;
  created_at: Date;
}

export default function History() {
  const { id } = useParams();

  const [responseList, setResponseList] = useState<IResponse[]>([]);
  const [selectedFrequency, setSelectedFrequency] = useState<number>(3600000);

  const idFormat = parseInt(id!);

  const options: Ioption[] = [
    { label: "5 secondes", value: 5000 },
    { label: "30 secondes", value: 30000 },
    { label: "10 minutes", value: 600000 },
    { label: "30 minutes", value: 1800000 },
    { label: "1 heure", value: 3600000 },
  ];

  const [updateFrequencyMutation] = useUpdateFrequencyMutation();

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
  }, [data, startPolling]);

  const handleChangeFrequency = (value: number) => {
    setSelectedFrequency(value);
    updateFrequencyMutation({
      variables: {
        data: {
          urlId: idFormat,
          frequency: value,
        },
      },
    });
  };

  return (
    <div className="container">
      <h2>{data && formatUrl(data.getUrlById.url)}</h2>
      <div className="filterBar flex flex-around">
        <div>
          <Select
            options={options}
            value={selectedFrequency}
            onChange={handleChangeFrequency}
          />
        </div>
        <div>Select period</div>
        <div>filtre par statut</div>
      </div>
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
