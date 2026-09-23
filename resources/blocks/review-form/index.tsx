import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import Edit from './edit';
import Save from './save';
import metadata from './block.json';

registerBlockType(metadata.name, {
    ...metadata,
    title: __('Review Form', 'jankx'),
    description: __('Star rating submission form for users to leave reviews.', 'jankx'),
    edit: Edit,
    save: Save,
});
