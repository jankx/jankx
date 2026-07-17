import { __ } from '@wordpress/i18n';
import { useBlockProps, useInnerBlocksProps, InspectorControls, ColorPalette } from '@wordpress/block-editor';
import { PanelBody, SelectControl, RangeControl } from '@wordpress/components';
import type { CarouselSlideProps } from './types';

export default function Edit({ attributes, setAttributes, clientId }: CarouselSlideProps): JSX.Element {
  const {
    imageSize = 'cover',
    overlayColor = 'rgba(0,0,0,0.4)',
    overlayOpacity = 40
  } = attributes;

  const blockProps = useBlockProps({
    className: `carousel-slide embla__slide image-size-${imageSize}`,
    'data-image-size': imageSize
  });

  const innerBlocksProps = useInnerBlocksProps({
    className: 'carousel-slide__content'
  }, {
    templateLock: false
  });

  const opacity = overlayOpacity / 100;
  const overlayStyle: React.CSSProperties = {
    backgroundColor: overlayColor,
    opacity: opacity,
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    zIndex: 1
  };

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
        <PanelBody title={__('Overlay Settings', 'jankx')} initialOpen={false}>
          <p>{__('Overlay Color', 'jankx')}</p>
          <ColorPalette
            value={overlayColor}
            onChange={(val?: string) => setAttributes({ overlayColor: val || '' })}
          />
          <RangeControl
            label={__('Overlay Opacity', 'jankx')}
            value={overlayOpacity}
            onChange={(val: number | undefined) => setAttributes({ overlayOpacity: val ?? 40 })}
            min={0}
            max={100}
          />
        </PanelBody>
      </InspectorControls>
      <div {...blockProps}>
        <div className="carousel-slide__overlay" style={overlayStyle}></div>
        <div {...innerBlocksProps} />
      </div>
    </>
  );
}
