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
      <TableContainer>
        <h1 className="history__title-position">{url?.url}</h1>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="left" sx={{ fontWeight: "900" }}>
                Statut du site internet
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: "900" }}>
                Latence du site internet
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: "900" }}>
                Date de la vérification
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell align="left">{row.status}</TableCell>
                <TableCell>{row.latency}</TableCell>
                <TableCell align="left">{row.created_at}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
