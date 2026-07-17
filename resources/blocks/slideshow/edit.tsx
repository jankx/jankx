import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, InnerBlocks } from '@wordpress/block-editor';
import { PanelBody, ToggleControl, RangeControl, SelectControl, TextControl, TextareaControl } from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { createBlock } from '@wordpress/blocks';
import type { SlideshowEditProps } from './types';

export default function Edit({ attributes, setAttributes, clientId }: SlideshowEditProps): JSX.Element {
  const {
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
    fullscreenText,
    prevText,
    nextText
  } = attributes;

  const [currentSlide, setCurrentSlide] = useState(0);
  const { insertBlock } = useDispatch('core/block-editor');

  // Get images and block info from slideshow-container child block
  const { images, innerBlocks } = useSelect((select: any) => {
    const { getBlock } = select('core/block-editor');
    const block = getBlock(clientId);
    
    let images = [];
    if (block && block.innerBlocks) {
      const containerBlock = block.innerBlocks.find((b: any) => b.name === 'jankx/slideshow-container');
      if (containerBlock && containerBlock.attributes) {
        images = containerBlock.attributes.images || [];
      }
    }
    
    
    return {
      images,
      innerBlocks: block?.innerBlocks || []
    };
  }, [clientId, currentSlide, showPagination]);

  // Auto-add footer text paragraph when showFooterText is enabled
  useEffect(() => {
    if (showFooterText && innerBlocks) {
      const hasFooterBlock = innerBlocks.some((b: any) => 
        ['core/paragraph', 'core/heading', 'core/list', 'core/list-item', 'core/quote', 'core/group'].includes(b.name)
      );
      
      if (!hasFooterBlock) {
        const paragraphBlock = createBlock('core/paragraph', {
          placeholder: __('Nhập nội dung footer...', 'jankx')
        });
        insertBlock(paragraphBlock, innerBlocks.length, clientId);
      }
    }
  }, [showFooterText, innerBlocks, insertBlock, clientId]);


  const blockProps = useBlockProps({
    className: `slideshow-block slideshow-effect-${transitionEffect}`,
    style: {
      '--slideshow-height': `${mainImageHeight}px`,
      '--slideshow-transition-speed': `${transitionSpeed}ms`,
      '--slideshow-thumbnail-size': thumbnailSize === 'small' ? '60px' : thumbnailSize === 'large' ? '100px' : '80px',
    } as React.CSSProperties
  });

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
            label={__('Enable Lightbox on Click', 'jankx')}
            help={__('Open lightbox when clicking on slide images', 'jankx')}
            checked={enableLightbox}
            onChange={(val) => setAttributes({ enableLightbox: val })}
          />
          <ToggleControl
            label={__('Show Footer Text', 'jankx')}
            checked={showFooterText}
            onChange={(val) => setAttributes({ showFooterText: val })}
            help={__('Tự động thêm core/paragraph block cho footer text', 'jankx')}
          />
          <TextControl
            label={__('Fullscreen Button Text', 'jankx')}
            value={fullscreenText}
            onChange={(value) => setAttributes({ fullscreenText: value })}
            help={__('Text hiển thị trên nút Fullscreen', 'jankx')}
          />
          <TextareaControl
            label={__('Previous Button Text/HTML', 'jankx')}
            value={prevText}
            onChange={(value) => setAttributes({ prevText: value })}
            help={__('Text hoặc HTML/SVG cho nút Previous. Mặc định: &lt;', 'jankx')}
            rows={3}
          />
          <TextareaControl
            label={__('Next Button Text/HTML', 'jankx')}
            value={nextText}
            onChange={(value) => setAttributes({ nextText: value })}
            help={__('Text hoặc HTML/SVG cho nút Next. Mặc định: &gt;', 'jankx')}
            rows={3}
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

      {/* InnerBlocks: slideshow-container + core blocks for footer */}
      <InnerBlocks
        allowedBlocks={['jankx/slideshow-container', 'core/paragraph', 'core/heading', 'core/list', 'core/list-item', 'core/quote', 'core/group']}
        template={[['jankx/slideshow-container', {}]]}
        templateLock={false}
      />

      {/* Footer - Only show when images exist */}
      {images.length > 0 && (
        <div className="slideshow-footer">
          {/* Footer text will be injected here via CSS order */}
          
          <div className="slideshow-footer-bottom">
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
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (currentSlide > 0) {
                    setCurrentSlide(currentSlide - 1);
                  }
                }}
                disabled={currentSlide === 0}
                type="button"
                style={{ pointerEvents: 'auto' }}
                dangerouslySetInnerHTML={{ __html: prevText || '&lt;' }}
              />
              {images.map((_, index) => (
                <button
                  key={index}
                  className={`slideshow-pagination-dot ${index === currentSlide ? 'active' : ''}`}
                  data-slide={index}
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentSlide(index);
                  }}
                  type="button"
                >
                  {index + 1}
                </button>
              ))}
              <button 
                className="slideshow-pagination-next"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (currentSlide < images.length - 1) {
                    setCurrentSlide(currentSlide + 1);
                  }
                }}
                disabled={currentSlide === images.length - 1}
                type="button"
                style={{ pointerEvents: 'auto' }}
                dangerouslySetInnerHTML={{ __html: nextText || '&gt;' }}
              />
            </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}