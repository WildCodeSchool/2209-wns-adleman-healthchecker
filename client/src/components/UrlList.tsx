import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetUrlsQuery } from "../graphql/generated/schema";
import { formatUrl, formatDate } from "../utils/utils";

interface IUrl {
  id: number;
  url: string;
  lastDate: string;
  lastStatus: number;
}

export default function UrlList({ dataFormUrl }: { dataFormUrl: string }) {
  let navigate = useNavigate();

  const [filteredList, setFilteredList] = useState<IUrl[]>([]);
  const [formatedList, setFormatedList] = useState<IUrl[]>([]);
  const [search, setSearch] = useState<string>("");

  const { data, refetch } = useGetUrlsQuery();
  const urlList = data?.getUrls;

  // const [filteredList, setFilteredList] = useState<>()

  useEffect(() => {
    refetch();
  }, [dataFormUrl, refetch]);

  useEffect(() => {
    if (urlList) {
      let newList = urlList
        .map((u) => {
          let lastResponse = u.responses[u.responses.length - 1];
          return {
            id: u.id,
            url: u.url,
            lastDate: lastResponse.created_at,
            lastStatus: lastResponse.response_status,
          };
        })
        .sort((a, b) => b.lastDate.localeCompare(a.lastDate));
      setFilteredList(newList);
      setFormatedList(newList);
    }
  }, [urlList]);

  const handleChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === "") {
      setFilteredList(formatedList);
    } else {
      let newList = filteredList.filter((u) => {
        return u.url.includes(e.target.value);
      });
      setFilteredList(newList);
    }
    setSearch(e.target.value);
  };

  if (!urlList) return <div>No URL found ...</div>;

  const rows = filteredList.map((u) => ({
    id: u.id,
    url: u.url,
    date: u.lastDate,
    status: u.lastStatus,
  }));

  function onUrlClick(urlId: number) {
    navigate(`/history/${urlId}`);
  }

  return (
    <div className="url-list card">
      <h1>URLs list</h1>

      <div className="url-list-form flex">
        <span className="medium">Search an URL: </span>
        <input
          id="list-input-URL"
          placeholder="URL..."
          value={search}
          onChange={handleChangeSearch}
        />
      </div>

      <div className="header flex">
        <div className="heavy">URL</div>
        <div className="heavy">Date</div>
        <div className="heavy">Status</div>
      </div>

      {rows.map((row) => (
        <div
          className="row flex"
          key={row.id}
          onClick={() => onUrlClick(row.id)}
        >
          <div className="medium">{formatUrl(row.url)}</div>
          <div>{formatDate(row.date)}</div>
          <div>{row.status}</div>
        </div>
      ))}
    </div>
  );
}
