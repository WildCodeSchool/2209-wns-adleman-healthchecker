import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
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
    <TableContainer>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="left" sx={{ fontWeight: "900" }}>
              Adresse du site internet
            </TableCell>
            <TableCell align="left" sx={{ fontWeight: "900" }}>
              Heure de la dernière mise à jour
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.url}
              onClick={() => onUrlClick(row.id)}
              hover
              sx={{
                "&.MuiTableRow-root:hover": {
                  backgroundColor: "#dcdcdc",
                },
                cursor: "pointer",
              }}
            >
              <TableCell>{row.url}</TableCell>
              <TableCell align="left">{row.created_at}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
