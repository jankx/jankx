import { useBlockProps } from '@wordpress/block-editor';
import type { SwiperBannerProps } from './types';

export default function Save({ attributes }: SwiperBannerProps): JSX.Element {
  const {
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
    imageSize = 'cover'
  } = attributes;

  const blockProps = useBlockProps.save({
    className: `embla__slide embla-banner embla-banner--${bannerStyle} text-${textAlign} text-position-${textPosition} image-size-${imageSize}`,
    'data-image-size': imageSize
  });

  const imageStyles: React.CSSProperties = {
    backgroundImage: `url(${imageUrl})`,
    '--overlay-color': overlayColor,
    '--overlay-opacity': overlayOpacity
  };

  // Apply fullwidth styles
  if (imageSize === 'fullwidth') {
    imageStyles.backgroundSize = '100% 100%';
    imageStyles.backgroundPosition = 'center';
  } else if (imageSize === 'contain') {
    imageStyles.backgroundSize = 'contain';
  } else {
    imageStyles.backgroundSize = 'cover';
  }

  const content = (
    <div 
      className={`embla-banner__image image-size-${imageSize}`}
      style={imageStyles}
    >
      {showCaption && imageCaption && (
        <div className="embla-banner__caption">
          <div className="embla-banner__caption-content">
            {imageCaption}
          </div>
        </div>
      )}
    </div>
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
          {content}
        </a>
      </div>
    );
  }

  return (
    <div {...blockProps}>
      {content}
    </div>
  );
}
