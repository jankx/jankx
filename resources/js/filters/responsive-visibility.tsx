import { __ } from '@wordpress/i18n';
import { addFilter } from '@wordpress/hooks';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, ToggleControl } from '@wordpress/components';
import { createHigherOrderComponent } from '@wordpress/compose';
import { useSelect } from '@wordpress/data';

/**
 * Add responsive visibility attributes to all blocks
 */
addFilter(
    'blocks.registerBlockType',
    'jankx/responsive-visibility/attributes',
    (settings) => {
        if (!settings) return settings;

        return {
            ...settings,
            attributes: {
                ...settings.attributes,
                jankxHideOnPc: {
                    type: 'boolean',
                    default: false
                },
                jankxHideOnTablet: {
                    type: 'boolean',
                    default: false
                },
                jankxHideOnMobile: {
                    type: 'boolean',
                    default: false
                }
            }
        };
    }
);

/**
 * Add Responsive Visibility UI to Inspector Controls
 */
const withResponsiveVisibilityControl = createHigherOrderComponent((BlockEdit) => {
    return (props: any) => {
        const { attributes, setAttributes, clientId, name } = props;
        const { jankxHideOnPc, jankxHideOnTablet, jankxHideOnMobile } = attributes;

        // Only show for blocks inside jankx/wrapper
        const isInsideWrapper = useSelect((select: any) => {
            const blockEditor = select('core/block-editor');
            if (!blockEditor) return false;

            const { getBlockParents, getBlockName } = blockEditor;
            const parents = getBlockParents(clientId);

            // If the block itself is a wrapper, we might want to show it too 
            // but the request said "inner blocks". Let's show it for all blocks 
            // that are inside or IS the wrapper? 
            // Actually, if it's the wrapper itself, it already has its own hide settings in block.json
            if (name === 'jankx/wrapper') return false;

            return parents.some((parentId: string) => getBlockName(parentId) === 'jankx/wrapper');
        }, [clientId, name]);

        if (!isInsideWrapper) {
            return <BlockEdit {...props} />;
        }

        return (
            <>
                <BlockEdit {...props} />
                <InspectorControls>
                    <PanelBody title={__('Responsive Visibility', 'jankx')} initialOpen={false}>
                        <ToggleControl
                            label={__('Hide on PC', 'jankx')}
                            checked={!!jankxHideOnPc}
                            onChange={(val) => setAttributes({ jankxHideOnPc: val })}
                        />
                        <ToggleControl
                            label={__('Hide on Tablet', 'jankx')}
                            checked={!!jankxHideOnTablet}
                            onChange={(val) => setAttributes({ jankxHideOnTablet: val })}
                        />
                        <ToggleControl
                            label={__('Hide on Mobile', 'jankx')}
                            checked={!!jankxHideOnMobile}
                            onChange={(val) => setAttributes({ jankxHideOnMobile: val })}
                        />
                    </PanelBody>
                </InspectorControls>
            </>
        );
    };
}, 'withResponsiveVisibilityControl');

addFilter(
    'editor.BlockEdit',
    'jankx/responsive-visibility/controls',
    withResponsiveVisibilityControl
);

/**
 * Apply opacity in Editor Preview for hidden blocks
 */
const withResponsiveVisibilityStyle = createHigherOrderComponent((BlockListBlock) => {
    return (props: any) => {
        const { attributes } = props;
        const { jankxHideOnPc, jankxHideOnTablet, jankxHideOnMobile } = attributes;

        if (jankxHideOnPc || jankxHideOnTablet || jankxHideOnMobile) {
            const style: any = {
                ...props.wrapperProps?.style,
            };

            // In editor, we just dim it a bit to show it's "conditionally hidden"
            style.opacity = '0.5';
            style.border = '1px dashed #ccc';

            return (
                <BlockListBlock
                    {...props}
                    wrapperProps={{
                        ...props.wrapperProps,
                        style
                    }}
                />
            );
        }

        return <BlockListBlock {...props} />;
    };
}, 'withResponsiveVisibilityStyle');

addFilter(
    'editor.BlockListBlock',
    'jankx/responsive-visibility/style',
    withResponsiveVisibilityStyle
);
