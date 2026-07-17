import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
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
  deprecated: [
    // v2 → v3: Added full InnerBlocks support with separated overlay layer
    {
      attributes: metadata.attributes,
      save: ({ attributes }: CarouselBannerProps) => {
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

        // v2 save: had overlay-content wrapper but no separate overlay div
        const slideContent = (
          <>
            {imageUrl && (
              <div
                className={`embla-banner__image image-size-${imageSize}`}
                style={imageStyles}
                role="img"
                aria-label={imageAlt || undefined}
              />
            )}
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

        return <div {...blockProps}>{slideContent}</div>;
      },
      migrate: (attributes: any, innerBlocks: any) => {
        return [attributes, innerBlocks];
      }
    },
    // v1: Old format — image only, caption as text attribute, no innerBlocks
    {
      attributes: metadata.attributes,
      save: ({ attributes }: CarouselBannerProps) => {
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

        return <div {...blockProps}>{content}</div>;
      },
      migrate: (attributes: any) => {
        return [attributes, []];
      }
    },
    // v0: Oldest format — with .carousel-banner__content wrapper
    {
      attributes: metadata.attributes,
      save: ({ attributes }: CarouselBannerProps) => {
        const {
          imageUrl,
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

        return <div {...blockProps}>{content}</div>;
      },
      migrate: (attributes: any) => {
        return [attributes, []];
      }
    }
  ]
} as any);
