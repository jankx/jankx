import { registerBlockType, registerBlockVariation } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import Edit from './edit';
import './style.scss';
import './editor.scss';

registerBlockType('jankx/star-rating', {
    edit: Edit,
    save: () => null, // Dynamic block
});

registerBlockVariation('jankx/star-rating', {
    name: 'stars',
    title: __('Stars', 'jankx'),
    description: __('Show star icons (★★★★☆)', 'jankx'),
    icon: 'star-filled',
    attributes: {
        displayStyle: 'stars',
    },
    isActive: (attributes) => attributes.displayStyle === 'stars',
    scope: ['block', 'inserter'],
});

registerBlockVariation('jankx/star-rating', {
    name: 'summary',
    title: __('Summary', 'jankx'),
    description: __('Show single star + score + count (★ 4.6 (123))', 'jankx'),
    icon: 'star-half',
    attributes: {
        displayStyle: 'summary',
        showCount: true,
    },
    isActive: (attributes) => attributes.displayStyle === 'summary',
    scope: ['block', 'inserter'],
});
