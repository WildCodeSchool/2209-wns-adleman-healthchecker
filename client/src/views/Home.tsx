import React from "react";

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
      <div>
        <div>
          <h1 data-testid="title">Texte d'accueil</h1>
        </div>
        <div>
          <UrlForm getFormUrl={getFormUrl} />
          <div></div>
        </div>
        <UrlList dataFormUrl={dataFormUrl} />
      </div>
    </React.Fragment>
  );
}
