import { __ } from '@wordpress/i18n';
import {
  useBlockProps,
  InspectorControls,
  InnerBlocks,
  BlockControls,
  BlockVerticalAlignmentToolbar,
  useInnerBlocksProps,
  __experimentalUseColorProps as useColorProps,
} from '@wordpress/block-editor';
import {
  PanelBody,
  ToggleControl,
  RangeControl,
  SelectControl,
  ToolbarGroup,
  ToolbarButton,
} from '@wordpress/components';
import { createBlock } from '@wordpress/blocks';
import { useDispatch, useSelect } from '@wordpress/data';

interface TableCellAttributes {
  isHeaderCell: boolean;
  colspan: number;
  rowspan: number;
  verticalAlignment: 'top' | 'middle' | 'bottom';
}

interface EditProps {
  attributes: TableCellAttributes;
  setAttributes: (attrs: Partial<TableCellAttributes>) => void;
  clientId: string;
}

const Edit: React.FC<EditProps> = ({ attributes, setAttributes, clientId }) => {
  const { isHeaderCell, colspan, rowspan, verticalAlignment } = attributes;

  const { insertBlock } = useDispatch('core/block-editor') as any;
  const { getBlockIndex, getBlockRootClientId } = useSelect(
    (select) => select('core/block-editor') as any
  );

  const colorProps = useColorProps(attributes);

  const TagName = isHeaderCell ? 'th' : 'td';

  const blockProps = useBlockProps({
    className: [
      'wp-block-jankx-table-cell',
      isHeaderCell && 'is-header-cell',
      `vertical-align-${verticalAlignment}`,
      colorProps.className,
    ]
      .filter(Boolean)
      .join(' '),
    style: {
      ...colorProps.style,
      verticalAlign: verticalAlignment,
    },
    colSpan: colspan > 1 ? colspan : undefined,
    rowSpan: rowspan > 1 ? rowspan : undefined,
  });

  const innerBlocksProps = useInnerBlocksProps(
    {
      className: 'wp-block-jankx-table-cell__content',
    },
    {
      template: [['core/paragraph', { placeholder: __('Enter content...', 'jankx') }]],
      templateLock: false,
      renderAppender: InnerBlocks.DefaultBlockAppender,
    }
  );

  const handleInsertCellBefore = () => {
    const rootClientId = getBlockRootClientId(clientId);
    const index = getBlockIndex(clientId);
    const newBlock = createBlock('jankx/table-cell', {});
    insertBlock(newBlock, index, rootClientId);
  };

  const handleInsertCellAfter = () => {
    const rootClientId = getBlockRootClientId(clientId);
    const index = getBlockIndex(clientId);
    const newBlock = createBlock('jankx/table-cell', {});
    insertBlock(newBlock, index + 1, rootClientId);
  };

  return (
    <>
      <InspectorControls>
        <PanelBody title={__('Cell Settings', 'jankx')}>
          <ToggleControl
            label={__('Header cell', 'jankx')}
            checked={isHeaderCell}
            onChange={(value) => setAttributes({ isHeaderCell: value })}
            help={__('Use <th> instead of <td>', 'jankx')}
          />
          <RangeControl
            label={__('Column span', 'jankx')}
            value={colspan}
            onChange={(value) => setAttributes({ colspan: value || 1 })}
            min={1}
            max={10}
          />
          <RangeControl
            label={__('Row span', 'jankx')}
            value={rowspan}
            onChange={(value) => setAttributes({ rowspan: value || 1 })}
            min={1}
            max={10}
          />
          <SelectControl
            label={__('Vertical alignment', 'jankx')}
            value={verticalAlignment}
            options={[
              { label: __('Top', 'jankx'), value: 'top' },
              { label: __('Middle', 'jankx'), value: 'middle' },
              { label: __('Bottom', 'jankx'), value: 'bottom' },
            ]}
            onChange={(value: any) => setAttributes({ verticalAlignment: value })}
          />
        </PanelBody>
      </InspectorControls>

      <BlockControls>
        <ToolbarGroup>
          <ToolbarButton
            icon="table-col-before"
            label={__('Insert cell before', 'jankx')}
            onClick={handleInsertCellBefore}
          />
          <ToolbarButton
            icon="table-col-after"
            label={__('Insert cell after', 'jankx')}
            onClick={handleInsertCellAfter}
          />
        </ToolbarGroup>
        <BlockVerticalAlignmentToolbar
          onChange={(value: any) => setAttributes({ verticalAlignment: value || 'middle' })}
          value={verticalAlignment}
        />
      </BlockControls>

      <TagName {...blockProps}>
        <div {...innerBlocksProps} />
      </TagName>
    </>
  );
};

export default Edit;

