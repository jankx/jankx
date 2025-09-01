import React from 'react';

interface ExpandableSearchListItemProps {
  children: React.ReactNode;
  [key: string]: any;
}

const ExpandableSearchListItem: React.FC<ExpandableSearchListItemProps> = ({ children, ...props }) => {
  return (
    <div className="woocommerce-expandable-search-list-item" {...props}>
      {children}
    </div>
  );
};

export default ExpandableSearchListItem;
