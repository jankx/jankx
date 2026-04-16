/**
 * Jankx Blocks Bridge
 *
 * Bridges existing Jankx blocks with jankx/gutenberg-controls
 * Allows blocks in resources/blocks to use enhanced controls.
 */

import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

// Import controls from gutenberg-controls package
const {
    ColorControl,
    TypographyControl,
    VisualSpacingControl,
    ResponsiveControl,
    ShadowControl,
    IconPickerControl,
    AnimationControl,
} = window.jankxGutenbergControls || {};

/**
 * Map control types to components
 */
const CONTROL_COMPONENTS = {
    'jankx/color': ColorControl,
    'jankx/typography': TypographyControl,
    'jankx/visual-spacing': VisualSpacingControl,
    'jankx/responsive': ResponsiveControl,
    'jankx/shadow': ShadowControl,
    'jankx/icon': IconPickerControl,
    'jankx/icon-picker': IconPickerControl,
    'jankx/animation': AnimationControl,
};

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
        'jankx/swiper',
    ];

    return supportedBlocks.some((name) => blockName.startsWith(name));
};

/**
 * Get control configuration for block
 */
const getBlockControlsConfig = (blockName) => {
    const configs = window.jankxBlocks?.controls || {};
    return configs[blockName] || {};
};

/**
 * Render control based on type
 */
const renderControl = (controlName, config, value, onChange) => {
    const Component = CONTROL_COMPONENTS[config.type];

    if (!Component) {
        console.warn(`Control type ${config.type} not found for ${controlName}`);
        return null;
    }

    // Map config props to component props
    const props = {
        key: controlName,
        label: config.label || controlName,
        value: value || {},
        onChange: (newValue) => onChange(controlName, newValue),
    };

    // Add type-specific props
    switch (config.type) {
        case 'jankx/color':
            props.allowSolid = config.allowSolid !== false;
            props.allowGradient = config.allowGradient !== false;
            props.allowDuotone = config.allowDuotone !== false;
            props.allowAlpha = config.allowAlpha !== false;
            props.allowTheme = config.allowTheme !== false;
            break;

        case 'jankx/typography':
            props.allowFluid = config.allowFluid !== false;
            props.allowResponsive = config.allowResponsive !== false;
            break;

        case 'jankx/icon-picker':
        case 'jankx/icon':
            props.allowColor = config.allowColor !== false;
            props.allowSize = config.allowSize !== false;
            break;
    }

    return <Component {...props} />;
};

/**
 * Enhanced controls HOC
 */
const withEnhancedControls = createHigherOrderComponent((BlockEdit) => {
    return (props) => {
        const { name, attributes, setAttributes, isSelected } = props;

        // Only process supported blocks
        if (!supportsEnhancedControls(name)) {
            return <BlockEdit {...props} />;
        }

        // Get controls config
        const controlsConfig = getBlockControlsConfig(name);

        // No controls configured
        if (Object.keys(controlsConfig).length === 0) {
            return <BlockEdit {...props} />;
        }

        // Get current jankxControls
        const jankxControls = attributes.jankxControls || {};

        /**
         * Update control value
         */
        const updateControl = (controlName, value) => {
            setAttributes({
                jankxControls: {
                    ...jankxControls,
                    [controlName]: value,
                },
            });
        };

        /**
         * Group controls by category
         */
        const groupControlsByCategory = () => {
            const groups = {
                style: [],
                layout: [],
                effects: [],
            };

            Object.entries(controlsConfig).forEach(([controlName, config]) => {
                const category = config.category || 'style';
                if (groups[category]) {
                    groups[category].push([controlName, config]);
                }
            });

            return groups;
        };

        const controlGroups = groupControlsByCategory();

        return (
            <>
                <BlockEdit {...props} />

                {isSelected && (
                    <InspectorControls group="styles">
                        {/* Style Controls */}
                        {controlGroups.style.length > 0 && (
                            <PanelBody
                                title={__('Jankx Style', 'jankx')}
                                initialOpen={true}
                            >
                                {controlGroups.style.map(([controlName, config]) =>
                                    renderControl(
                                        controlName,
                                        config,
                                        jankxControls[controlName],
                                        updateControl
                                    )
                                )}
                            </PanelBody>
                        )}

                        {/* Layout Controls */}
                        {controlGroups.layout.length > 0 && (
                            <PanelBody
                                title={__('Jankx Layout', 'jankx')}
                                initialOpen={false}
                            >
                                {controlGroups.layout.map(([controlName, config]) =>
                                    renderControl(
                                        controlName,
                                        config,
                                        jankxControls[controlName],
                                        updateControl
                                    )
                                )}
                            </PanelBody>
                        )}

                        {/* Effects Controls */}
                        {controlGroups.effects.length > 0 && (
                            <PanelBody
                                title={__('Jankx Effects', 'jankx')}
                                initialOpen={false}
                            >
                                {controlGroups.effects.map(([controlName, config]) =>
                                    renderControl(
                                        controlName,
                                        config,
                                        jankxControls[controlName],
                                        updateControl
                                    )
                                )}
                            </PanelBody>
                        )}
                    </InspectorControls>
                )}
            </>
        );
    };
}, 'withEnhancedControls');

