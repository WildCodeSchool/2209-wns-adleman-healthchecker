import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGetUrlsQuery } from "../graphql/generated/schema";

export default function UrlList({ dataFormUrl }: { dataFormUrl: string }) {
  let navigate = useNavigate();

  const { data, refetch } = useGetUrlsQuery();
  const urlList = data?.getUrls;

  useEffect(() => {
    refetch();
  }, [dataFormUrl, refetch]);

  if (!urlList) return <div>Pas d'adresse trouvée</div>;

  const rows = urlList.map((u) => ({
    id: u.id,
    url: u.url,
    created_at: u.created_at,
  }));

  function onUrlClick(urlId: number) {
    navigate(`/history/${urlId}`);
  }

  return (
    <>
      <div className="header flex">
        <div>Adresse</div>
        <div>Date</div>
      </div>
      <div className="body">
        {rows.map((row) => (
          <div
            className="row flex"
            key={row.id}
            onClick={() => onUrlClick(row.id)}
          >
            <div>{row.url}</div>
            <div>{row.created_at}</div>
          </div>
        ))}
      </div>
    </>
  );
}
