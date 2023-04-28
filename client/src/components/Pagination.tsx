import React from "react";
interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
}

const Pagination: React.FC<Props> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  // Handler function for clicking the first page button
  const handleFirstPageClick = () => {
    onPageChange(1);
  };

  // Handler function for clicking the last page button
  const handleLastPageClick = () => {
    onPageChange(totalPages);
  };

  // Handler function for clicking the previous page button
  const handlePrevPageClick = () => {
    onPageChange(currentPage - 1);
  };

  // Handler function for clicking the next page button
  const handleNextPageClick = () => {
    onPageChange(currentPage + 1);
  };

  // Render the pagination controls
  return (
    <div>
      <button onClick={handleFirstPageClick} disabled={currentPage === 1}>
        First
      </button>
      <button onClick={handlePrevPageClick} disabled={currentPage === 1}>
        &lt;
      </button>
      <span>
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={handleNextPageClick}
        disabled={currentPage === totalPages}
      >
        &gt;
      </button>
      <button
        onClick={handleLastPageClick}
        disabled={currentPage === totalPages}
      >
        Last
      </button>
    </div>
  );
};

export default Pagination;
