import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps } from '@wordpress/block-editor';
import Edit from './edit';
import Save from './save';
import metadata from './block.json';
import './style.scss';
import './editor.scss';
import type { CarouselBannerProps } from './types';

registerBlockType(metadata.name, {
  ...metadata,
  edit: Edit,
  save: Save,
  // Migration to remove .carousel-banner__content wrapper from old blocks
  migrate: (attributes: any, innerBlocks: any) => {
    return [attributes, innerBlocks];
  },
  // Deprecated version to handle old HTML structure with .carousel-banner__content
  deprecated: [
    {
      attributes: metadata.attributes,
      save: ({ attributes }: CarouselBannerProps) => {
        // OLD save function that included .carousel-banner__content wrapper
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
          showCaption,
          imageSize = 'cover'
        } = attributes;

        const blockProps = useBlockProps.save({
          className: `embla__slide embla-banner embla-banner--${bannerStyle} text-${textAlign} text-position-${textPosition} image-size-${imageSize}`
        });

        const imageStyles: React.CSSProperties = {
          backgroundImage: `url(${imageUrl})`,
          '--overlay-color': overlayColor,
          '--overlay-opacity': overlayOpacity
        };

        if (imageSize === 'fullwidth') {
          imageStyles.backgroundSize = '100% 100%';
          imageStyles.backgroundPosition = 'center';
        } else if (imageSize === 'contain') {
          imageStyles.backgroundSize = 'contain';
        } else {
          imageStyles.backgroundSize = 'cover';
        }

        const imageContent = (
          <div 
            className={`embla-banner__image image-size-${imageSize}`}
            style={imageStyles}
          >
            <div className="embla-banner__overlay"></div>
            
            {showCaption && imageCaption && (
              <div className="embla-banner__caption">
                <div className="embla-banner__caption-content">
                  {imageCaption}
                </div>
              </div>
            )}
          </div>
        );

        // OLD structure with .carousel-banner__content wrapper
        const content = (
          <div className="embla-banner__content">
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
      },
      // Migration function: attributes stay the same, WordPress will use new save function
      migrate: (attributes: any) => {
        return attributes;
      }
    }
  ]
} as any);
