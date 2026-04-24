import { __ } from '@wordpress/i18n';
import { useBlockProps, useInnerBlocksProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl } from '@wordpress/components';
import type { CarouselSlideProps } from './types';

export default function Edit({ attributes, setAttributes, clientId }: CarouselSlideProps): JSX.Element {
  const { imageSize = 'cover' } = attributes;

  const blockProps = useBlockProps({
    className: `carousel-slide image-size-${imageSize}`,
    'data-image-size': imageSize
  });

  const innerBlocksProps = useInnerBlocksProps(blockProps, {
    templateLock: false
  });

  return (
    <>
      <InspectorControls>
        <PanelBody title={__('Image Settings', 'jankx')} initialOpen={false}>
          <SelectControl
            label={__('Background Image Size', 'jankx')}
            value={imageSize}
            options={[
              { label: __('Cover', 'jankx'), value: 'cover' },
              { label: __('Contain', 'jankx'), value: 'contain' },
              { label: __('Fullwidth', 'jankx'), value: 'fullwidth' }
            ]}
            onChange={(val: string) => setAttributes({ imageSize: val as 'contain' | 'cover' | 'fullwidth' })}
            help={__('Cover: Fill entire area, Contain: Fit entire image, Fullwidth: Stretch to 100% width and height', 'jankx')}
          />
        </PanelBody>
      </InspectorControls>
      <div {...innerBlocksProps} />
    </>
  );
}
