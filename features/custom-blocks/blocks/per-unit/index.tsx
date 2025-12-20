import { registerBlockType } from '@wordpress/blocks';
// @ts-ignore
import blockJson from './block.json';

registerBlockType(blockJson.name, {
  edit: () => null,
  save: () => null,
});

