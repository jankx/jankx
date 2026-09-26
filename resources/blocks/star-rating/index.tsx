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

/**
 * "Google Summary" preset — mimics the Google Maps / Play Store rating chip:
 *   ★  4.6  (39,092)
 * - Single filled star in green
 * - Bold score number in dark color
 * - Review count in parentheses, light grey
 */
registerBlockVariation('jankx/star-rating', {
    name: 'google-summary',
    title: __('Google Summary', 'jankx'),
    description: __('Single green star with bold score and review count — e.g. ★ 4.6 (39,092)', 'jankx'),
    icon: 'star-filled',
    attributes: {
        displayStyle: 'summary',
        showCount: true,
        starColor: '#5b8e29',
        starEmptyColor: '#dddddd',
        starSize: 20,
        className: 'is-style-google-summary',
    },
    isActive: (attributes) =>
        attributes.displayStyle === 'summary' &&
        attributes.className === 'is-style-google-summary',
    scope: ['block', 'inserter'],
});

/**
 * "Compact Stars" preset — small inline stars, no count, yellow.
 * Useful inside cards / list items.
 */
registerBlockVariation('jankx/star-rating', {
    name: 'compact-stars',
    title: __('Compact Stars', 'jankx'),
    description: __('Small inline star icons, no count — ideal for cards', 'jankx'),
    icon: 'star-filled',
    attributes: {
        displayStyle: 'stars',
        showCount: false,
        starSize: 12,
        starColor: '#f1c40f',
        starEmptyColor: '#dddddd',
        className: 'is-style-compact-stars',
    },
    isActive: (attributes) =>
        attributes.displayStyle === 'stars' &&
        attributes.className === 'is-style-compact-stars',
    scope: ['block', 'inserter'],
});
