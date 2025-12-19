import { registerBlockType } from '@wordpress/blocks';
import Edit from './edit';
import './style.scss';
import './editor.scss';
registerBlockType('jankx/star-rating', {
    edit: Edit,
    save: () => null, // Dynamic block
});
