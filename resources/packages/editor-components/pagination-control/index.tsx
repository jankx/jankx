import React from 'react';

interface PaginationControlProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const PaginationControl: React.FC<PaginationControlProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
}) => {
  const handlePrevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className={`pagination-control ${className}`}>
      <button
        onClick={handlePrevPage}
        disabled={currentPage <= 1}
        className="pagination-control__prev"
      >
        Previous
      </button>

      <span className="pagination-control__info">
        Page {currentPage} of {totalPages}
      </span>

      <button
        onClick={handleNextPage}
        disabled={currentPage >= totalPages}
        className="pagination-control__next"
      >
        Next
      </button>
    </div>
  );
};

export default PaginationControl;

