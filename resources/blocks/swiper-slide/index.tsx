import { registerBlockType } from '@wordpress/blocks';
import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';
import Edit from './edit';
import metadata from './block.json';
import './style.scss';
import './editor.scss';
import type { SwiperSlideProps } from './types';

registerBlockType(metadata.name, {
  ...metadata,
  edit: Edit,
  save: ({ attributes }: SwiperSlideProps) => {
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
  }
} as any);
