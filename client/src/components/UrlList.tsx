import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGetUrlsQuery } from "../graphql/generated/schema";
import { formatUrl, formatDate } from "../utils/utils";

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
    <div className="url-list card">
      <h1>Liste des URLs</h1>

      <div className="url-list-form flex">
        <span className="medium">Rechercher une URL déjà enregistrée: </span>
        <input
          id="list-input-URL"
          placeholder="Entrer une URL"
          // value={url}
          // onChange={handleValidation}
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
          <div>{formatDate(row.created_at)}</div>
          <div>Status</div>
        </div>
      ))}
    </div>
  );
}
