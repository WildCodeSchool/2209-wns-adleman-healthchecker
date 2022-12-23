import { useState } from "react";
import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid";
import { useGetUrlsQuery } from "../graphql/generated/schema";

const columns: GridColDef[] = [
  { field: "col1", headerName: "Adresse web", width: 150 },
  { field: "col2", headerName: "Date de création", width: 150 },
];
export default function UrlList() {
  const [tableData, setTableData] = useState([]);

  const { data, loading, error, refetch } = useGetUrlsQuery({
    variables: {},
  });

  const tableInfo = data?.getUrls;
  //   const newTbaleInfo = { id: data?.getUrls, url, created_at };

  const rows: GridRowsProp = [
    { id: 1, col1: "DataGridPro", col2: "World" },
    { id: 2, col1: "DataGridPro", col2: "is Awesome" },
    { id: 3, col1: "MUI", col2: "is Amazing" },
  ];

  return (
    <div style={{ height: 300, width: "100%" }}>
      <DataGrid rows={rows} columns={columns} />
    </div>
  );
}
