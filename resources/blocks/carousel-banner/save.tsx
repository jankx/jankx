import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import type { CarouselBannerProps } from './types';

export default function Save({ attributes }: CarouselBannerProps): JSX.Element {
  const {
    imageUrl,
    imageAlt,
    linkUrl,
    linkTarget,
    bannerStyle,
    overlayOpacity,
    overlayColor,
    textAlign,
    textPosition,
    imageSize = 'cover'
  } = attributes;

  const blockProps = useBlockProps.save({
    className: `embla__slide embla-banner embla-banner--${bannerStyle} text-${textAlign} text-position-${textPosition} image-size-${imageSize}`,
    'data-image-size': imageSize
  });

  const imageStyles: React.CSSProperties = {
    backgroundImage: imageUrl ? `url(${imageUrl})` : undefined,
    ...(imageSize === 'fullwidth'
      ? { backgroundSize: '100% 100%', backgroundPosition: 'center' }
      : imageSize === 'contain'
        ? { backgroundSize: 'contain' }
        : { backgroundSize: 'cover' }
    )
  };

  const slideContent = (
    <>
      {/* Background image layer */}
      {imageUrl && (
        <div
          className={`embla-banner__image image-size-${imageSize}`}
          style={imageStyles}
          role="img"
          aria-label={imageAlt || undefined}
        />
      )}

      {/* Dark color overlay */}
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

      {/* Inner blocks content (headings, paragraphs, search, etc.) */}
      <div className="embla-banner__overlay-content">
        <InnerBlocks.Content />
      </div>
    </>
  );

  if (linkUrl) {
    return (
      <div {...blockProps}>
        <a
          href={linkUrl}
          target={linkTarget}
          rel={linkTarget === '_blank' ? 'noopener noreferrer' : undefined}
          className="embla-banner__link"
        >
          {slideContent}
        </a>
      </div>
    );
  }

  return (
    <div {...blockProps}>
      {slideContent}
    </div>
  );
}
