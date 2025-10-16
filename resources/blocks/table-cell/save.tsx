import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import type { BlockSaveProps } from '@wordpress/blocks';

interface TableCellAttributes {
  isHeaderCell: boolean;
  colspan: number;
  rowspan: number;
  verticalAlignment: 'top' | 'middle' | 'bottom';
}

const Save: React.FC<BlockSaveProps<TableCellAttributes>> = ({ attributes }) => {
  const { isHeaderCell, colspan, rowspan, verticalAlignment } = attributes;

  const TagName = isHeaderCell ? 'th' : 'td';

  const blockProps = useBlockProps.save({
    className: [
      'wp-block-jankx-table-cell',
      isHeaderCell && 'is-header-cell',
      `vertical-align-${verticalAlignment}`,
    ]
      .filter(Boolean)
      .join(' '),
    style: {
      verticalAlign: verticalAlignment,
    },
    colSpan: colspan > 1 ? colspan : undefined,
    rowSpan: rowspan > 1 ? rowspan : undefined,
  });

  return (
    <TagName {...blockProps}>
      <div className="wp-block-jankx-table-cell__content">
        <InnerBlocks.Content />
      </div>
    </TagName>
  );
};

export default Save;

