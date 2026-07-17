import { registerBlockType } from '@wordpress/blocks';
import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';
import Edit from './edit';
import metadata from './block.json';
import './style.scss';
import './editor.scss';
import type { CarouselSlideProps } from './types';

registerBlockType(metadata.name, {
  ...metadata,
  edit: Edit,
  save: () => {
    return <InnerBlocks.Content />;
  },
  deprecated: [
    {
      attributes: {
        ...metadata.attributes,
      },
      save: ({ attributes }: CarouselSlideProps) => {
        const {
          imageSize = 'cover',
          overlayColor,
          overlayOpacity
        } = attributes;

        const blockProps = useBlockProps.save({
          className: `embla__slide image-size-${imageSize}`,
          'data-image-size': imageSize
        });

        const overlayStyle = overlayColor ? ({
          backgroundColor: overlayColor,
          opacity: (overlayOpacity ?? 40) / 100,
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 1
        } as React.CSSProperties) : undefined;

        return (
          <div {...blockProps}>
            {overlayColor && <div className="carousel-slide__overlay" style={overlayStyle}></div>}
            <div className="carousel-slide__content" style={{ position: 'relative', zIndex: 2 }}>
              <InnerBlocks.Content />
            </div>
          </div>
        );
      },
    },
    {
      attributes: {
        ...metadata.attributes,
      },
      save: ({ attributes }: any) => {
        const { imageSize = 'cover' } = attributes;
        const blockProps = useBlockProps.save({
          className: `embla__slide image-size-${imageSize}`,
          'data-image-size': imageSize
        });
        return (
          <div {...blockProps}>
            <InnerBlocks.Content />
          </div>
        );
      },
    }
  ]
} as any);
