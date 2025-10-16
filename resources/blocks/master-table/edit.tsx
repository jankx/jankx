import { __ } from '@wordpress/i18n';
import {
  useBlockProps,
  InspectorControls,
  InnerBlocks,
  BlockControls,
  useInnerBlocksProps,
  __experimentalUseBorderProps as useBorderProps,
  __experimentalUseColorProps as useColorProps,
} from '@wordpress/block-editor';
import {
  PanelBody,
  ToggleControl,
  ToolbarGroup,
  ToolbarButton,
} from '@wordpress/components';

interface MasterTableAttributes {
  hasFixedLayout: boolean;
  hasHeaderRow: boolean;
  hasFooterRow: boolean;
}

interface EditProps {
  attributes: MasterTableAttributes;
  setAttributes: (attrs: Partial<MasterTableAttributes>) => void;
  clientId: string;
}

const Edit: React.FC<EditProps> = ({ attributes, setAttributes, clientId }) => {
  const { hasFixedLayout, hasHeaderRow, hasFooterRow } = attributes;

  const colorProps = useColorProps(attributes);
  const borderProps = useBorderProps(attributes);

  const blockProps = useBlockProps({
    className: [
      'wp-block-jankx-master-table__wrapper',
      hasFixedLayout && 'has-fixed-layout',
    ]
      .filter(Boolean)
      .join(' '),
  });

  const innerBlocksProps = useInnerBlocksProps(
    {
      className: [
        'wp-block-jankx-master-table',
        borderProps.className,
        colorProps.className,
      ]
        .filter(Boolean)
        .join(' '),
      style: {
        ...borderProps.style,
        ...colorProps.style,
      },
    },
    {
      allowedBlocks: ['jankx/table-row'],
      template: [
        ['jankx/table-row', { isHeader: hasHeaderRow }],
        ['jankx/table-row', {}],
      ],
      templateLock: false,
      renderAppender: false,
    }
  );

  return (
    <>
      <InspectorControls>
        <PanelBody title={__('Table Settings', 'jankx')}>
          <ToggleControl
            label={__('Fixed table layout', 'jankx')}
            checked={hasFixedLayout}
            onChange={(value) => setAttributes({ hasFixedLayout: value })}
            help={__(
              'Fixed layout distributes column width equally',
              'jankx'
            )}
          />
          <ToggleControl
            label={__('Header row', 'jankx')}
            checked={hasHeaderRow}
            onChange={(value) => setAttributes({ hasHeaderRow: value })}
          />
          <ToggleControl
            label={__('Footer row', 'jankx')}
            checked={hasFooterRow}
            onChange={(value) => setAttributes({ hasFooterRow: value })}
          />
        </PanelBody>
      </InspectorControls>

      <BlockControls>
        <ToolbarGroup>
          <ToolbarButton
            icon="table-row-before"
            label={__('Insert row before', 'jankx')}
            onClick={() => {
              // Will be handled by row toolbar
            }}
            disabled
          />
          <ToolbarButton
            icon="table-row-after"
            label={__('Insert row after', 'jankx')}
            onClick={() => {
              // Will be handled by row toolbar
            }}
            disabled
          />
        </ToolbarGroup>
      </BlockControls>

      <div {...blockProps}>
        <table {...innerBlocksProps} />
      </div>
    </>
  );
};

export default Edit;

