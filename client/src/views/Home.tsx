import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import UrlForm from "../components/UrlForm";

export default function Home() {
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
          <h1>Texte d'accueil</h1>
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
          <UrlForm />
          <Box
            sx={{
              width: "33%",
              height: "50%",
              backgroundColor: "#7F51D6",
              borderRadius: "10px",
            }}
          ></Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            bgcolor: "#DECEFD",
            height: "50vh",
            borderRadius: "10px",
            justifyContent: "center",
          }}
        >
          <h2>Liste des URL</h2>
        </Box>
      </Container>
    </React.Fragment>
  );
}
