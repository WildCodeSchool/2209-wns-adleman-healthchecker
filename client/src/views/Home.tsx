import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { Button, TextField } from "@mui/material";

export default function SimpleContainer() {
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
          <Box>
            <h3>Ici, vous pouvez entrer votre URL pour vérifier l'état :</h3>
            <TextField
              id="input-URL"
              label="Saisir l'URL"
              variant="outlined"
              sx={{
                display: "flex",
                width: "80%",
                margin: "0 auto",
                marginBottom: "10px",
                "& label.Mui-focused": {
                  color: "#7F51D6",
                },
                "& .MuiInput-underline:after": {
                  borderBottomColor: "#7F51D6",
                },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#7F51D6",
                  },
                  "&:hover fieldset": {
                    borderColor: "#7F51D6",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#7F51D6",
                  },
                },
              }}
            />
            <Button
              variant="contained"
              sx={{
                display: "flex",
                margin: "0 auto",
                color: "#fff",
                backgroundColor: "#7F51D6",
                ":hover": {
                  backgroundColor: "#6038af",
                },
              }}
            >
              Rechercher
            </Button>
          </Box>
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
