/**
 * Jankx Blocks Bridge
 *
 * Bridges existing Jankx blocks with jankx/gutenberg-controls
 * Allows blocks in resources/blocks to use enhanced controls.
 */

import { useMemo, useEffect } from '@wordpress/element';
import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';

const EMPTY_OBJECT = {};

/**
 * Check if block supports enhanced controls
 */
const supportsEnhancedControls = (blockName) => {
    const supportedBlocks = [
        'jankx/advanced-button',
        'jankx/advanced-image-box',
        'jankx/section',
        'jankx/divider',
        'jankx/modal',
        'jankx/slideshow',
        'jankx/sticky-box',
        'jankx/wrapper',
        'jankx/carousel',
    ];

    return supportedBlocks.some((name) => blockName.startsWith(name));
};

/**
 * Add jankxControls attribute to blocks
 */
addFilter(
    'blocks.registerBlockType',
    'jankx/blocks/add-controls-attribute',
    (settings, name) => {
        if (!supportsEnhancedControls(name)) {
            return settings;
        }

        return {
            ...settings,
            attributes: {
                ...settings.attributes,
                jankxControls: {
                    type: 'object',
                    default: {},
                },
            },
        };
    }
);

/**
 * Live preview for blocks
 */
const withLivePreview = createHigherOrderComponent((BlockEdit) => {
    return (props) => {
        const { name, clientId, attributes } = props;

        if (!supportsEnhancedControls(name)) {
            return <BlockEdit {...props} />;
        }

        const jankxControls = useMemo(
            () => attributes.jankxControls || EMPTY_OBJECT,
            [attributes.jankxControls]
        );

        const cssVariables = useMemo(() => {
            const vars = {};
            Object.entries(jankxControls).forEach(([controlName, value]) => {
                if (!value || typeof value !== 'object') return;

                if (value.colorType === 'solid' && value.solidColor) {
                    vars[`--jankx-${clientId}-${controlName}-color`] = value.solidColor;
                }
                if (value.colorType === 'gradient') {
                    const stops = (value.gradientColors || [])
                        .map((s) => `${s.color} ${s.position}%`)
                        .join(', ');
                    if (stops) {
                        vars[`--jankx-${clientId}-${controlName}-gradient`] =
                            value.gradientType === 'linear'
                                ? `linear-gradient(${value.gradientAngle || 90}deg, ${stops})`
                                : `radial-gradient(circle, ${stops})`;
                    }
                }
                if (value.fontSize) {
                    vars[`--jankx-${clientId}-${controlName}-font-size`] = value.fontSize;
                }
                if (value.fontWeight) {
                    vars[`--jankx-${clientId}-${controlName}-font-weight`] = value.fontWeight;
                }
                if (value.padding) {
                    vars[`--jankx-${clientId}-${controlName}-padding`] = value.padding;
                }
                if (value.margin) {
                    vars[`--jankx-${clientId}-${controlName}-margin`] = value.margin;
                }
                if (value.shadowType && value.shadowType !== 'none') {
                    const shadows = {
                        xs: '0 1px 2px 0 rgba(0,0,0,0.05)',
                        sm: '0 1px 3px 0 rgba(0,0,0,0.1)',
                        md: '0 4px 6px -1px rgba(0,0,0,0.1)',
                        lg: '0 10px 15px -3px rgba(0,0,0,0.1)',
                        xl: '0 20px 25px -5px rgba(0,0,0,0.1)',
                    };
                    if (shadows[value.shadowType]) {
                        vars[`--jankx-${clientId}-${controlName}-shadow`] =
                            shadows[value.shadowType];
                    }
                }
            });
            return vars;
        }, [jankxControls, clientId]);

        useEffect(() => {
            const blockElement = document.querySelector(`[data-block="${clientId}"]`);
            if (blockElement) {
                Object.entries(cssVariables).forEach(([prop, val]) => {
                    blockElement.style.setProperty(prop, val);
                });
            }

            return () => {
                if (blockElement) {
                    Object.keys(cssVariables).forEach((prop) => {
                        blockElement.style.removeProperty(prop);
                    });
                }
            };
        }, [cssVariables, clientId]);

        return <BlockEdit {...props} />;
    };
}, 'withLivePreview');

// Register live preview filter
addFilter(
    'editor.BlockEdit',
    'jankx/blocks/with-live-preview',
    withLivePreview
);

console.log('Jankx Blocks Bridge: Enhanced controls loaded');
