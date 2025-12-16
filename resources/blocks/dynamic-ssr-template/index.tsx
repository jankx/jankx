import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl, ToggleControl, RangeControl, TextControl } from '@wordpress/components';
import { useMemo, useEffect, useState } from '@wordpress/element';
import metadata from './block.json';
import './style.scss';
import './editor.scss';

interface DynamicSsrTemplateAttributes {
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
        jankxDynamicSsrTemplate?: {
            nonce: string;
            ajaxUrl: string;
        };
    }
}

function Edit({ attributes, setAttributes, context }: any) {
    const {
        contentLoopLayout = 'default',
        thumbnailPosition = 'top',
        imageRatio = '',
        itemSpacing = 'normal',
        showItemBorder = false,
        itemBorderRadius = 0,
        showExcerpt = true,
        excerptLength = 55,
    } = attributes as DynamicSsrTemplateAttributes;

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

    const [previewHtml, setPreviewHtml] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const blockProps = useBlockProps({
        className: `dynamic-ssr-template dynamic-ssr-template--${contentLoopLayout}`,
        ...(imageRatio && { 'data-image-ratio': imageRatio }),
    });

    useEffect(() => {
        const ajaxUrlRaw = window.jankxDynamicSsrTemplate?.ajaxUrl || '/wp-admin/admin-ajax.php';
        const nonce = window.jankxDynamicSsrTemplate?.nonce || '';
        let ajaxUrl = ajaxUrlRaw;
        if (ajaxUrl.startsWith('/')) {
            ajaxUrl = window.location.origin + ajaxUrl;
        } else if (!ajaxUrl.startsWith('http://') && !ajaxUrl.startsWith('https://')) {
            ajaxUrl = window.location.origin + '/' + ajaxUrl.replace(/^\//, '');
        }
        if (!nonce) {
            return;
        }
        const ssrAttrs = {
            contentLoopLayout,
            thumbnailPosition,
            imageRatio,
            itemSpacing,
            showItemBorder,
            itemBorderRadius,
            showExcerpt,
            excerptLength,
        };
        const parentAttrs = {
            postType: (context?.postType as string) || 'post',
            layout: (context?.displayLayout as string) || 'grid',
            postsPerPage: (context?.postsPerPage as number) || 6,
            columns: (context?.columns as number) || undefined,
            columnsTablet: (context?.columnsTablet as number) || undefined,
            columnsMobile: (context?.columnsMobile as number) || undefined,
            slidesToScroll: (context?.slidesToScroll as number) ?? undefined,
            loop: (context?.loop as boolean) ?? undefined,
            autoplay: (context?.autoplay as boolean) ?? undefined,
            autoplayDelay: (context?.autoplayDelay as number) ?? undefined,
            showArrows: (context?.showArrows as boolean) ?? undefined,
            showDots: (context?.showDots as boolean) ?? undefined,
            carouselAlign: (context?.carouselAlign as string) ?? undefined,
            carouselAxis: (context?.carouselAxis as string) ?? undefined,
            carouselDirection: (context?.carouselDirection as string) ?? undefined,
            carouselStartIndex: (context?.carouselStartIndex as number) ?? undefined,
            carouselDuration: (context?.carouselDuration as number) ?? undefined,
            carouselDragFree: (context?.carouselDragFree as boolean) ?? undefined,
            carouselDragThreshold: (context?.carouselDragThreshold as number) ?? undefined,
            carouselSkipSnaps: (context?.carouselSkipSnaps as boolean) ?? undefined,
            carouselContainScroll: (context?.carouselContainScroll as string) ?? undefined,
            carouselInViewThreshold: (context?.carouselInViewThreshold as number) ?? undefined,
        };
        const params = new URLSearchParams();
        params.append('action', 'jankx_dynamic_ssr_template_preview');
        params.append('nonce', nonce);
        params.append('attributes', JSON.stringify(ssrAttrs));
        params.append('parent_attributes', JSON.stringify(parentAttrs));
        setLoading(true);
        fetch(ajaxUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params,
            credentials: 'same-origin',
        })
            .then((res) => res.json())
            .then((data) => {
                if (data?.success && typeof data.data?.html === 'string') {
                    setPreviewHtml(data.data.html);
                } else {
                    setPreviewHtml('');
                }
            })
            .catch(() => {
                setPreviewHtml('');
            })
            .finally(() => setLoading(false));
    }, [
        contentLoopLayout,
        thumbnailPosition,
        imageRatio,
        itemSpacing,
        showItemBorder,
        itemBorderRadius,
        showExcerpt,
        excerptLength,
        context?.postType,
        context?.displayLayout,
        context?.postsPerPage,
        context?.columns,
        context?.columnsTablet,
        context?.columnsMobile,
        context?.slidesToScroll,
        context?.loop,
        context?.autoplay,
        context?.autoplayDelay,
        context?.showArrows,
        context?.showDots,
        context?.carouselAlign,
        context?.carouselAxis,
        context?.carouselDirection,
        context?.carouselStartIndex,
        context?.carouselDuration,
        context?.carouselDragFree,
        context?.carouselDragThreshold,
        context?.carouselSkipSnaps,
        context?.carouselContainScroll,
        context?.carouselInViewThreshold,
    ]);

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
                {loading ? (
                    <div style={{ padding: '12px' }}>{__('Loading preview…', 'jankx')}</div>
                ) : previewHtml ? (
                    <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
                ) : (
                    <div style={{ padding: '12px' }}>{__('No preview available', 'jankx')}</div>
                )}
            </div>
        </>
    );
}

registerBlockType(metadata.name, {
    ...metadata,
    edit: Edit as any,
    save: () => null,
} as any);

