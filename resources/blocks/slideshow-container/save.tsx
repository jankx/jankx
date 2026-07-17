import { InnerBlocks } from '@wordpress/block-editor';
import type { BlockSaveProps } from '@wordpress/blocks';
import type { SlideshowContainerAttributes } from './types';

export default function Save({ attributes }: BlockSaveProps<SlideshowContainerAttributes>) {
  return <InnerBlocks.Content />;
}

