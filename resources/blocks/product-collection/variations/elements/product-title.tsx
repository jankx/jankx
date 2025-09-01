import React from 'react';
import { useBlockProps } from '@wordpress/block-editor';

const ProductTitle: React.FC = () => {
  const blockProps = useBlockProps();

  return (
    <div {...blockProps}>
      <h2 className="product-title">Product Title</h2>
    </div>
  );
};

export default ProductTitle;
