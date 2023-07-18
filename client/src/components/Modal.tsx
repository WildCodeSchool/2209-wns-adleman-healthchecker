import React from "react";

interface IUrlId {
  url: string;
  id: number;
}

interface Props {
  setIsOpen: (isOpen: boolean) => void;
  urls: IUrlId[];
  onClick: (urlId: number) => void;
}

const Modal: React.FC<Props> = ({ setIsOpen, urls, onClick }) => {
  return (
    <>
      <div className="darkBG" onClick={() => setIsOpen(false)} />
      <div className="centered">
        <div className="modal">
          <div className="modalHeader">
            <h5 className="heading">Liste des urls avec un seuil dépassé</h5>
          </div>
          <div className="modalContent">
            Are you sure you want to delete the item?
            {urls.map((u, i) => (
              <div className="row flex" key={i} onClick={() => onClick(u.id)}>
                <div>{u.url}</div>
              </div>
            ))}
          </div>
          <div className="modalActions">
            <div className="actionsContainer">
              <button className="deleteBtn" onClick={() => setIsOpen(false)}>
                Fermer
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
