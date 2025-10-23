import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import { SlideshowContainerAttributes } from './types';

export default function Edit({ attributes }: { attributes: SlideshowContainerAttributes }) {
  const blockProps = useBlockProps({
    className: 'slideshow-container-block'
  });

  const innerBlocksProps = useInnerBlocksProps(blockProps, {
    allowedBlocks: ['jankx/slideshow-item'],
    template: [['jankx/slideshow-item']],
    renderAppender: false
  });

  return <div {...innerBlocksProps} />;
}

