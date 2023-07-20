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
            <h2 className="heading">
              Latency treshold exceeded since last connection :
            </h2>
          </div>
          <div className="modalContent">
            {urls.map((u, i) => (
              <div key={i} onClick={() => onClick(u.id)}>
                <div>{u.url}</div>
              </div>
            ))}
            <button className="button" onClick={() => setIsOpen(false)}>
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
