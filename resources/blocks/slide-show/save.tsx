import { useBlockProps } from '@wordpress/block-editor';
import type { BlockSaveProps } from '@wordpress/blocks';
import type { SlideshowAttributes } from './types';

export default function Save({ attributes }: BlockSaveProps<SlideshowAttributes>) {
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
    enableLightbox
  } = attributes;

  const blockProps = useBlockProps.save({
    className: `slideshow-block ${enableLightbox ? 'photoswipe-enabled' : ''}`,
    style: {
      '--slideshow-height': `${mainImageHeight}px`,
      '--slideshow-transition-speed': `${transitionSpeed}ms`,
      '--slideshow-thumbnail-size': thumbnailSize === 'small' ? '60px' : thumbnailSize === 'large' ? '100px' : '80px',
    } as React.CSSProperties,
    'data-autoplay': autoplay,
    'data-autoplay-delay': autoplayDelay,
    'data-fullscreen': fullscreen,
    'data-show-thumbnails': showThumbnails,
    'data-show-navigation': showNavigation,
    'data-show-pagination': showPagination,
    'data-transition-effect': transitionEffect,
    'data-transition-speed': transitionSpeed,
    'data-enable-lightbox': enableLightbox,
  });

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div {...blockProps}>
      {/* Thumbnails */}
      {showThumbnails && (
        <div className="slideshow-thumbnails">
          {images.map((image, index) => (
            <button
              key={image.id}
              className={`slideshow-thumbnail ${index === 0 ? 'active' : ''}`}
              style={{
                width: `var(--slideshow-thumbnail-size)`,
                height: `var(--slideshow-thumbnail-size)`,
              }}
              data-index={index}
            >
              <img src={image.url} alt={image.alt} loading="lazy" />
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
                className={`slideshow-slide slideshow-caption-${captionPosition} ${index === 0 ? 'active' : ''}`}
                style={{
                  transform: transitionEffect === 'slide'
                    ? `translateX(${index * 100}%)`
                    : 'translateX(0)',
                  opacity: transitionEffect === 'fade'
                    ? (index === 0 ? 1 : 0)
                    : 1
                }}
              >
                <img src={image.url} alt={image.alt} loading={index === 0 ? 'eager' : 'lazy'} />
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
              aria-label="Previous slide"
            >
              ‹
            </button>
            <button
              className="slideshow-nav slideshow-nav-next"
              aria-label="Next slide"
            >
              ›
            </button>
          </>
        )}
      </div>

      {/* Footer Controls */}
      <div className="slideshow-footer">
        <div className="slideshow-controls">
          {fullscreen && (
            <button className="slideshow-fullscreen-btn">
              Fullscreen
            </button>
          )}
          {images.length > 1 && (
            <button className="slideshow-autoplay-btn">
              {autoplay ? 'Pause' : 'Play'}
            </button>
          )}
        </div>

        {showPagination && images.length > 1 && (
          <div className="slideshow-pagination">
            <button className="slideshow-pagination-prev" aria-label="Previous">
              ‹
            </button>
            {images.map((_, index) => (
              <button
                key={index}
                className={`slideshow-pagination-dot ${index === 0 ? 'active' : ''}`}
                aria-label={`Go to slide ${index + 1}`}
                data-index={index}
              >
                {index + 1}
              </button>
            ))}
            <button className="slideshow-pagination-next" aria-label="Next">
              ›
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

