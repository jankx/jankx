import { image } from '@wordpress/icons';
import { registerBlockType } from '@wordpress/blocks';
import metadata from '../block.json';
import edit from './edit';
import './style.scss';
import './editor.scss';

const { name } = metadata;

export { metadata, name };

export const settings = {
	icon: image,
	edit,
};

registerBlockType( name, settings );
