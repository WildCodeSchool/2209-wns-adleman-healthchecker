import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { formatDate, formatUrl } from "../utils/utils";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import { HistoryChart } from "../components/HistoryChart";
import {
  useGetUrlByIdQuery,
  useUpdateFrequencyMutation,
} from "../graphql/generated/schema";
import { Ioption } from "../components/Select";
import Select from "../components/Select";
import DateFilter from "../components/DateFilter";
import PaginatedItemList from "../components/PaginatedItemList";

export interface IResponse {
  id: number;
  response_status: number;
  latency: number;
  created_at: Date;
}

export default function History() {
  const { id } = useParams();

  const [responseList, setResponseList] = useState<IResponse[]>([]);
  const [filteredResponseList, setFilteredResponseList] = useState<IResponse[]>(
    []
  );
  const [selectedFrequency, setSelectedFrequency] = useState<number>(3600000);

  const idFormat = parseInt(id!);
  const { data, startPolling } = useGetUrlByIdQuery({
    variables: {
      urlId: idFormat,
    },
  });

  // const { data } = useGetUrlByIdQuery({
  //   variables: {
  //     urlId: idFormat,
  //   },
  // });
  const options: Ioption[] = [
    { label: "5 secondes", value: 5000 },
    { label: "30 secondes", value: 30000 },
    { label: "10 minutes", value: 600000 },
    { label: "30 minutes", value: 1800000 },
    { label: "1 heure", value: 3600000 },
  ];

  // const { data } = useGetUrlByIdQuery({})

  const [start, setStart] = useState<
    string | number | readonly string[] | undefined
  >(undefined);
  const [end, setEnd] = useState<
    string | number | readonly string[] | undefined
  >(undefined);

  const [updateFrequencyMutation] = useUpdateFrequencyMutation();

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
      labels:
        filteredResponseList?.map((r) => formatDate(r.created_at.toString())) ||
        [],
      datasets: [
        {
          label: "latence",
          data: filteredResponseList?.map((r) => r.latency) || [],
          backgroundColor:
            filteredResponseList?.map((r) => {
              if (r.response_status === 200) return "#4caf50";
              if (r.response_status === 500) return "#f44336";
              return "#ffc107";
            }) || [],
        },
      ],
    });
  }, [filteredResponseList]);

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
      setFilteredResponseList(responseList);
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

  const handleChangeDate = (
    _start: string | number | readonly string[] | undefined,
    _end: string | number | readonly string[] | undefined
  ) => {
    setStart(_start);
    setEnd(_end);
  };

  useEffect(() => {
    let _start: number = 0;
    let _end: number = 0;
    if (typeof start === "string") _start = Date.parse(start);
    if (typeof end === "string") _end = Date.parse(end);
    let newResonses = responseList.filter((r) => {
      let date = Date.parse(r.created_at.toString());
      return (
        ((start && r.created_at && date > _start) || !_start) &&
        ((end && r.created_at && date < _end) || !_end)
      );
    });

    setFilteredResponseList(newResonses);
  }, [start, end, responseList]);

  Chart.register(CategoryScale);

  return (
    <div className="container">
      <h2>{data?.getUrlById && formatUrl(data?.getUrlById.url)}</h2>
      <HistoryChart chartData={chartData} />

      <h2>{data && formatUrl(data.getUrlById.url)}</h2>
      <div className="filterBar flex flex-around">
        <div>
          <Select
            options={options}
            value={selectedFrequency}
            onChange={handleChangeFrequency}
          />
        </div>
        <div>
          <DateFilter start={start} end={end} onChange={handleChangeDate} />
        </div>
        <div>filtre par statut</div>
      </div>
      {filteredResponseList.length > 0 ? (
        <PaginatedItemList items={filteredResponseList} itemsPerPage={10} />
      ) : (
        <div>Pas de réponse dispo</div>
      )}
    </div>
  );
}
