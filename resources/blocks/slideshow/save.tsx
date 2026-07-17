import { InnerBlocks } from '@wordpress/block-editor';
import type { BlockSaveProps } from '@wordpress/blocks';
import type { SlideshowAttributes } from './types';

export default function Save({ attributes }: BlockSaveProps<SlideshowAttributes>) {
  return <InnerBlocks.Content />;
}