/**
 * Register filters
 */
addFilter(
    'editor.BlockEdit',
    'jankx/blocks/with-enhanced-controls',
    withEnhancedControls
);

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

        // Apply CSS variables for live preview
        const jankxControls = attributes.jankxControls || {};

        // Generate CSS variables
        const cssVariables = {};
        Object.entries(jankxControls).forEach(([controlName, value]) => {
            if (!value || typeof value !== 'object') return;

            // Color variables
            if (value.colorType === 'solid' && value.solidColor) {
                cssVariables[`--jankx-${clientId}-${controlName}-color`] = value.solidColor;
            }
            if (value.colorType === 'gradient') {
                const stops = (value.gradientColors || [])
                    .map((s) => `${s.color} ${s.position}%`)
                    .join(', ');
                if (stops) {
                    cssVariables[`--jankx-${clientId}-${controlName}-gradient`] =
                        value.gradientType === 'linear'
                            ? `linear-gradient(${value.gradientAngle || 90}deg, ${stops})`
                            : `radial-gradient(circle, ${stops})`;
                }
            }

            // Typography variables
            if (value.fontSize) {
                cssVariables[`--jankx-${clientId}-${controlName}-font-size`] = value.fontSize;
            }
            if (value.fontWeight) {
                cssVariables[`--jankx-${clientId}-${controlName}-font-weight`] = value.fontWeight;
            }

            // Spacing variables
            if (value.padding) {
                cssVariables[`--jankx-${clientId}-${controlName}-padding`] = value.padding;
            }
            if (value.margin) {
                cssVariables[`--jankx-${clientId}-${controlName}-margin`] = value.margin;
            }

            // Shadow variables
            if (value.shadowType && value.shadowType !== 'none') {
                const shadows = {
                    xs: '0 1px 2px 0 rgba(0,0,0,0.05)',
                    sm: '0 1px 3px 0 rgba(0,0,0,0.1)',
                    md: '0 4px 6px -1px rgba(0,0,0,0.1)',
                    lg: '0 10px 15px -3px rgba(0,0,0,0.1)',
                    xl: '0 20px 25px -5px rgba(0,0,0,0.1)',
                };
                if (shadows[value.shadowType]) {
                    cssVariables[`--jankx-${clientId}-${controlName}-shadow`] =
                        shadows[value.shadowType];
                }
            }
        });

        // Apply to block element
        useEffect(() => {
            const blockElement = document.querySelector(`[data-block="${clientId}"]`);
            if (blockElement) {
                Object.entries(cssVariables).forEach(([prop, val]) => {
                    blockElement.style.setProperty(prop, val);
                });
            }

            // Cleanup
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
