import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, MediaUpload, MediaUploadCheck, InnerBlocks, useInnerBlocksProps, RichText } from '@wordpress/block-editor';
import { PanelBody, Button, ToggleControl, RangeControl, SelectControl, Placeholder, TextControl } from '@wordpress/components';
import { useState, useEffect, useRef } from '@wordpress/element';
import { createBlock } from '@wordpress/blocks';
import { useDispatch } from '@wordpress/data';
import type { SlideshowEditProps, SlideImage } from './types';

export default function Edit({ attributes, setAttributes, clientId }: SlideshowEditProps): JSX.Element {
  const {
    images,
    autoplay,
    autoplayDelay,
    fullscreen,
    showThumbnails,
    showNavigation,
    showPagination,
    transitionEffect,
    transitionSpeed,
    thumbnailSize,
    mainImageHeight,
    captionPosition,
    enableLightbox,
    showFooterText,
    footerText,
    fullscreenText
  } = attributes;

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const slideshowRef = useRef<HTMLDivElement>(null);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);
  const { replaceInnerBlocks } = useDispatch('core/block-editor');

  const blockProps = useBlockProps({
    ref: slideshowRef,
    className: `slideshow-block slideshow-effect-${transitionEffect}`,
    style: {
      '--slideshow-height': `${mainImageHeight}px`,
      '--slideshow-transition-speed': `${transitionSpeed}ms`,
      '--slideshow-thumbnail-size': thumbnailSize === 'small' ? '60px' : thumbnailSize === 'large' ? '100px' : '80px',
    } as React.CSSProperties
  });

  const innerBlocksProps = useInnerBlocksProps(
    { className: 'slideshow-items' },
    {
      allowedBlocks: ['jankx/slideshow-item'],
      template: [], // Empty template, we'll populate dynamically
      templateLock: false, // Allow editing
      orientation: 'horizontal'
    }
  );

  // Auto-play functionality
  useEffect(() => {
    if (autoplay && images.length > 1) {
      autoplayRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % images.length);
      }, autoplayDelay);
    } else {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
        autoplayRef.current = null;
      }
    }

    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
    };
  }, [autoplay, autoplayDelay, images.length]);

  // Load images from gallery and create slideshow-item blocks
  const onSelectImages = async (mediaList: any[]) => {
    setIsLoading(true);

    // Create slideshow-item blocks for each selected image
    const blocksToCreate = mediaList.map(media => {
      const thumbnailUrl = media.sizes?.thumbnail?.url || media.sizes?.medium?.url || media.url;

      return createBlock('jankx/slideshow-item', {
        imageId: media.id,
        imageUrl: media.url,
        imageAlt: media.alt || '',
        imageCaption: media.caption || '',
        thumbnailUrl: thumbnailUrl,
        slideId: `slide-${media.id}-${Date.now()}`
      });
    });

    // Replace existing inner blocks with new ones
    replaceInnerBlocks(clientId, blocksToCreate, false);

    // Also save images to attributes for PHP rendering
    const newImages: SlideImage[] = mediaList.map(media => ({
      id: media.id,
      url: media.url,
      alt: media.alt || '',
      caption: media.caption || '',
      thumbnailUrl: media.sizes?.thumbnail?.url || media.sizes?.medium?.url || media.url,
      sizes: media.sizes
    }));

    setAttributes({ images: newImages });
    setIsLoading(false);
  };

  const onRemoveAllImages = () => {
    // Remove all inner blocks
    replaceInnerBlocks(clientId, [], false);
    // Clear images from attributes
    setAttributes({ images: [] });
    setCurrentSlide(0);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % images.length);
  };

  const getThumbnailSize = (size: string) => {
    switch (size) {
      case 'small': return '40px';
      case 'large': return '80px';
      default: return '60px';
    }
  };

  if (images.length === 0) {
    return (
      <div {...blockProps}>
        <InspectorControls>
          <PanelBody title={__('Slideshow Settings', 'jankx')} initialOpen={true}>
            <ToggleControl
              label={__('Autoplay', 'jankx')}
              checked={autoplay}
              onChange={(val) => setAttributes({ autoplay: val })}
            />
            {autoplay && (
              <RangeControl
                label={__('Autoplay Delay (ms)', 'jankx')}
                value={autoplayDelay}
                onChange={(val) => setAttributes({ autoplayDelay: val })}
                min={1000}
                max={10000}
                step={500}
              />
            )}
            <ToggleControl
              label={__('Fullscreen Mode', 'jankx')}
              checked={fullscreen}
              onChange={(val) => setAttributes({ fullscreen: val })}
            />
            <ToggleControl
              label={__('Show Thumbnails', 'jankx')}
              checked={showThumbnails}
              onChange={(val) => setAttributes({ showThumbnails: val })}
            />
            <ToggleControl
              label={__('Show Navigation', 'jankx')}
              checked={showNavigation}
              onChange={(val) => setAttributes({ showNavigation: val })}
            />
            <ToggleControl
              label={__('Show Pagination', 'jankx')}
              checked={showPagination}
              onChange={(val) => setAttributes({ showPagination: val })}
            />
            <SelectControl
              label={__('Transition Effect', 'jankx')}
              value={transitionEffect}
              options={[
                { label: __('Slide', 'jankx'), value: 'slide' },
                { label: __('Fade', 'jankx'), value: 'fade' }
              ]}
              onChange={(val) => setAttributes({ transitionEffect: val as 'slide' | 'fade' })}
            />
            <RangeControl
              label={__('Transition Speed (ms)', 'jankx')}
              value={transitionSpeed}
              onChange={(val) => setAttributes({ transitionSpeed: val })}
              min={100}
              max={1000}
              step={50}
            />
            <SelectControl
              label={__('Thumbnail Size', 'jankx')}
              value={thumbnailSize}
              options={[
                { label: __('Small', 'jankx'), value: 'small' },
                { label: __('Medium', 'jankx'), value: 'medium' },
                { label: __('Large', 'jankx'), value: 'large' }
              ]}
              onChange={(val) => setAttributes({ thumbnailSize: val as 'small' | 'medium' | 'large' })}
            />
            <RangeControl
              label={__('Main Image Height (px)', 'jankx')}
              value={mainImageHeight}
              onChange={(val) => setAttributes({ mainImageHeight: val })}
              min={200}
              max={800}
              step={50}
            />
          </PanelBody>
        </InspectorControls>

        <Placeholder
          icon="format-gallery"
          label={__('Slideshow', 'jankx')}
          instructions={__('Select images from your media library to create a slideshow.', 'jankx')}
        >
          <MediaUploadCheck>
            <MediaUpload
              onSelect={onSelectImages}
              allowedTypes={['image']}
              multiple
              gallery
              render={({ open }) => (
                <Button variant="primary" onClick={open} isBusy={isLoading}>
                  {isLoading ? __('Loading...', 'jankx') : __('Select Images', 'jankx')}
                </Button>
              )}
            />
          </MediaUploadCheck>
        </Placeholder>
      </div>
    );
  }

  return (
    <div {...blockProps}>
      <InspectorControls>
        <PanelBody title={__('Slideshow Settings', 'jankx')} initialOpen={true}>
          <MediaUploadCheck>
            <MediaUpload
              onSelect={onSelectImages}
              allowedTypes={['image']}
              multiple
              gallery
              value={images.map(img => img.id)}
              render={({ open }) => (
                <Button variant="secondary" onClick={open}>
                  {__('Change Images', 'jankx')}
                </Button>
              )}
            />
          </MediaUploadCheck>
          <Button variant="secondary" onClick={onRemoveAllImages} isDestructive>
            {__('Remove All Images', 'jankx')}
          </Button>

          <ToggleControl
            label={__('Autoplay', 'jankx')}
            checked={autoplay}
            onChange={(val) => setAttributes({ autoplay: val })}
          />
          {autoplay && (
            <RangeControl
              label={__('Autoplay Delay (ms)', 'jankx')}
              value={autoplayDelay}
              onChange={(val) => setAttributes({ autoplayDelay: val })}
              min={1000}
              max={10000}
              step={500}
            />
          )}
          <ToggleControl
            label={__('Fullscreen Mode', 'jankx')}
            checked={fullscreen}
            onChange={(val) => setAttributes({ fullscreen: val })}
          />
          <ToggleControl
            label={__('Enable Lightbox on Click', 'jankx')}
            help={__('Open lightbox when clicking on slide images', 'jankx')}
            checked={enableLightbox}
            onChange={(val) => setAttributes({ enableLightbox: val })}
          />
          <ToggleControl
            label={__('Show Footer Text', 'jankx')}
            checked={showFooterText}
            onChange={(val) => setAttributes({ showFooterText: val })}
          />
          <TextControl
            label={__('Fullscreen Button Text', 'jankx')}
            value={fullscreenText}
            onChange={(value) => setAttributes({ fullscreenText: value })}
            help={__('Text hiển thị trên nút Fullscreen', 'jankx')}
          />
          <ToggleControl
            label={__('Show Thumbnails', 'jankx')}
            checked={showThumbnails}
            onChange={(val) => setAttributes({ showThumbnails: val })}
          />
          <ToggleControl
            label={__('Show Navigation', 'jankx')}
            checked={showNavigation}
            onChange={(val) => setAttributes({ showNavigation: val })}
          />
          <ToggleControl
            label={__('Show Pagination', 'jankx')}
            checked={showPagination}
            onChange={(val) => setAttributes({ showPagination: val })}
          />
          <SelectControl
            label={__('Transition Effect', 'jankx')}
            value={transitionEffect}
            options={[
              { label: __('Slide', 'jankx'), value: 'slide' },
              { label: __('Fade', 'jankx'), value: 'fade' }
            ]}
            onChange={(val) => setAttributes({ transitionEffect: val as 'slide' | 'fade' })}
          />
          <RangeControl
            label={__('Transition Speed (ms)', 'jankx')}
            value={transitionSpeed}
            onChange={(val) => setAttributes({ transitionSpeed: val })}
            min={100}
            max={1000}
            step={50}
          />
          <SelectControl
            label={__('Thumbnail Size', 'jankx')}
            value={thumbnailSize}
            options={[
              { label: __('Small', 'jankx'), value: 'small' },
              { label: __('Medium', 'jankx'), value: 'medium' },
              { label: __('Large', 'jankx'), value: 'large' }
            ]}
            onChange={(val) => setAttributes({ thumbnailSize: val as 'small' | 'medium' | 'large' })}
          />
          <RangeControl
            label={__('Main Image Height (px)', 'jankx')}
            value={mainImageHeight}
            onChange={(val) => setAttributes({ mainImageHeight: val })}
            min={200}
            max={800}
            step={50}
          />
          <SelectControl
            label={__('Caption Position', 'jankx')}
            value={captionPosition}
            options={[
              { label: __('Bottom', 'jankx'), value: 'bottom' },
              { label: __('Top', 'jankx'), value: 'top' },
              { label: __('Overlay', 'jankx'), value: 'overlay' },
              { label: __('Hidden', 'jankx'), value: 'hidden' }
            ]}
            onChange={(val) => setAttributes({ captionPosition: val as 'top' | 'bottom' | 'overlay' | 'hidden' })}
          />
        </PanelBody>
      </InspectorControls>

      {/* Thumbnails */}
      {showThumbnails && images.length > 1 && (
        <div className="slideshow-thumbnails">
          {images.map((image, index) => (
            <button
              key={image.id}
              className={`slideshow-thumbnail ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              style={{ width: getThumbnailSize(thumbnailSize), height: getThumbnailSize(thumbnailSize) }}
            >
              <img src={image.thumbnailUrl} alt={image.alt} />
            </button>
          ))}
        </div>
      )}

      {/* Main Slideshow */}
      <div className="slideshow-main">
        <div className="slideshow-container">
          <div className="slideshow-track">
            {images.map((image, index) => (
              <div
                key={image.id}
                className={`slideshow-slide slideshow-caption-${captionPosition} ${index === currentSlide ? 'active' : ''}`}
                style={{
                  transform: transitionEffect === 'slide'
                    ? `translateX(${(index - currentSlide) * 100}%)`
                    : 'translateX(0)',
                  opacity: transitionEffect === 'fade'
                    ? (index === currentSlide ? 1 : 0)
                    : 1
                }}
              >
                <img src={image.url} alt={image.alt} />
                {image.caption && captionPosition !== 'hidden' && (
                  <div className="slideshow-caption">
                    <div dangerouslySetInnerHTML={{ __html: image.caption }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        {showNavigation && images.length > 1 && (
          <>
            <button
              className="slideshow-nav slideshow-nav-prev"
              onClick={goToPrevious}
              aria-label={__('Previous slide', 'jankx')}
            >
              ←
            </button>
            <button
              className="slideshow-nav slideshow-nav-next"
              onClick={goToNext}
              aria-label={__('Next slide', 'jankx')}
            >
              →
            </button>
          </>
        )}
      </div>

      {/* Footer Text */}
      {showFooterText && (
        <div className="slideshow-footer-text">
          <RichText
            tagName="div"
            value={footerText}
            onChange={(value) => setAttributes({ footerText: value })}
            placeholder={__('Nhập nội dung footer...', 'jankx')}
            allowedFormats={['core/bold', 'core/italic', 'core/link', 'core/text-color']}
          />
        </div>
      )}

      {/* Footer Controls */}
      <div className="slideshow-footer">
        <div className="slideshow-controls">
          {fullscreen && (
            <button className="slideshow-fullscreen-btn">
              {fullscreenText || __('Fullscreen', 'jankx')}
            </button>
          )}
          {autoplay && (
            <button className="slideshow-autoplay-btn">
              {__('Xem tự động', 'jankx')}
            </button>
          )}
        </div>

        {showPagination && images.length > 1 && (
          <div className="slideshow-pagination">
            <button
              className="slideshow-pagination-prev"
              onClick={goToPrevious}
              disabled={currentSlide === 0}
            >
              &lt;
            </button>
            {images.map((_, index) => (
              <button
                key={index}
                className={`slideshow-pagination-dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
              >
                {index + 1}
              </button>
            ))}
            <button
              className="slideshow-pagination-next"
              onClick={goToNext}
              disabled={currentSlide === images.length - 1}
            >
              &gt;
            </button>
          </div>
        )}
      </div>

      {/* InnerBlocks for slideshow items - hidden in editor */}
      <div style={{ display: 'none' }} {...innerBlocksProps} />
    </div>
  );
}