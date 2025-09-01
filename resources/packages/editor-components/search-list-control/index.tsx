import React from 'react';

interface SearchListControlProps {
  children: React.ReactNode;
  className?: string;
}

const SearchListControl: React.FC<SearchListControlProps> = ({ children, className = '' }) => {
  return (
    <div className={`search-list-control ${className}`}>
      {children}
    </div>
  );
};

export default SearchListControl;

