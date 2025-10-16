import { __ } from '@wordpress/i18n';
import {
  useBlockProps,
  InspectorControls,
  InnerBlocks,
  BlockControls,
  useInnerBlocksProps,
  __experimentalUseColorProps as useColorProps,
  __experimentalUseBorderProps as useBorderProps,
} from '@wordpress/block-editor';
import {
  PanelBody,
  ToggleControl,
  ToolbarGroup,
  ToolbarButton,
} from '@wordpress/components';
import { createBlock } from '@wordpress/blocks';
import { useDispatch, useSelect } from '@wordpress/data';

interface TableRowAttributes {
  isHeader: boolean;
  isFooter: boolean;
}

interface EditProps {
  attributes: TableRowAttributes;
  setAttributes: (attrs: Partial<TableRowAttributes>) => void;
  clientId: string;
}

const Edit: React.FC<EditProps> = ({ attributes, setAttributes, clientId }) => {
  const { isHeader, isFooter } = attributes;

  const { insertBlock } = useDispatch('core/block-editor') as any;
  const { getBlockIndex, getBlockRootClientId } = useSelect(
    (select) => select('core/block-editor') as any
  );

  const colorProps = useColorProps(attributes);
  const borderProps = useBorderProps(attributes);

  const TagName = isHeader ? 'thead' : isFooter ? 'tfoot' : 'tbody';

  const trProps = useBlockProps({
    className: [
      'wp-block-jankx-table-row',
      isHeader && 'is-header',
      isFooter && 'is-footer',
      colorProps.className,
      borderProps.className,
    ]
      .filter(Boolean)
      .join(' '),
    style: {
      ...colorProps.style,
      ...borderProps.style,
    },
  });

  const innerBlocksProps = useInnerBlocksProps(
    {},
    {
      allowedBlocks: ['jankx/table-cell'],
      template: [
        ['jankx/table-cell', {}],
        ['jankx/table-cell', {}],
      ],
      templateLock: false,
      renderAppender: false,
    }
  );

  const handleInsertRowBefore = () => {
    const rootClientId = getBlockRootClientId(clientId);
    const index = getBlockIndex(clientId);
    const newBlock = createBlock('jankx/table-row', {});
    insertBlock(newBlock, index, rootClientId);
  };

  const handleInsertRowAfter = () => {
    const rootClientId = getBlockRootClientId(clientId);
    const index = getBlockIndex(clientId);
    const newBlock = createBlock('jankx/table-row', {});
    insertBlock(newBlock, index + 1, rootClientId);
  };

  return (
    <>
      <InspectorControls>
        <PanelBody title={__('Row Settings', 'jankx')}>
          <ToggleControl
            label={__('Header row', 'jankx')}
            checked={isHeader}
            onChange={(value) =>
              setAttributes({ isHeader: value, isFooter: value ? false : isFooter })
            }
          />
          <ToggleControl
            label={__('Footer row', 'jankx')}
            checked={isFooter}
            onChange={(value) =>
              setAttributes({ isFooter: value, isHeader: value ? false : isHeader })
            }
          />
        </PanelBody>
      </InspectorControls>

      <BlockControls>
        <ToolbarGroup>
          <ToolbarButton
            icon="table-row-before"
            label={__('Insert row before', 'jankx')}
            onClick={handleInsertRowBefore}
          />
          <ToolbarButton
            icon="table-row-after"
            label={__('Insert row after', 'jankx')}
            onClick={handleInsertRowAfter}
          />
        </ToolbarGroup>
      </BlockControls>

      <TagName>
        <tr {...trProps} {...innerBlocksProps} />
      </TagName>
    </>
  );
};

export default Edit;

