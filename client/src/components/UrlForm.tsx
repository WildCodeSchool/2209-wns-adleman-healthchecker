import React, { useEffect, useState } from "react";

import { useCreateUrlMutation } from "../graphql/generated/schema";

export default function UrlForm({ getFormUrl }: { getFormUrl: Function }) {
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
    if (isValid && !isDisabled) {
      try {
        await createUrl({ variables: { url: { url } } });
      } catch (err) {
        console.error(err);
      } finally {
        getFormUrl(url);
      }
    }
  };

  return (
    <div>
      <h3>Ici, vous pouvez entrer votre URL pour vérifier l'état :</h3>

      <input
        id="input-URL"
        placeholder="Saisir l'URL"
        value={url}
        onChange={handleValidation}
        required={true}
      />
      <button
        data-testid="form-button-test"
        disabled={isDisabled || !isValid}
        onClick={handleValidate}
      >
        Rechercher
      </button>
    </div>
  );
}
