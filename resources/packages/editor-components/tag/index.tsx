import React from 'react';

const Tag = ({ children, ...props }: any) => {
  return (
    <span className="woocommerce-tag" {...props}>
      {children}
    </span>
  );
};

export default Tag;
