/**
 * Deprecated versions of the social-sharing-icon block.
 *
 * v1 rendered a <button> carrying a `style-{iconStyle}` class and had no href.
 * The current version renders an <a> with a real share href and no longer takes
 * `iconStyle`, because the visual style now comes from the parent block's style
 * variation.
 */

import { InnerBlocks } from '@wordpress/block-editor';

import metadata from './block.json';
import { getNetworkData } from './networks';

const { attributes } = metadata;

const v1Attributes = {
    ...attributes,
    iconStyle: {
        type: 'string',
        default: 'default',
    },
};

type IconAttributes = {
    network?: string;
    iconStyle?: string;
    iconSize?: string;
    showLabel?: boolean;
    customIcon?: string;
    customLabel?: string;
};

const v1 = {
    attributes: v1Attributes,
    save: ({ attributes }: { attributes: IconAttributes }) => {
        const {
            network = 'facebook',
            iconStyle = 'default',
            iconSize = 'medium',
            showLabel = true,
            customIcon = '',
            customLabel = '',
        } = attributes;

        const networkData = getNetworkData(network);
        const displayIcon = customIcon || networkData.icon;
        const displayLabel = customLabel || networkData.label;

        return (
            <div className="wp-block-jankx-social-sharing-icon social-sharing-icon-block">
                <button
                    className={`sharing-icon-button ${network} style-${iconStyle} size-${iconSize}`}
                    data-network={network}
                    type="button"
                >
                    <span
                        className="sharing-icon sharing-icon-with-fallback"
                        data-fallback-icon={displayIcon}
                    >
                        <InnerBlocks.Content />
                    </span>
                    {showLabel && <span className="sharing-label">{displayLabel}</span>}
                </button>
            </div>
        );
    },
};

export default [v1];
