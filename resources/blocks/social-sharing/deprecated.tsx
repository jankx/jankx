/**
 * Deprecated versions of the social-sharing block.
 *
 * v1 stored the visual style in a `style` attribute rendered as
 * `social-sharing-block alignment-*`. The current version uses standard
 * WordPress style variations, so the style is carried by the `is-style-*`
 * class that `useBlockProps.save()` emits.
 */

import { InnerBlocks } from '@wordpress/block-editor';

import metadata from './block.json';

const { attributes } = metadata;

const v1Attributes = {
    ...attributes,
    style: {
        type: 'string',
        default: 'default',
    },
};

type SharingAttributes = {
    alignment?: string;
    showHeading?: boolean;
    headingText?: string;
};

const v1 = {
    attributes: v1Attributes,
    save: ({ attributes }: { attributes: SharingAttributes }) => {
        const {
            alignment = 'left',
            showHeading = true,
            headingText = 'Chia sẻ:',
        } = attributes;

        return (
            <div
                className={`wp-block-jankx-social-sharing social-sharing-block alignment-${alignment}`}
            >
                {showHeading && headingText && (
                    <div className="sharing-title">
                        <strong>{headingText}</strong>
                    </div>
                )}
                <div className="sharing-buttons">
                    <InnerBlocks.Content />
                </div>
            </div>
        );
    },
};

export default [v1];
