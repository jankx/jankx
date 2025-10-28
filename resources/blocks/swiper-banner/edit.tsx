import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { 
  PanelBody, 
  Button, 
  TextControl, 
  SelectControl, 
  RangeControl, 
  ToggleControl,
  ColorPicker,
  Placeholder
} from '@wordpress/components';
import { useState } from '@wordpress/element';
import type { SwiperBannerProps } from './types';

export default function Edit({ attributes, setAttributes }: SwiperBannerProps): JSX.Element {
  const {
    imageId,
    imageUrl,
    imageAlt,
    imageCaption,
    linkUrl,
    linkTarget,
    bannerStyle,
    overlayOpacity,
    overlayColor,
    textAlign,
    textPosition,
    showCaption
  } = attributes;

  const blockProps = useBlockProps({
    className: `swiper-slide swiper-banner swiper-banner--${bannerStyle} text-${textAlign} text-position-${textPosition}`
  });

  const onSelectImage = (media: any) => {
    setAttributes({
      imageId: media.id,
      imageUrl: media.url,
      imageAlt: media.alt || '',
      imageCaption: media.caption || ''
    });
  };

  const removeImage = () => {
    setAttributes({
      imageId: 0,
      imageUrl: '',
      imageAlt: '',
      imageCaption: ''
    });
  };

  const renderImage = () => {
    if (!imageUrl) {
      return (
        <Placeholder
          icon="format-image"
          label={__('Swiper Banner', 'jankx')}
          instructions={__('Select an image to create a banner slide', 'jankx')}
        >
          <MediaUploadCheck>
            <MediaUpload
              onSelect={onSelectImage}
              allowedTypes={['image']}
              value={imageId}
              render={({ open }) => (
                <Button
                  variant="primary"
                  onClick={open}
                >
                  {__('Select Image', 'jankx')}
                </Button>
              )}
            />
          </MediaUploadCheck>
        </Placeholder>
      );
    }

    return (
      <div className="swiper-banner__content">
        <div 
          className="swiper-banner__image"
          style={{
            backgroundImage: `url(${imageUrl})`,
            '--overlay-color': overlayColor,
            '--overlay-opacity': overlayOpacity
          } as React.CSSProperties}
        >
          <div className="swiper-banner__overlay"></div>
          
          {showCaption && imageCaption && (
            <div className="swiper-banner__caption">
              <div className="swiper-banner__caption-content">
                {imageCaption}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div {...blockProps}>
      <InspectorControls>
        <PanelBody title={__('Image Settings', 'jankx')} initialOpen={true}>
          <MediaUploadCheck>
            <MediaUpload
              onSelect={onSelectImage}
              allowedTypes={['image']}
              value={imageId}
              render={({ open }) => (
                <Button
                  variant="secondary"
                  onClick={open}
                  style={{ width: '100%', marginBottom: '10px' }}
                >
                  {imageUrl ? __('Change Image', 'jankx') : __('Select Image', 'jankx')}
                </Button>
              )}
            />
          </MediaUploadCheck>

          {imageUrl && (
            <Button
              variant="link"
              isDestructive
              onClick={removeImage}
              style={{ width: '100%' }}
            >
              {__('Remove Image', 'jankx')}
            </Button>
          )}

          {imageUrl && (
            <>
              <TextControl
                label={__('Alt Text', 'jankx')}
                value={imageAlt}
                onChange={(val: string) => setAttributes({ imageAlt: val })}
                help={__('Describe the image for accessibility', 'jankx')}
              />

              <TextControl
                label={__('Caption', 'jankx')}
                value={imageCaption}
                onChange={(val: string) => setAttributes({ imageCaption: val })}
                help={__('Text to display over the image', 'jankx')}
              />

              <ToggleControl
                label={__('Show Caption', 'jankx')}
                checked={showCaption}
                onChange={(val: boolean) => setAttributes({ showCaption: val })}
              />
            </>
          )}
        </PanelBody>

        <PanelBody title={__('Link Settings', 'jankx')} initialOpen={false}>
          <TextControl
            label={__('Link URL', 'jankx')}
            value={linkUrl}
            onChange={(val: string) => setAttributes({ linkUrl: val })}
            placeholder={__('https://example.com', 'jankx')}
            help={__('Optional link for the banner', 'jankx')}
          />

          <SelectControl
            label={__('Link Target', 'jankx')}
            value={linkTarget}
            options={[
              { label: __('Same Window', 'jankx'), value: '_self' },
              { label: __('New Window', 'jankx'), value: '_blank' }
            ]}
            onChange={(val: string) => setAttributes({ linkTarget: val as '_self' | '_blank' })}
          />
        </PanelBody>

        <PanelBody title={__('Style Settings', 'jankx')} initialOpen={false}>
          <SelectControl
            label={__('Banner Style', 'jankx')}
            value={bannerStyle}
            options={[
              { label: __('Banner', 'jankx'), value: 'banner' },
              { label: __('Circles', 'jankx'), value: 'circles' },
              { label: __('Square', 'jankx'), value: 'square' }
            ]}
            onChange={(val: string) => setAttributes({ bannerStyle: val as 'banner' | 'circles' | 'square' })}
          />

          <SelectControl
            label={__('Text Alignment', 'jankx')}
            value={textAlign}
            options={[
              { label: __('Left', 'jankx'), value: 'left' },
              { label: __('Center', 'jankx'), value: 'center' },
              { label: __('Right', 'jankx'), value: 'right' }
            ]}
            onChange={(val: string) => setAttributes({ textAlign: val as 'left' | 'center' | 'right' })}
          />

          <SelectControl
            label={__('Text Position', 'jankx')}
            value={textPosition}
            options={[
              { label: __('Top', 'jankx'), value: 'top' },
              { label: __('Middle', 'jankx'), value: 'middle' },
              { label: __('Bottom', 'jankx'), value: 'bottom' }
            ]}
            onChange={(val: string) => setAttributes({ textPosition: val as 'top' | 'middle' | 'bottom' })}
          />

          <RangeControl
            label={__('Overlay Opacity', 'jankx')}
            value={overlayOpacity}
            onChange={(val: number) => setAttributes({ overlayOpacity: val })}
            min={0}
            max={1}
            step={0.1}
            help={__('Darkness of overlay over image', 'jankx')}
          />

          <div>
            <label>{__('Overlay Color', 'jankx')}</label>
            <ColorPicker
              color={overlayColor}
              onChange={(val: string) => setAttributes({ overlayColor: val })}
              disableAlpha={false}
            />
          </div>
        </PanelBody>
      </InspectorControls>

      {renderImage()}
    </div>
  );
}