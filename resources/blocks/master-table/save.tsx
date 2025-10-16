import { useBlockProps, InnerBlocks, useInnerBlocksProps } from '@wordpress/block-editor';
import type { BlockSaveProps } from '@wordpress/blocks';

interface MasterTableAttributes {
  hasFixedLayout: boolean;
  hasHeaderRow: boolean;
  hasFooterRow: boolean;
}

const Save: React.FC<BlockSaveProps<MasterTableAttributes>> = ({
  attributes,
}) => {
  const { hasFixedLayout } = attributes;

  const blockProps = useBlockProps.save({
    className: [
      'wp-block-jankx-master-table__wrapper',
      hasFixedLayout && 'has-fixed-layout',
    ]
      .filter(Boolean)
      .join(' '),
  });

  return (
    <div {...blockProps}>
      <table className="wp-block-jankx-master-table">
        <InnerBlocks.Content />
      </table>
    </div>
  );
};

export default Save;

