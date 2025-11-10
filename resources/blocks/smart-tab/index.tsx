/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
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
const tabIcon = () => (
    <Icon icon={
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 4h7v7H4V4zm0 9h7v7H4v-7zm9-9h7v7h-7V4zm0 9h7v7h-7v-7z" />
        </svg>
    } />
);

const deprecated = [
    {
        save: ({ attributes }: any) => {
            const {
                contentTextColor,
                contentBackgroundColor,
                contentGradient,
            } = attributes;

            const contentStyles: Record<string, string> = {};
            if (contentTextColor) {
                contentStyles.color = contentTextColor;
            }
            if (contentGradient) {
                contentStyles.background = contentGradient;
            } else if (contentBackgroundColor) {
                contentStyles.backgroundColor = contentBackgroundColor;
            }

            const blockProps = useBlockProps.save({
                className: 'smart-tab',
            });

            return (
                <div {...blockProps}>
                    <div
                        className="smart-tab__content"
                        style={Object.keys(contentStyles).length > 0 ? contentStyles : undefined}
                    >
                        <InnerBlocks.Content />
                    </div>
                </div>
            );
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
    save: () => <InnerBlocks.Content />,
    deprecated,
} as any);

