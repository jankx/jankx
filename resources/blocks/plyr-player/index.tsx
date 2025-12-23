import { registerBlockType } from '@wordpress/blocks';
import metadata from './block.json';
import Edit from './edit';
import './style.scss';
import './editor.scss';

registerBlockType(metadata.name, {
  ...metadata,
  edit: Edit,
  save: () => null
} as any);
