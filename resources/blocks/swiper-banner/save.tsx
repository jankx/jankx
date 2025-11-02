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
    showCaption
  } = attributes;

  const blockProps = useBlockProps.save({
    className: `swiper-slide swiper-banner swiper-banner--${bannerStyle} text-${textAlign} text-position-${textPosition}`
  });

  const content = (
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
  );

  if (linkUrl) {
    return (
      <div {...blockProps}>
        <a 
          href={linkUrl}
          target={linkTarget}
          rel={linkTarget === '_blank' ? 'noopener noreferrer' : undefined}
          className="swiper-banner__link"
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
