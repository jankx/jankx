import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import Edit from './edit';
import Save from './save';
import metadata from './block.json';
import './style.scss';
import './editor.scss';

registerBlockType(metadata.name, {
  ...metadata,
  title: __('Embla Carousel', 'jankx'),
  edit: Edit,
  save: Save,
} as any);
