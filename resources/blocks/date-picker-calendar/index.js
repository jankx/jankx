import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import Edit from './edit';
import './style.scss';

registerBlockType('jankx/date-picker-calendar', {
    edit: Edit,
    save: () => null, // Dynamic block, rendered server-side
});

