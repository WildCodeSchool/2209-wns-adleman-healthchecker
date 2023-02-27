import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useGetUrlByIdQuery } from "../graphql/generated/schema";

export default function History() {
  const { id } = useParams();
  const idFormat = parseInt(id!);

  const { data } = useGetUrlByIdQuery({
    variables: {
      urlId: idFormat,
    },
  });

  const url = data?.getUrlById;
  const responses = data?.getUrlById.responses;
  if (!responses) return <div>Pas de réponse trouvé pour cette adresse</div>;

  const rows = responses.map((r) => ({
    id: r.id,
    status: r.response_status,
    latency: r.latency,
    created_at: r.created_at,
  }));

  return (
    <>
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
            <div>{row.created_at}</div>
          </div>
        ))}
      </div>
    </>
  );
}
