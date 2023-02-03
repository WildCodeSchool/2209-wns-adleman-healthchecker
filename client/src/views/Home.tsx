import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import UrlForm from "../components/UrlForm";
import UrlList from "../components/UrlList";
import { useState } from "react";

export default function Home() {
  const [dataFormUrl, setData] = useState("");
  const getFormUrl = (url: string) => {
    setData(url);
  };
  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth={false}>
        <Box
          sx={{
            display: "flex",
            bgcolor: "#DECEFD",
            height: "15vh",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "10px",
            marginBottom: "10px",
            marginTop: "10px",
          }}
        >
          <h1 data-testid="title">Texte d'accueil</h1>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            bgcolor: "#DECEFD",
            height: "35vh",
            borderRadius: "10px",
            marginBottom: "10px",
            flexWrap: "wrap",
          }}
        >
          <UrlForm getFormUrl={getFormUrl} />
          <Box
            sx={{
              width: "33%",
              height: "50%",
              backgroundColor: "#7F51D6",
              borderRadius: "10px",
            }}
          ></Box>
        </Box>
        <UrlList dataFormUrl={dataFormUrl} />
      </Container>
    </React.Fragment>
  );
}
