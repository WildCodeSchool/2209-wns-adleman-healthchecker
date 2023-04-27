import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useGetUrlByIdQuery } from "../graphql/generated/schema";
import { formatDate, formatUrl } from "../utils/utils";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import { HistoryChart } from "../components/HistoryChart";

interface DataChart {
  id: number;
  latency: number;
  response_status: number;
  created_at: Date;
}

interface ModelChart {
  labels?: string;
  datasets: [
    {
      label: string;
      data: number[];
      backgroundColor: string[];
    }
  ];
}
export default function History() {
  const { id } = useParams();

  // const [url, setUrl] = useState<string>("");

  const idFormat = parseInt(id!);

  // const { data } = useGetUrlByIdQuery({
  //   variables: {
  //     urlId: idFormat,
  //   },
  // });

  const { data } = useGetUrlByIdQuery({
    variables: {
      urlId: idFormat,
    },
  });
  // const {id, response_status, latency, created_at } = data;
  // useEffect(() => {
  //   setUrl(data?.getUrlById);
  // }, [data]);

  const url = data?.getUrlById;
  const responses = data?.getUrlById.responses;

  const [chartData, setChartData] = useState({
    labels: [""],
    datasets: [
      {
        label: "",
        data: [0],
        backgroundColor: [""],
      },
    ],
  });
  useEffect(() => {
    setChartData({
      labels: responses?.map((r) => formatDate(r.created_at)) || [],
      datasets: [
        {
          label: "Statut du serveur",
          data: responses?.map((r) => r.latency) || [],
          backgroundColor:
            responses?.map((r) => {
              if (r.response_status === 200) return "#4caf50";
              if (r.response_status === 500) return "#f44336";
              return "#ffc107";
            }) || [],
        },
      ],
    });
  }, [responses]);

  if (!responses) return <div>Pas de réponse trouvé pour cette adresse</div>;

  const rows = responses.map((r) => ({
    id: r.id,
    status: r.response_status,
    latency: r.latency,
    created_at: r.created_at,
  }));

  Chart.register(CategoryScale);

  return (
    <div className="container">
      <h2>{url && formatUrl(url?.url)}</h2>
      <HistoryChart chartData={chartData} />
      <div className="header flex">
        <div>Statut</div>
        <div>Latence</div>
        <div>Date</div>
      </div>
      <div className="body">
        {rows.map((row) => (
          <div className="row flex" key={row.id}>
            <div>{row.status}</div>
            <div>{row.latency}</div>
            <div>{formatDate(row.created_at)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
