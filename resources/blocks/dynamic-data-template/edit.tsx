import { __ } from '@wordpress/i18n';
import {
    useBlockProps,
    useInnerBlocksProps,
    InspectorControls,
} from '@wordpress/block-editor';
import {
    PanelBody,
    SelectControl,
    ToggleControl,
    RangeControl,
} from '@wordpress/components';
import { useMemo } from '@wordpress/element';
import { createBlock } from '@wordpress/blocks';

interface DynamicDataTemplateAttributes {
    contentLoopLayout: string;
    className?: string;
    itemSpacing?: string;
    showItemBorder?: boolean;
    itemBorderRadius?: number;
    itemPadding?: {
        top?: string;
        right?: string;
        bottom?: string;
        left?: string;
    };
}

interface DynamicDataTemplateEditProps {
    attributes: DynamicDataTemplateAttributes;
    setAttributes: (attributes: Partial<DynamicDataTemplateAttributes>) => void;
    clientId: string;
    context: {
        query?: {
            postType?: string;
        };
        postType?: string;
    };
}

interface ContentLoopLayoutOption {
    name: string;
    title: string;
    postType: string;
}

export default function Edit({
    attributes,
    setAttributes,
    clientId,
    context,
}: DynamicDataTemplateEditProps): JSX.Element {
    const {
        contentLoopLayout = 'default',
        itemSpacing = 'normal',
        showItemBorder = false,
        itemBorderRadius = 0,
    } = attributes;

    // Get post type from context
    const postType: string = context?.query?.postType || context?.postType || 'post';

    // Get layouts data from PHP
    const layoutsData = (window as any).jankxDynamicDataContentLoopLayouts || {
        layoutsByPostType: {},
        commonLayouts: [],
    };

    // Get available layouts for current post type
    const availableLayouts: ContentLoopLayoutOption[] = useMemo(() => {
        const layouts: ContentLoopLayoutOption[] = [];
        
        // Add common layouts
        if (layoutsData.commonLayouts) {
            layoutsData.commonLayouts.forEach((layoutInfo: ContentLoopLayoutOption) => {
                layouts.push(layoutInfo);
            });
        }
        
        // Add post type specific layouts
        if (layoutsData.layoutsByPostType && layoutsData.layoutsByPostType[postType]) {
            layoutsData.layoutsByPostType[postType].forEach((layoutInfo: ContentLoopLayoutOption) => {
                layouts.push(layoutInfo);
            });
        }
        
        return layouts;
    }, [postType, layoutsData]);

    // Layout options for SelectControl
    const layoutOptions = useMemo(() => {
        return availableLayouts.map((layoutInfo: ContentLoopLayoutOption) => ({
            label: layoutInfo.title || layoutInfo.name,
            value: layoutInfo.name,
        }));
    }, [availableLayouts]);

    // Get default blocks for post type
    const defaultBlocks = useMemo(() => {
        const defaultBlocksData = (window as any).jankxDynamicDataTemplateDefaultBlocks || {};
        return defaultBlocksData[postType] || [];
    }, [postType]);

    // Convert default blocks to template format
    const defaultTemplate = useMemo(() => {
        return defaultBlocks.map((blockConfig: { blockName: string; attrs: Record<string, unknown> }) => [
            blockConfig.blockName,
            blockConfig.attrs,
        ]);
    }, [defaultBlocks]);

    const blockProps = useBlockProps({
        className: `dynamic-data-template dynamic-data-template--${contentLoopLayout}`,
    });

    const innerBlocksProps = useInnerBlocksProps(
        {
            className: 'dynamic-data-template__inner-blocks',
        },
        {
            template: defaultTemplate.length > 0 ? defaultTemplate : undefined,
            templateLock: false, // Allow editing inner blocks
            allowedBlocks: undefined, // Allow all blocks
        }
    );

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Template Settings', 'jankx')} initialOpen={true}>
                    <SelectControl
                        label={__('Content Loop Layout', 'jankx')}
                        value={contentLoopLayout}
                        options={layoutOptions}
                        onChange={(value: string): void => setAttributes({ contentLoopLayout: value })}
                    />
                    <SelectControl
                        label={__('Item Spacing', 'jankx')}
                        value={itemSpacing}
                        options={[
                            { label: __('None', 'jankx'), value: 'none' },
                            { label: __('Compact', 'jankx'), value: 'compact' },
                            { label: __('Normal', 'jankx'), value: 'normal' },
                            { label: __('Loose', 'jankx'), value: 'loose' },
                        ]}
                        onChange={(value: string): void => setAttributes({ itemSpacing: value })}
                    />
                    <ToggleControl
                        label={__('Show Item Border', 'jankx')}
                        checked={showItemBorder}
                        onChange={(value: boolean): void => setAttributes({ showItemBorder: value })}
                    />
                    {showItemBorder && (
                        <RangeControl
                            label={__('Border Radius', 'jankx')}
                            value={itemBorderRadius}
                            onChange={(value: number | undefined): void => 
                                setAttributes({ itemBorderRadius: value || 0 })
                            }
                            min={0}
                            max={50}
                        />
                    )}
                </PanelBody>
            </InspectorControls>

            <div {...blockProps}>
                <div {...innerBlocksProps} />
            </div>
        </>
    );
}

