import React, { useEffect, useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { Button, TextField } from "@mui/material";

import {
  Url as UrlType,
  useCreateUrlMutation,
} from "../graphql/generated/schema";

export default function Home() {
  const [url, setUrl] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [isDisabled, setIsDisabled] = useState(true);

  const [createUrl] = useCreateUrlMutation();

  const handleValidation = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  useEffect(() => {
    const urlPattern =
      /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/;

    const reg = new RegExp(urlPattern);
    if (url.length === 0) {
      return;
    }
    if (!reg.test(url)) {
      setIsValid(false);
      setIsDisabled(true);
    } else {
      setIsValid(true);
      setIsDisabled(false);
    }
  }, [url]);

  const handleValidate = async () => {
    console.log(url);
    console.log(isValid);
    if (isValid && url) {
      try {
        await createUrl({ variables: { url: { url } } });
      } catch (err) {
        console.error(err);
      }
    }
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
              value={url}
              onChange={handleValidation}
              error={!isValid}
              required={true}
              helperText={
                url.length === 0
                  ? "Veuillez saisir une URL"
                  : isValid
                  ? ""
                  : "Votre URL n'est pas valide"
              }
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
              disabled={isDisabled || !isValid}
              onClick={handleValidate}
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
