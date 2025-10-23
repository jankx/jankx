import { InnerBlocks } from '@wordpress/block-editor';
import type { BlockSaveProps } from '@wordpress/blocks';
import type { SlideshowItemAttributes } from './types';

export default function Save({ attributes }: BlockSaveProps<SlideshowItemAttributes>) {
  return <InnerBlocks.Content />;
}

