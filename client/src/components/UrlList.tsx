import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid";
import { useEffect } from "react";
import { useGetUrlsQuery } from "../graphql/generated/schema";

const columns: GridColDef[] = [
  { field: "col1", headerName: "Adresse web", width: 300 },
  { field: "col2", headerName: "Date de création", width: 300 },
];
export default function UrlList({ dataFormUrl }: { dataFormUrl: string }) {
  const { data, refetch } = useGetUrlsQuery();
  const urlList = data?.getUrls;

  useEffect(() => {
    refetch();
  }, [dataFormUrl, refetch]);

  if (!urlList) return <div>En cours de chargement</div>;

  const rows: GridRowsProp = urlList.map((u) => ({
    id: u.id,
    col1: u.url,
    col2: u.created_at,
  }));

  return (
    <div style={{ height: 300, width: "100%" }}>
      <DataGrid rows={rows} columns={columns} />
    </div>
  );
}
