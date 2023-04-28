import React, { useEffect, useState } from "react";
import { useCreateUrlMutation } from "../graphql/generated/schema";

export default function UrlForm({ getFormUrl }: { getFormUrl: Function }) {
  const [url, setUrl] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [isDisabled, setIsDisabled] = useState(true);
  // const [error, setError] = useState('')

  const [createUrl] = useCreateUrlMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === "") {
      getFormUrl("", 0, 0, 0);
    }
    setUrl(e.target.value);
  };

  useEffect(() => {
    const urlPattern =
      /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/;

    const reg = new RegExp(urlPattern);
    if (url.length === 0) {
      return;
    }
    if (!reg.test(url) && url !== "http://servertest:9000/servertest") {
      setIsValid(false);
      setIsDisabled(true);
    } else {
      setIsValid(true);
      setIsDisabled(false);
    }
  }, [url]);

  const handleValidate = async () => {
    if (isValid && !isDisabled) {
      try {
        const response = await createUrl({ variables: { url: { url } } });
        if (response.data?.createUrl.responses) {
          let lastResponse =
            response.data.createUrl.responses[
              response.data.createUrl.responses.length - 1
            ];

          console.log(response);

          getFormUrl(
            url,
            lastResponse.response_status,
            lastResponse.latency,
            lastResponse.created_at
          );
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="form flex">
      <div className="heavy">Ici, entrer votre URL :</div>

      <input
        id="input-URL"
        placeholder="Entrer une URL"
        value={url}
        onChange={handleChange}
        required={true}
      />
      <button
        data-testid="form-button-test"
        disabled={isDisabled || !isValid}
        onClick={handleValidate}
        className="button"
      >
        Rechercher
      </button>
    </div>
  );
}
