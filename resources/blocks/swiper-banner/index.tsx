import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps } from '@wordpress/block-editor';
import Edit from './edit';
import Save from './save';
import metadata from './block.json';
import './style.scss';
import './editor.scss';
import type { SwiperBannerProps } from './types';

registerBlockType(metadata.name, {
  ...metadata,
  edit: Edit,
  save: Save,
  // Migration to remove .swiper-banner__content wrapper from old blocks
  migrate: (attributes: any, innerBlocks: any) => {
    return [attributes, innerBlocks];
  },
  // Deprecated version to handle old HTML structure with .swiper-banner__content
  deprecated: [
    {
      attributes: metadata.attributes,
      save: ({ attributes }: SwiperBannerProps) => {
        // OLD save function that included .swiper-banner__content wrapper
        // This matches the old HTML structure in database
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

        const imageContent = (
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

        // OLD structure with .swiper-banner__content wrapper
        const content = (
          <div className="swiper-banner__content">
            {imageContent}
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
      },
      // Migration function: attributes stay the same, WordPress will use new save function
      migrate: (attributes: any) => {
        return attributes;
      }
    }
  ]
} as any);
