import React from "react";
import { IResponse } from "../views/History";
import { formatDate } from "../utils/utils";

interface Props {
  items: IResponse[];
  currentPage: number;
  itemsPerPage: number;
}

const ItemList: React.FC<Props> = ({ items, currentPage, itemsPerPage }) => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const itemsToDisplay = items.slice(startIndex, endIndex);

  // Render the list of items
  return (
    <>
      <div className="header flex">
        <div>Statut</div>
        <div>Latence</div>
        <div>Date</div>
      </div>
      <div className="body">
        {itemsToDisplay.map((r) => (
          <div className="row flex" key={r.id}>
            <div>{r.response_status}</div>
            <div>{r.latency}</div>
            <div>{formatDate(r.created_at.toString())}</div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ItemList;
