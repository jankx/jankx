import { __ } from '@wordpress/i18n';
import { addFilter } from '@wordpress/hooks';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, RangeControl } from '@wordpress/components';
import { createHigherOrderComponent } from '@wordpress/compose';
import { useSelect } from '@wordpress/data';

/**
 * Add jankxOrder attribute to all blocks
 */
addFilter(
    'blocks.registerBlockType',
    'jankx/child-order/attributes',
    (settings) => {
        if (!settings) return settings;

        return {
            ...settings,
            attributes: {
                ...settings.attributes,
                jankxOrder: {
                    type: 'object',
                    default: {}
                }
            }
        };
    }
);

/**
 * Add Order UI to Inspector Controls
 */
const withChildOrderControl = createHigherOrderComponent((BlockEdit) => {
    return (props: any) => {
        const { attributes, setAttributes, clientId } = props;
        const { jankxOrder } = attributes;

        const isVisible = useSelect((select: any) => {
            const blockEditor = select('core/block-editor');
            if (!blockEditor) return false;

            const { getBlockParents, getBlockName } = blockEditor;
            const parents = getBlockParents(clientId);

            if (!parents || parents.length < 2) return false;

            const parentId = parents[parents.length - 1];
            const grandParentId = parents[parents.length - 2];

            const parentName = getBlockName(parentId);
            const grandParentName = getBlockName(grandParentId);

            const allowedParents = ['core/columns', 'jankx/grid', 'jankx/stack', 'jankx/row'];

            // Check if Parent is a layout block AND Grandparent is a Wrapper
            return allowedParents.includes(parentName) && grandParentName === 'jankx/wrapper';
        }, [clientId]);

        if (!isVisible) {
            return <BlockEdit {...props} />;
        }

        const updateOrder = (device: string, value: number | undefined) => {
            setAttributes({
                jankxOrder: {
                    ...(jankxOrder || {}),
                    [device]: value
                }
            });
        };

        return (
            <>
                <BlockEdit {...props} />
                <InspectorControls>
                    <PanelBody title={__('Child Position (Order)', 'jankx')} initialOpen={false}>
                        <RangeControl
                            label={__('Order (Desktop)', 'jankx')}
                            value={jankxOrder?.desktop}
                            onChange={(val) => updateOrder('desktop', val)}
                            min={-10}
                            max={10}
                            allowReset
                        />
                        <RangeControl
                            label={__('Order (Tablet)', 'jankx')}
                            value={jankxOrder?.tablet}
                            onChange={(val) => updateOrder('tablet', val)}
                            min={-10}
                            max={10}
                            allowReset
                        />
                        <RangeControl
                            label={__('Order (Mobile)', 'jankx')}
                            value={jankxOrder?.mobile}
                            onChange={(val) => updateOrder('mobile', val)}
                            min={-10}
                            max={10}
                            allowReset
                        />
                    </PanelBody>
                </InspectorControls>
            </>
        );
    };
}, 'withChildOrderControl');

addFilter(
    'editor.BlockEdit',
    'jankx/child-order/controls',
    withChildOrderControl
);

/**
 * Apply Order style in Editor Preview
 */
const withChildOrderStyle = createHigherOrderComponent((BlockListBlock) => {
    return (props: any) => {
        const { attributes } = props;
        const { jankxOrder } = attributes;

        if (jankxOrder && (jankxOrder.desktop !== undefined || jankxOrder.tablet !== undefined || jankxOrder.mobile !== undefined)) {
            const style: any = {
                ...props.wrapperProps?.style,
            };

            if (jankxOrder.desktop !== undefined) style.order = jankxOrder.desktop;
            // Tablet/Mobile would need CSS media queries which are harder to inject via inline style here properly
            // but we can inject CSS variables
            if (jankxOrder.desktop !== undefined) style['--jankx-order-desktop'] = jankxOrder.desktop;
            if (jankxOrder.tablet !== undefined) style['--jankx-order-tablet'] = jankxOrder.tablet;
            if (jankxOrder.mobile !== undefined) style['--jankx-order-mobile'] = jankxOrder.mobile;

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
}, 'withChildOrderStyle');

addFilter(
    'editor.BlockListBlock',
    'jankx/child-order/style',
    withChildOrderStyle
);
