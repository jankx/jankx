import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { useBlockProps, InnerBlocks, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, ToggleControl, RangeControl } from '@wordpress/components';
import './style.scss';
import './editor.scss';

type Attributes = {
  stickyEnabled: boolean;
  offsetTop: number;
};

registerBlockType('jankx/sticky-box', {
  edit: ({ attributes, setAttributes }: { attributes: Attributes; setAttributes: (a: Partial<Attributes>) => void }) => {
    const { stickyEnabled = true, offsetTop = 16 } = attributes;

    const blockProps = useBlockProps({
      className: `jankx-sticky-box ${stickyEnabled ? 'sticky-enabled' : ''}`,
      style: { ['--sticky-top' as any]: `${offsetTop}px` },
    });

    return (
      <>
        <InspectorControls>
          <PanelBody title={__('Sticky Settings', 'jankx')} initialOpen={true}>
            <ToggleControl
              label={__('Enable Sticky', 'jankx')}
              checked={stickyEnabled}
              onChange={(value) => setAttributes({ stickyEnabled: value })}
            />
            <RangeControl
              label={__('Offset Top (px)', 'jankx')}
              value={offsetTop}
              onChange={(value?: number) => setAttributes({ offsetTop: value ?? 16 })}
              min={0}
              max={200}
            />
          </PanelBody>
        </InspectorControls>
        <div {...blockProps}>
          <InnerBlocks />
        </div>
      </>
    );
  },
  save: () => <InnerBlocks.Content />,
});
