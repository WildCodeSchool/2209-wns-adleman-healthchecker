import { useParams } from "react-router-dom";
import {
  useGetProfileQuery,
  useGetUrlsByUserIdQuery,
} from "../graphql/generated/schema";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

export default function MyUrl() {
  const { data: currentUser, client } = useGetProfileQuery({
    errorPolicy: "ignore",
  });

  // const userId = currentUser?.profile.id;

  const { data } = useGetUrlsByUserIdQuery({
    variables: {
      userId: currentUser?.profile.id || 0,
    },
  });

  const urlList = data?.getUrlsByUserId;

  if (!urlList) return <div>Pas d'adresse trouvée</div>;
  console.log(urlList);
  const rows = urlList.map((u) => ({
    id: u.id,
    url: u.url,
    created_at: u.created_at,
    latency: u.responses[0].latency,
    response_status: u.responses[0].response_status,
  }));
  return (
    <TableContainer>
      <h1 className="history__title-position">MyUrl</h1>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="left" sx={{ fontWeight: "900" }}>
              Adresse du site internet
            </TableCell>
            <TableCell align="left" sx={{ fontWeight: "900" }}>
              Latence du site internet
            </TableCell>
            <TableCell align="left" sx={{ fontWeight: "900" }}>
              Statut du site internet
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell align="left">{row.url}</TableCell>
              <TableCell align="left">{row.latency}</TableCell>
              <TableCell align="left">{row.response_status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
