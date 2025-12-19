/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { layout as icon } from '@wordpress/icons';
import { registerBlockType } from '@wordpress/blocks';
/**
 * Internal dependencies
 */
import edit from './edit';
import save from './save';
import metadata from './block.json';
const { name } = metadata;
export { metadata, name };
export const settings = {
    icon,
    example: {
        attributes: {
            triggerType: 'button',
            triggerText: 'Open Modal',
            modalSize: 'medium',
            showCloseButton: true,
            animationType: 'fade'
        },
        innerBlocks: [
            {
                name: 'core/heading',
                attributes: {
                    level: 3,
                    content: __('Modal Title', 'jankx')
                }
            },
            {
                name: 'core/paragraph',
                attributes: {
                    content: __('This is the modal content. You can add any blocks here.', 'jankx')
                }
            }
        ]
    },
    edit,
    save
};
registerBlockType(name, settings);
