import React from "react";

interface Props {
  setIsOpen: (isOpen: boolean) => void;
}

const Modal: React.FC<Props> = ({ setIsOpen }) => {
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
          </div>
          <div className="modalActions">
            <div className="actionsContainer">
              <button className="deleteBtn" onClick={() => setIsOpen(false)}>
                Valider
              </button>
              <button className="cancelBtn" onClick={() => setIsOpen(false)}>
                Retour
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
