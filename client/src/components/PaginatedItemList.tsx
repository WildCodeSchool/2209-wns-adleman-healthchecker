import React, { useState } from "react";
import { IResponse } from "../views/History";
import ItemList from "./ItemList";
import Pagination from "./Pagination";

interface Props {
  items: IResponse[];
  itemsPerPage: number;
  limit: number;
}
const PaginatedItemList: React.FC<Props> = ({ items, itemsPerPage, limit }) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Logic to calculate the total number of pages
  const totalPages = Math.ceil(items.length / itemsPerPage);

  // Handler function for changing the current page
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  // Render the item list component with the current page and items per page props
  return (
    <div>
      <ItemList
        items={items}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        limit={limit}
      />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default PaginatedItemList;
