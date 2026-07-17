import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, RangeControl, SelectControl } from '@wordpress/components';
import { createElement } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

type Props = {
  attributes: {
    tagName?: 'hr' | 'div';
    thickness?: number;
    widthPercent?: number;
    lineAlign?: 'left' | 'center' | 'right';
  };
  setAttributes: (attrs: Partial<Props['attributes']>) => void;
};

export default function Edit({ attributes, setAttributes }: Props): JSX.Element {
  const { tagName = 'hr', thickness = 2, widthPercent = 50, lineAlign = 'center' } = attributes;
  const blockProps = useBlockProps({
    className: `jankx-divider align-${lineAlign}`,
    style: {
      ['--divider-thickness' as any]: `${thickness}px`,
      ['--divider-width' as any]: `${widthPercent}%`,
    } as React.CSSProperties,
  });
  return (
    <>
      <InspectorControls>
        <PanelBody title={__('Line Settings', 'jankx')} initialOpen={true}>
          <RangeControl
            label={__('Độ dày (px)', 'jankx')}
            value={thickness}
            onChange={(v?: number) => setAttributes({ thickness: v ?? 2 })}
            min={1}
            max={12}
          />
          <RangeControl
            label={__('Chiều rộng (%)', 'jankx')}
            value={widthPercent}
            onChange={(v?: number) => setAttributes({ widthPercent: v ?? 50 })}
            min={10}
            max={100}
          />
          <SelectControl
            label={__('Căn lề', 'jankx')}
            value={lineAlign}
            options={[
              { label: __('Trái', 'jankx'), value: 'left' },
              { label: __('Giữa', 'jankx'), value: 'center' },
              { label: __('Phải', 'jankx'), value: 'right' },
            ]}
            onChange={(v: 'left' | 'center' | 'right') => setAttributes({ lineAlign: v })}
          />
        </PanelBody>
      </InspectorControls>
      {createElement(tagName, blockProps as any)}
    </>
  );
}
