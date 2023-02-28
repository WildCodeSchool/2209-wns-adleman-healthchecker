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
      <div className="container">
        {/* <div className="card title">
          <h1 data-testid="title">Texte d'accueil</h1>
        </div> */}
        <div className="card url-form flex">
          <UrlForm getFormUrl={getFormUrl} />
          <div className="response">
            <div className="header flex">
              <div className="heavy">Status</div>
              <div className="heavy">URL</div>
              <div className="heavy">Latence</div>
            </div>
            <div className="row flex">
              <div>Status</div>
              <div>URL</div>
              <div>Latence</div>
            </div>
          </div>
        </div>
        <UrlList dataFormUrl={dataFormUrl} />
      </div>
    </React.Fragment>
  );
}
