import { jsx as _jsx } from "react/jsx-runtime";
import { registerBlockType } from '@wordpress/blocks';
import { Icon } from '@wordpress/components';
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
/**
 * Internal dependencies
 */
import Edit from './edit';
import metadata from './block.json';
/**
 * Tab icon
 */
const tabIcon = () => (_jsx(Icon, { icon: _jsx("svg", { viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: _jsx("path", { d: "M4 4h7v7H4V4zm0 9h7v7H4v-7zm9-9h7v7h-7V4zm0 9h7v7h-7v-7z" }) }) }));
const deprecated = [
    {
        save: ({ attributes }) => {
            const { contentTextColor, contentBackgroundColor, contentGradient, } = attributes;
            const contentStyles = {};
            if (contentTextColor) {
                contentStyles.color = contentTextColor;
            }
            if (contentGradient) {
                contentStyles.background = contentGradient;
            }
            else if (contentBackgroundColor) {
                contentStyles.backgroundColor = contentBackgroundColor;
            }
            const blockProps = useBlockProps.save({
                className: 'smart-tab',
            });
            return (_jsx("div", { ...blockProps, children: _jsx("div", { className: "smart-tab__content", style: Object.keys(contentStyles).length > 0 ? contentStyles : undefined, children: _jsx(InnerBlocks.Content, {}) }) }));
        },
    },
];
/**
 * Register Smart Tab block
 */
registerBlockType(metadata.name, {
    ...metadata,
    icon: tabIcon,
    edit: Edit,
    save: () => _jsx(InnerBlocks.Content, {}),
    deprecated,
});
