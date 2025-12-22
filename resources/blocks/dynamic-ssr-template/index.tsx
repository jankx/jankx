import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl, ToggleControl, RangeControl, TextControl } from '@wordpress/components';
import { useMemo, useEffect, useState } from '@wordpress/element';
import metadata from './block.json';
import './style.scss';
import './editor.scss';

interface DynamicSsrTemplateAttributes {
    templateSlug?: string;
    thumbnailPosition?: 'top' | 'bottom' | 'left' | 'right';
    imageRatio?: string;
    itemSpacing?: 'none' | 'compact' | 'normal' | 'loose';
    showItemBorder?: boolean;
    itemBorderRadius?: number;
    showExcerpt?: boolean;
    excerptLength?: number;
    showTitle?: boolean;
    showDate?: boolean;
    showAuthor?: boolean;
    showPrice?: boolean;
    showAddToCart?: boolean;
    showRating?: boolean;
}

interface ContentLoopLayoutOption {
    name: string;
    title: string;
}

declare global {
    interface Window {
        jankxDynamicDataContentLoopLayouts?: {
            layoutsByPostType: Record<string, ContentLoopLayoutOption[]>;
            commonLayouts: ContentLoopLayoutOption[];
        };
        jankxDynamicSsrTemplate?: {
            nonce: string;
            postsCountNonce: string;
            ajaxUrl: string;
            availableTemplates?: Array<{ slug: string; title: string; description?: string }>;
        };
    }
}

function Edit({ attributes, setAttributes, context }: any) {
    const {
        templateSlug = 'layouts/loop/item-default',
        thumbnailPosition = 'top',
        imageRatio = '',
        itemSpacing = 'normal',
        showItemBorder = false,
        itemBorderRadius = 0,
        showExcerpt = true,
        excerptLength = 55,
        showTitle = true,
        showDate = true,
        showAuthor = false,
        showPrice = true,
        showAddToCart = true,
        showRating = false,
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

    // Template options from views directory
    const templateOptions = useMemo(() => {
        const availableTemplates = window.jankxDynamicSsrTemplate?.availableTemplates || [];
        
        // Default template options
        const defaultTemplates = [
            { label: __('Default Loop Item', 'jankx'), value: 'layouts/loop/item-default' },
            { label: __('Large Item', 'jankx'), value: 'post-layouts/large-item' },
            { label: __('Thumbnail Only', 'jankx'), value: 'post-layouts/thumbnail' },
            { label: __('Term Item', 'jankx'), value: 'post-layouts/term-item' },
        ];

        // Add available templates from PHP
        const phpTemplates = availableTemplates.map((template: { slug: string; title: string; description?: string }) => ({
            label: template.title,
            value: template.slug,
        }));

        return [...defaultTemplates, ...phpTemplates];
    }, []);

    const [previewHtml, setPreviewHtml] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const blockProps = useBlockProps({
        className: `dynamic-ssr-template dynamic-ssr-template--${templateSlug.replace('/', '-')}`,
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
            templateSlug,
            thumbnailPosition,
            imageRatio,
            itemSpacing,
            showItemBorder,
            itemBorderRadius,
            showExcerpt,
            excerptLength,
            showTitle,
            showDate,
            showAuthor,
            showPrice,
            showAddToCart,
            showRating,
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
        templateSlug,
        thumbnailPosition,
        imageRatio,
        itemSpacing,
        showItemBorder,
        itemBorderRadius,
        showExcerpt,
        excerptLength,
        showTitle,
        showDate,
        showAuthor,
        showPrice,
        showAddToCart,
        showRating,
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
                        label={__('Template File', 'jankx')}
                        value={templateSlug}
                        options={templateOptions}
                        onChange={(value: string) => setAttributes({ templateSlug: value })}
                        help={__('Template file from views directory. Can be overridden in child theme.', 'jankx')}
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
                        label={__('Show Title', 'jankx')}
                        checked={!!showTitle}
                        onChange={(value: boolean) => setAttributes({ showTitle: value })}
                    />
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
                    <ToggleControl
                        label={__('Show Date', 'jankx')}
                        checked={!!showDate}
                        onChange={(value: boolean) => setAttributes({ showDate: value })}
                    />
                    <ToggleControl
                        label={__('Show Author', 'jankx')}
                        checked={!!showAuthor}
                        onChange={(value: boolean) => setAttributes({ showAuthor: value })}
                    />
                </PanelBody>
                {(postType === 'product' || postType === 'tour') && (
                    <PanelBody title={__('Commerce Settings', 'jankx')} initialOpen={false}>
                        <ToggleControl
                            label={__('Show Price', 'jankx')}
                            checked={!!showPrice}
                            onChange={(value: boolean) => setAttributes({ showPrice: value })}
                        />
                        <ToggleControl
                            label={__('Show Add to Cart', 'jankx')}
                            checked={!!showAddToCart}
                            onChange={(value: boolean) => setAttributes({ showAddToCart: value })}
                        />
                        <ToggleControl
                            label={__('Show Rating', 'jankx')}
                            checked={!!showRating}
                            onChange={(value: boolean) => setAttributes({ showRating: value })}
                        />
                    </PanelBody>
                )}
            </InspectorControls>
            <div {...blockProps}>
                {loading ? (
                    <div style={{ padding: '12px' }}>{__('Loading preview…', 'jankx')}</div>
                ) : previewHtml ? (
                    <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
                ) : (
                    <div style={{ padding: '12px' }}>
                        {__('Template:', 'jankx')} {templateSlug}<br />
                        {__('No preview available', 'jankx')}
                    </div>
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

