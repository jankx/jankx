import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, MediaUpload, MediaUploadCheck, useInnerBlocksProps, InnerBlocks } from '@wordpress/block-editor';
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
import type { CarouselBannerProps } from './types';

const BANNER_TEMPLATE: [string, Record<string, unknown>, [string, Record<string, unknown>][]?][] = [
  ['core/heading', { level: 2, placeholder: __('Tiêu đề slide...', 'jankx'), textAlign: 'center' }],
  ['core/paragraph', { placeholder: __('Mô tả ngắn cho slide này...', 'jankx'), align: 'center' }],
];

export default function Edit({ attributes, setAttributes }: CarouselBannerProps): JSX.Element {
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
    showCaption,
    height = 0,
    imageSize = 'cover'
  } = attributes;

  const blockProps = useBlockProps({
    className: `embla__slide embla-banner embla-banner--${bannerStyle} text-${textAlign} text-position-${textPosition} image-size-${imageSize}`
  });

  const innerBlocksProps = useInnerBlocksProps(
    { className: 'embla-banner__overlay-content' },
    {
      template: BANNER_TEMPLATE,
      templateLock: false,
      renderAppender: InnerBlocks.ButtonBlockAppender,
    }
  );

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

  const imageStyles: React.CSSProperties = imageUrl ? {
    backgroundImage: `url(${imageUrl})`,
    '--overlay-color': overlayColor,
    '--overlay-opacity': overlayOpacity,
    ...(imageSize === 'fullwidth'
      ? { backgroundSize: '100% 100%', backgroundPosition: 'center' }
      : imageSize === 'contain'
        ? { backgroundSize: 'contain' }
        : { backgroundSize: 'cover' }
    )
  } : {};

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
              <SelectControl
                label={__('Image Size', 'jankx')}
                value={imageSize}
                options={[
                  { label: __('Cover', 'jankx'), value: 'cover' },
                  { label: __('Contain', 'jankx'), value: 'contain' },
                  { label: __('Fullwidth', 'jankx'), value: 'fullwidth' }
                ]}
                onChange={(val: string) => setAttributes({ imageSize: val as 'contain' | 'cover' | 'fullwidth' })}
                help={__('Cover: Fill entire area, Contain: Fit entire image, Fullwidth: Stretch to 100% width and height', 'jankx')}
              />

              <TextControl
                label={__('Alt Text', 'jankx')}
                value={imageAlt}
                onChange={(val: string) => setAttributes({ imageAlt: val })}
                help={__('Describe the image for accessibility', 'jankx')}
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

          {bannerStyle === 'circles' && (
            <RangeControl
              label={__('Height (px)', 'jankx')}
              value={height || 0}
              onChange={(val: number) => setAttributes({ height: val || 0 })}
              min={50}
              max={1000}
              step={10}
              help={__('Set height for circle banner. Width will automatically match height.', 'jankx')}
            />
          )}

          <SelectControl
            label={__('Content Alignment', 'jankx')}
            value={textAlign}
            options={[
              { label: __('Left', 'jankx'), value: 'left' },
              { label: __('Center', 'jankx'), value: 'center' },
              { label: __('Right', 'jankx'), value: 'right' }
            ]}
            onChange={(val: string) => setAttributes({ textAlign: val as 'left' | 'center' | 'right' })}
          />

          <SelectControl
            label={__('Content Position', 'jankx')}
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
            help={__('Darkness of overlay over image (0 = none, 1 = fully dark)', 'jankx')}
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

      {/* Background image layer */}
      {imageUrl ? (
        <div
          className={`embla-banner__image image-size-${imageSize}`}
          style={imageStyles}
          aria-hidden="true"
        />
      ) : (
        <Placeholder
          icon="format-image"
          label={__('Carousel Banner', 'jankx')}
          instructions={__('Select a background image using the settings panel →', 'jankx')}
          className="embla-banner__placeholder"
        >
          <MediaUploadCheck>
            <MediaUpload
              onSelect={onSelectImage}
              allowedTypes={['image']}
              value={imageId}
              render={({ open }) => (
                <Button variant="primary" onClick={open}>
                  {__('Select Image', 'jankx')}
                </Button>
              )}
            />
          </MediaUploadCheck>
        </Placeholder>
      )}

      {/* Dark overlay */}
      {imageUrl && overlayOpacity > 0 && (
        <div
          className="embla-banner__overlay"
          style={{
            backgroundColor: overlayColor,
            opacity: overlayOpacity
          }}
          aria-hidden="true"
        />
      )}

      {/* Inner blocks: heading, paragraph, search, buttons, etc. */}
      <div {...innerBlocksProps} />
    </div>
  );
}
