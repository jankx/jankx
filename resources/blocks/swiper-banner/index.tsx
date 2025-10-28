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
  save: Save
} as any);
