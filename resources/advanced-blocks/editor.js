import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { InspectorControls } from '@wordpress/block-editor';
import ResponsiveControls from './components/ResponsiveControls';

// Extend core blocks with responsive attributes
const addResponsiveAttributes = (settings) => {
    const { name } = settings;

    // Only extend specific core blocks
    if (!cheephubResponsiveBlocks.extendableBlocks.includes(name)) {
        return settings;
    }

    const responsiveAttributes = cheephubResponsiveBlocks.responsiveAttributes;
    const newAttributes = { ...settings.attributes };

    // Add responsive attributes for each type
    Object.keys(responsiveAttributes).forEach(type => {
        const deviceMappings = responsiveAttributes[type];

        Object.keys(deviceMappings).forEach(device => {
            if (device !== 'desktop') {
                const attributeName = deviceMappings[device];
                newAttributes[attributeName] = {
                    type: 'string',
                    default: ''
                };
            }
        });
    });

    // Add responsive controls flag
    newAttributes.responsiveControls = {
        type: 'object',
        default: {
            enabled: false,
            breakpoints: ['desktop', 'tablet', 'mobile']
        }
    };

    return {
        ...settings,
        attributes: newAttributes
    };
};

// Add responsive controls to block inspector
const withResponsiveControls = createHigherOrderComponent((BlockEdit) => {
    return (props) => {
        const { name, attributes, setAttributes } = props;

        // Only apply to extendable blocks
        if (!cheephubResponsiveBlocks.extendableBlocks.includes(name)) {
            return <BlockEdit {...props} />;
        }

        // Define controls based on block type
        const getControls = () => {
            switch (name) {
                case 'core/heading':
                    return [
                        {
                            type: 'range',
                            label: __('Font Size', 'cheephub'),
                            attribute: 'fontSize',
                            min: 12,
                            max: 72,
                            step: 1,
                            help: __('Set font size for different devices', 'cheephub')
                        },
                        {
                            type: 'unit',
                            label: __('Line Height', 'cheephub'),
                            attribute: 'lineHeight',
                            help: __('Set line height for different devices', 'cheephub')
                        },
                        {
                            type: 'unit',
                            label: __('Letter Spacing', 'cheephub'),
                            attribute: 'letterSpacing',
                            help: __('Set letter spacing for different devices', 'cheephub')
                        },
                        {
                            type: 'box',
                            label: __('Margin', 'cheephub'),
                            attribute: 'margin',
                            help: __('Set margin for different devices', 'cheephub')
                        },
                        {
                            type: 'box',
                            label: __('Padding', 'cheephub'),
                            attribute: 'padding',
                            help: __('Set padding for different devices', 'cheephub')
                        }
                    ];

                case 'core/paragraph':
                    return [
                        {
                            type: 'range',
                            label: __('Font Size', 'cheephub'),
                            attribute: 'fontSize',
                            min: 12,
                            max: 48,
                            step: 1,
                            help: __('Set font size for different devices', 'cheephub')
                        },
                        {
                            type: 'unit',
                            label: __('Line Height', 'cheephub'),
                            attribute: 'lineHeight',
                            help: __('Set line height for different devices', 'cheephub')
                        },
                        {
                            type: 'box',
                            label: __('Margin', 'cheephub'),
                            attribute: 'margin',
                            help: __('Set margin for different devices', 'cheephub')
                        },
                        {
                            type: 'box',
                            label: __('Padding', 'cheephub'),
                            attribute: 'padding',
                            help: __('Set padding for different devices', 'cheephub')
                        }
                    ];

                case 'core/button':
                    return [
                        {
                            type: 'range',
                            label: __('Font Size', 'cheephub'),
                            attribute: 'fontSize',
                            min: 12,
                            max: 24,
                            step: 1,
                            help: __('Set font size for different devices', 'cheephub')
                        },
                        {
                            type: 'box',
                            label: __('Padding', 'cheephub'),
                            attribute: 'padding',
                            help: __('Set padding for different devices', 'cheephub')
                        },
                        {
                            type: 'unit',
                            label: __('Border Radius', 'cheephub'),
                            attribute: 'borderRadius',
                            help: __('Set border radius for different devices', 'cheephub')
                        },
                        {
                            type: 'unit',
                            label: __('Width', 'cheephub'),
                            attribute: 'width',
                            help: __('Set width for different devices', 'cheephub')
                        }
                    ];

                case 'core/image':
                    return [
                        {
                            type: 'unit',
                            label: __('Width', 'cheephub'),
                            attribute: 'width',
                            help: __('Set width for different devices', 'cheephub')
                        },
                        {
                            type: 'unit',
                            label: __('Height', 'cheephub'),
                            attribute: 'height',
                            help: __('Set height for different devices', 'cheephub')
                        },
                        {
                            type: 'box',
                            label: __('Margin', 'cheephub'),
                            attribute: 'margin',
                            help: __('Set margin for different devices', 'cheephub')
                        },
                        {
                            type: 'unit',
                            label: __('Border Radius', 'cheephub'),
                            attribute: 'borderRadius',
                            help: __('Set border radius for different devices', 'cheephub')
                        }
                    ];

                case 'core/columns':
                    return [
                        {
                            type: 'box',
                            label: __('Margin', 'cheephub'),
                            attribute: 'margin',
                            help: __('Set margin for different devices', 'cheephub')
                        },
                        {
                            type: 'box',
                            label: __('Padding', 'cheephub'),
                            attribute: 'padding',
                            help: __('Set padding for different devices', 'cheephub')
                        },
                        {
                            type: 'unit',
                            label: __('Gap', 'cheephub'),
                            attribute: 'gap',
                            help: __('Set gap between columns for different devices', 'cheephub')
                        }
                    ];

                case 'core/group':
                    return [
                        {
                            type: 'box',
                            label: __('Margin', 'cheephub'),
                            attribute: 'margin',
                            help: __('Set margin for different devices', 'cheephub')
                        },
                        {
                            type: 'box',
                            label: __('Padding', 'cheephub'),
                            attribute: 'padding',
                            help: __('Set padding for different devices', 'cheephub')
                        },
                        {
                            type: 'unit',
                            label: __('Border Radius', 'cheephub'),
                            attribute: 'borderRadius',
                            help: __('Set border radius for different devices', 'cheephub')
                        }
                    ];

                case 'core/spacer':
                    return [
                        {
                            type: 'unit',
                            label: __('Height', 'cheephub'),
                            attribute: 'height',
                            help: __('Set height for different devices', 'cheephub')
                        }
                    ];

                default:
                    return [];
            }
        };

        const controls = getControls();

        return (
            <>
                <BlockEdit {...props} />
                <InspectorControls>
                    <ResponsiveControls
                        attributes={attributes}
                        setAttributes={setAttributes}
                        controls={controls}
                        title={__('Responsive Settings', 'cheephub')}
                        initialOpen={false}
                    />
                </InspectorControls>
            </>
        );
    };
}, 'withResponsiveControls');

// Apply filters
addFilter(
    'blocks.registerBlockType',
    'cheephub/add-responsive-attributes',
    addResponsiveAttributes
);

addFilter(
    'editor.BlockEdit',
    'cheephub/with-responsive-controls',
    withResponsiveControls
);
