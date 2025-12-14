import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl, ToggleControl, RangeControl, TextControl } from '@wordpress/components';
import { useMemo } from '@wordpress/element';
import './style.scss';
import './editor.scss';

interface DynamicDataSSRAttributes {
    contentLoopLayout?: string;
    thumbnailPosition?: 'top' | 'bottom' | 'left' | 'right';
    imageRatio?: string;
    itemSpacing?: 'none' | 'compact' | 'normal' | 'loose';
    showItemBorder?: boolean;
    itemBorderRadius?: number;
    showExcerpt?: boolean;
    excerptLength?: number;
}

declare global {
    interface Window {
        jankxDynamicDataContentLoopLayouts?: {
            layoutsByPostType: Record<string, Array<{ name: string; title: string }>>;
            commonLayouts: Array<{ name: string; title: string }>;
        };
    }
}

export default function Edit({ attributes, setAttributes, context }: any) {
    const {
        contentLoopLayout = 'default',
        thumbnailPosition = 'top',
        imageRatio = '',
        itemSpacing = 'normal',
        showItemBorder = false,
        itemBorderRadius = 0,
        showExcerpt = true,
        excerptLength = 55,
    } = attributes as DynamicDataSSRAttributes;

    const postType = (context?.postType as string) || 'post';
    const layoutsData = window.jankxDynamicDataContentLoopLayouts || {
        layoutsByPostType: {},
        commonLayouts: [],
    };

    const layoutOptions = useMemo(() => {
        const common = layoutsData.commonLayouts || [];
        const specific = (layoutsData.layoutsByPostType || {})[postType] || [];
        const merged = [...common];
        const names = new Set(merged.map((l) => l.name));
        for (const l of specific) {
            if (!names.has(l.name)) {
                merged.push(l);
            }
        }
        return merged.map((l) => ({ label: l.title || l.name, value: l.name }));
    }, [postType, layoutsData]);

    const blockProps = useBlockProps({
        className: `dynamic-data-ssr dynamic-data-ssr--${contentLoopLayout}`,
        ...(imageRatio && { 'data-image-ratio': imageRatio }),
    });

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('SSR Template Settings', 'jankx')} initialOpen={true}>
                    <SelectControl
                        label={__('Content Loop Layout', 'jankx')}
                        value={contentLoopLayout}
                        options={layoutOptions}
                        onChange={(value: string) => setAttributes({ contentLoopLayout: value })}
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
                        onChange={(value: string) => setAttributes({ itemSpacing: value })}
                    />
                    <ToggleControl
                        label={__('Show Item Border', 'jankx')}
                        checked={!!showItemBorder}
                        onChange={(value: boolean) => setAttributes({ showItemBorder: value })}
                    />
                    {!!showItemBorder && (
                        <RangeControl
                            label={__('Border Radius', 'jankx')}
                            value={itemBorderRadius}
                            onChange={(value?: number) => setAttributes({ itemBorderRadius: value || 0 })}
                            min={0}
                            max={50}
                        />
                    )}
                </PanelBody>

                <PanelBody title={__('Image Settings', 'jankx')} initialOpen={false}>
                    <SelectControl
                        label={__('Thumbnail Position', 'jankx')}
                        value={thumbnailPosition}
                        options={[
                            { label: __('Top', 'jankx'), value: 'top' },
                            { label: __('Bottom', 'jankx'), value: 'bottom' },
                            { label: __('Left', 'jankx'), value: 'left' },
                            { label: __('Right', 'jankx'), value: 'right' },
                        ]}
                        onChange={(value: string) => setAttributes({ thumbnailPosition: value })}
                    />
                    <TextControl
                        label={__('Image Ratio (e.g. 16/9)', 'jankx')}
                        value={imageRatio}
                        onChange={(value: string) => setAttributes({ imageRatio: value })}
                    />
                </PanelBody>

                <PanelBody title={__('Content Settings', 'jankx')} initialOpen={false}>
                    <ToggleControl
                        label={__('Show Excerpt', 'jankx')}
                        checked={!!showExcerpt}
                        onChange={(value: boolean) => setAttributes({ showExcerpt: value })}
                    />
                    {!!showExcerpt && (
                        <RangeControl
                            label={__('Excerpt Length', 'jankx')}
                            value={excerptLength}
                            onChange={(value?: number) => setAttributes({ excerptLength: value || 55 })}
                            min={10}
                            max={200}
                        />
                    )}
                </PanelBody>
            </InspectorControls>
            <div {...blockProps}>
                {/* SSR block: editor does not render items; server renders on frontend */}
            </div>
        </>
    );
}

