import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { formatDate, formatUrl } from "../utils/utils";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import { HistoryChart } from "../components/HistoryChart";
import {
  useGetProfileQuery,
  useGetUrlByIdQuery,
  useUpdateFrequencyMutation,
  useUpdateLatencyTresholdMutation,
} from "../graphql/generated/schema";
import { Ioption } from "../components/Select";
import Select from "../components/Select";
import DateFilter from "../components/DateFilter";
import PaginatedItemList from "../components/PaginatedItemList";
import ToggleSelect from "../components/ToggleSelect";

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
  const [selectedStatus, setSelectedStatus] = useState<number>(0);
  const [selectView, setSelectView] = useState<number>(0);
  const [selectedLimit, setSelectedLimit] = useState<number>(5000);

  const idFormat = parseInt(id!);
  
  const { data: currentUser } = useGetProfileQuery({
    errorPolicy: "ignore",
  });
  
  const { data, startPolling } = useGetUrlByIdQuery({
    variables: {
      urlId: idFormat,
    },
  });

  const options: Ioption[] = [
    { label: "5 seconds", value: 5000 },
    { label: "30 seconds", value: 30000 },
    { label: "10 minutes", value: 600000 },
    { label: "30 minutes", value: 1800000 },
    { label: "1 hour", value: 3600000 },
  ];

  const optionsStatus: Ioption[] = [
    { label: "All", value: 0 },
    { label: "1XX", value: 1 },
    { label: "2XX", value: 2 },
    { label: "3XX", value: 3 },
    { label: "4XX", value: 4 },
    { label: "5XX", value: 5 },
  ];

  const optionsLimit: Ioption[] = [
    { label: "Pas de limite ", value: 0 },
    { label: "10 milliseconds", value: 10 },
    { label: "50 milliseconds", value: 50 },
    { label: "100 milliseconds", value: 100 },
    { label: "500 milliseconds", value: 500 },
    { label: "1 second", value: 1000 },
    { label: "2 seconds", value: 2000 },
    { label: "3 seconds", value: 3000 },
    { label: "4 seconds", value: 4000 },
    { label: "5 seconds", value: 5000 },
  ];

  const toggleOptions: Ioption[] = [
    { label: "List", value: 0 },
    { label: "Graph", value: 1 },
  ];

  // const { data } = useGetUrlByIdQuery({})

  const [start, setStart] = useState<
    string | number | readonly string[] | undefined
  >(undefined);
  const [end, setEnd] = useState<
    string | number | readonly string[] | undefined
  >(undefined);

  const [updateFrequencyMutation] = useUpdateFrequencyMutation();
  const [updateLatencyTreshold] = useUpdateLatencyTresholdMutation();

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
        filteredResponseList
          ?.sort((a, b) =>
            a.created_at.toString().localeCompare(b.created_at.toString())
          )
          .map((r) => formatDate(r.created_at.toString())) || [],
      datasets: [
        {
          label: "latence",
          data:
            filteredResponseList
              ?.sort((a, b) =>
                b.created_at.toString().localeCompare(a.created_at.toString())
              )
              .map((r) => r.latency) || [],
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
      setSelectedFrequency(data.getUrlById.frequency);
      // setSelectedLimit(data.);
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

  const handleChangeStatus = (value: number) => {
    setSelectedStatus(value);
  };

  const handleChangeLimit = (value: number) => {
    setSelectedLimit(value);
    updateLatencyTreshold({
      variables: {
        data: {
          urlId: idFormat,
          threshold: value,
        },
      },
    });
  };

  const toggleChange = () => {
    if (selectView === 0) {
      setSelectView(1);
    } else {
      setSelectView(0);
    }
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
    let newResonses = responseList
      .filter((r) => {
        let date = Date.parse(r.created_at.toString());
        return (
          ((start && r.created_at && date > _start) || !_start) &&
          ((end && r.created_at && date < _end) || !_end)
        );
      })
      .filter((r) => {
        if (selectedStatus === 1)
          return 100 <= r.response_status && r.response_status <= 199;
        if (selectedStatus === 2)
          return 200 <= r.response_status && r.response_status <= 299;
        if (selectedStatus === 3)
          return 300 <= r.response_status && r.response_status <= 399;
        if (selectedStatus === 4)
          return 400 <= r.response_status && r.response_status <= 499;
        if (selectedStatus === 5)
          return 500 <= r.response_status && r.response_status <= 599;

        return r;
      });

    setFilteredResponseList(newResonses);
  }, [start, end, responseList, selectedStatus]);

  Chart.register(CategoryScale);

  return (
    <div className="container">
      <h2>{data?.getUrlById && formatUrl(data?.getUrlById.url)}</h2>
      {currentUser && (
      <div className="filterBar flex flex-around">
        <div>
          <div className="flex flex-center medium">Fréquence :</div>
          
            <div>
              <Select
                options={options}
                value={selectedFrequency}
                onChange={handleChangeFrequency}
              />
            </div>
          
        </div>
        <div>
          <div className="flex flex-center medium">Seuil de latence :</div>
            <div>
              <Select
                options={optionsLimit}
                value={selectedLimit}
                onChange={handleChangeLimit}
              />
            </div>
        </div>
      </div>
      )}

      <div className="filterBar flex flex-around">
        <div>
          <div className="flex flex-center medium">Préciser une période :</div>
          <DateFilter start={start} end={end} onChange={handleChangeDate} />
        </div>

        <div>
          <div className="flex flex-center medium">Mode d'affichage :</div>
          <ToggleSelect
            options={toggleOptions}
            toggleChange={toggleChange}
            value={selectView}
          />
        </div>

        <div>
          <div className="flex flex-center medium">Choisir un statut :</div>
          <Select
            value={selectedStatus}
            options={optionsStatus}
            onChange={handleChangeStatus}
          />
        </div>
      </div>

      {filteredResponseList.length < 1 ? (
        <div>Pas de réponse dispo</div>
      ) : !selectView ? (
        <PaginatedItemList
          items={filteredResponseList}
          itemsPerPage={10}
          limit={selectedLimit}
        />
      ) : (
        <HistoryChart chartData={chartData} />
      )}
    </div>
  );
}
// { selectView ? (<PaginatedItemList items={filteredResponseList} itemsPerPage={10} />): (<HistoryChart chartData={chartData} />)
