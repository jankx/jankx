import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import type { BlockSaveProps } from '@wordpress/blocks';

interface TableRowAttributes {
  isHeader: boolean;
  isFooter: boolean;
}

const Save: React.FC<BlockSaveProps<TableRowAttributes>> = ({ attributes }) => {
  const { isHeader, isFooter } = attributes;

  const TagName = isHeader ? 'thead' : isFooter ? 'tfoot' : 'tbody';

  const blockProps = useBlockProps.save({
    className: [
      'wp-block-jankx-table-row',
      isHeader && 'is-header',
      isFooter && 'is-footer',
    ]
      .filter(Boolean)
      .join(' '),
  });

  return (
    <TagName>
      <tr {...blockProps}>
        <InnerBlocks.Content />
      </tr>
    </TagName>
  );
};

export default Save;

