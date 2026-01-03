import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl, ToggleControl, RangeControl, TextControl, Button } from '@wordpress/components';
import { MediaUpload } from '@wordpress/block-editor';
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
    overlayIcon?: string;
    overlayIconPosition?: 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    overlayIconSize?: number;
    overlayIconColor?: string;
    overlayIconBackground?: string;
    overlayIconShowMode?: 'always-show' | 'hover-hide' | 'hover-show';
    overlayIconTarget?: 'featured-image' | 'entire-item';
    overlayIconType?: 'class' | 'image' | 'text';
    overlayIconImageId?: number;
    overlayIconImageUrl?: string;
    overlayIconText?: string;
    overlayIconRotate?: number;
    showDate?: boolean;
    showAuthor?: boolean;
    showPrice?: boolean;
    showAddToCart?: boolean;
    showRating?: boolean;
    animationType?: string;
    animationDuration?: number;
    animationDelay?: number;
    animationTarget?: 'entry' | 'thumbnail';
    animationReverse?: boolean;
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
        overlayIcon = '',
        overlayIconPosition = 'center',
        overlayIconSize = 24,
        overlayIconColor = '#ffffff',
        overlayIconBackground = 'rgba(0, 0, 0, 0.5)',
        overlayIconShowMode = 'always-show',
        overlayIconTarget = 'featured-image',
        overlayIconType = 'class',
        overlayIconImageId = 0,
        overlayIconImageUrl = '',
        overlayIconText = '',
        overlayIconRotate = 0,
        showDate = true,
        showAuthor = false,
        showPrice = true,
        showAddToCart = true,
        showRating = false,
        animationType = 'none',
        animationDuration = 1000,
        animationDelay = 0,
        animationTarget = 'entry',
        animationReverse = false,
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
            overlayIcon,
            overlayIconPosition,
            overlayIconSize,
            overlayIconColor,
            overlayIconBackground,
            overlayIconShowMode,
            overlayIconTarget,
            overlayIconType,
            overlayIconImageId,
            overlayIconImageUrl,
            overlayIconText,
            overlayIconRotate,
            showDate,
            showAuthor,
            showPrice,
            showAddToCart,
            showRating,
            animationType,
            animationDuration,
            animationDelay,
            animationTarget,
            animationReverse,
        };

        const parentAttrs = {
            postType: (context?.postType as string) || 'post',
            layout: (context?.displayLayout as string) || 'grid',
            postsPerPage: (context?.postsPerPage as number) || 6,
            useMultiPostType: (context?.useMultiPostType as boolean) ?? undefined,
            postTypes: (context?.postTypes as string[]) ?? undefined,
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
            queryPreset: (context?.queryPreset as string) ?? undefined,
            includeStickyPosts: (context?.includeStickyPosts as boolean) ?? undefined,
            orderBy: (context?.orderBy as string) ?? undefined,
            order: (context?.order as string) ?? undefined,
            offset: (context?.offset as number) ?? undefined,
            taxQuery: (context?.taxQuery as any[]) ?? undefined,
            metaQuery: (context?.metaQuery as any[]) ?? undefined,
            keyword: (context?.keyword as string) ?? undefined,
            authorIn: (context?.authorIn as number[]) ?? undefined,
            authorNotIn: (context?.authorNotIn as number[]) ?? undefined,
            postIn: (context?.postIn as number[]) ?? undefined,
            postNotIn: (context?.postNotIn as number[]) ?? undefined,
            metaKey: (context?.metaKey as string) ?? undefined,
            metaType: (context?.metaType as string) ?? undefined,
            postStatus: (context?.postStatus as string[]) ?? undefined,
            postParent: (context?.postParent as number) ?? undefined,
            postParentIn: (context?.postParentIn as number[]) ?? undefined,
            postParentNotIn: (context?.postParentNotIn as number[]) ?? undefined,
            customQueryId: (context?.customQueryId as string) ?? undefined,
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
        overlayIcon,
        overlayIconPosition,
        overlayIconSize,
        overlayIconColor,
        overlayIconBackground,
        overlayIconShowMode,
        overlayIconTarget,
        overlayIconType,
        overlayIconImageId,
        overlayIconImageUrl,
        overlayIconText,
        overlayIconRotate,
        showDate,
        showAuthor,
        showPrice,
        showAddToCart,
        showRating,
        animationType,
        animationDuration,
        animationDelay,
        animationTarget,
        animationReverse,
        context?.postType,
        context?.useMultiPostType,
        context?.postTypes,
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
        context?.queryPreset,
        context?.includeStickyPosts,
        context?.orderBy,
        context?.order,
        context?.offset,
        context?.taxQuery,
        context?.metaQuery,
        context?.keyword,
        context?.authorIn,
        context?.authorNotIn,
        context?.postIn,
        context?.postNotIn,
        context?.metaKey,
        context?.metaType,
        context?.postStatus,
        context?.postParent,
        context?.postParentIn,
        context?.postParentNotIn,
        context?.customQueryId,
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
                <PanelBody title={__('Overlay Icon Settings', 'jankx')} initialOpen={true}>
                    <SelectControl
                        label={__('Overlay Source', 'jankx')}
                        value={overlayIconType}
                        options={[
                            { label: __('Icon Class', 'jankx'), value: 'class' },
                            { label: __('Image', 'jankx'), value: 'image' },
                            { label: __('Text Symbol', 'jankx'), value: 'text' },
                        ]}
                        onChange={(value: string) => setAttributes({ overlayIconType: value as any })}
                    />
                    {overlayIconType === 'class' && (
                        <TextControl
                            label={__('Icon Class', 'jankx')}
                            value={overlayIcon}
                            onChange={(value: string) => setAttributes({ overlayIcon: value })}
                        />
                    )}
                    {overlayIconType === 'text' && (
                        <>
                            <TextControl
                                label={__('Symbol Text', 'jankx')}
                                value={overlayIconText}
                                onChange={(value: string) => setAttributes({ overlayIconText: value })}
                                help={__('Ví dụ: ▶, ★, ▷', 'jankx')}
                            />
                            <RangeControl
                                label={__('Rotate (deg)', 'jankx')}
                                value={overlayIconRotate}
                                onChange={(value?: number) => setAttributes({ overlayIconRotate: value || 0 })}
                                min={-180}
                                max={180}
                                step={1}
                            />
                        </>
                    )}
                    {overlayIconType === 'image' && (
                        <>
                            <MediaUpload
                                onSelect={(media: any) => {
                                    const url = media?.url || '';
                                    const id = media?.id || 0;
                                    setAttributes({
                                        overlayIconImageUrl: url,
                                        overlayIconImageId: id,
                                    });
                                }}
                                allowedTypes={['image']}
                                value={overlayIconImageId || 0}
                                render={({ open }) => (
                                    <Button variant="primary" onClick={open}>
                                        {overlayIconImageUrl ? __('Change Overlay Image', 'jankx') : __('Select Overlay Image', 'jankx')}
                                    </Button>
                                )}
                            />
                            {overlayIconImageUrl && (
                                <div style={{ marginTop: 8 }}>
                                    <img src={overlayIconImageUrl} alt="" style={{ maxWidth: '100%', height: 'auto' }} />
                                    <Button
                                        variant="secondary"
                                        onClick={() => setAttributes({ overlayIconImageUrl: '', overlayIconImageId: 0 })}
                                        style={{ marginTop: 8 }}
                                    >
                                        {__('Remove Image', 'jankx')}
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                    {(overlayIconType === 'image' ? !!overlayIconImageUrl : (overlayIconType === 'text' ? !!overlayIconText : !!overlayIcon)) && (
                        <>
                            <SelectControl
                                label={__('Display Mode', 'jankx')}
                                value={overlayIconShowMode}
                                options={[
                                    { label: __('Always Show', 'jankx'), value: 'always-show' },
                                    { label: __('Show on Hover', 'jankx'), value: 'hover-show' },
                                    { label: __('Hide on Hover', 'jankx'), value: 'hover-hide' },
                                ]}
                                onChange={(value: string) => setAttributes({ overlayIconShowMode: value })}
                            />
                            <SelectControl
                                label={__('Icon Position', 'jankx')}
                                value={overlayIconPosition}
                                options={[
                                    { label: __('Center', 'jankx'), value: 'center' },
                                    { label: __('Top Left', 'jankx'), value: 'top-left' },
                                    { label: __('Top Right', 'jankx'), value: 'top-right' },
                                    { label: __('Bottom Left', 'jankx'), value: 'bottom-left' },
                                    { label: __('Bottom Right', 'jankx'), value: 'bottom-right' },
                                ]}
                                onChange={(value: string) => setAttributes({ overlayIconPosition: value })}
                            />
                            <SelectControl
                                label={__('Target Area', 'jankx')}
                                value={overlayIconTarget}
                                options={[
                                    { label: __('Featured Image', 'jankx'), value: 'featured-image' },
                                    { label: __('Entry Image', 'jankx'), value: 'entry-image' },
                                    { label: __('Entire Item', 'jankx'), value: 'entire-item' },
                                ]}
                                onChange={(value: string) => setAttributes({ overlayIconTarget: value })}
                            />
                            <RangeControl
                                label={__('Icon Size', 'jankx')}
                                value={overlayIconSize}
                                min={10}
                                max={100}
                                step={1}
                                onChange={(value?: number) => setAttributes({ overlayIconSize: value || 24 })}
                            />
                            <TextControl
                                label={__('Icon Color', 'jankx')}
                                value={overlayIconColor}
                                onChange={(value: string) => setAttributes({ overlayIconColor: value })}
                                help={__('Use CSS color value, e.g., #ffffff', 'jankx')}
                            />
                            <TextControl
                                label={__('Icon Background', 'jankx')}
                                value={overlayIconBackground}
                                onChange={(value: string) => setAttributes({ overlayIconBackground: value })}
                                help={__('Use RGBA for transparency, e.g., rgba(0,0,0,0.5)', 'jankx')}
                            />
                        </>
                    )}
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
                <PanelBody title={__('Scroll Animation', 'jankx')} initialOpen={false}>
                    <SelectControl
                        label={__('Animation Type', 'jankx')}
                        value={animationType || 'none'}
                        options={[
                            { label: __('None', 'jankx'), value: 'none' },
                            { label: __('Fade In', 'jankx'), value: 'fade-in' },
                            { label: __('Fade In Up', 'jankx'), value: 'fade-in-up' },
                            { label: __('Fade In Down', 'jankx'), value: 'fade-in-down' },
                            { label: __('Fade In Left', 'jankx'), value: 'fade-in-left' },
                            { label: __('Fade In Right', 'jankx'), value: 'fade-in-right' },
                            { label: __('Zoom In', 'jankx'), value: 'zoom-in' },
                            { label: __('Slide In Up', 'jankx'), value: 'slide-in-up' },
                        ]}
                        onChange={(value: string) => setAttributes({ animationType: value })}
                    />
                    {animationType !== 'none' && (
                        <>
                            <RangeControl
                                label={__('Animation Duration (ms)', 'jankx')}
                                value={animationDuration}
                                onChange={(value?: number) => setAttributes({ animationDuration: value || 1000 })}
                                min={100}
                                max={5000}
                                step={100}
                            />
                            <RangeControl
                                label={__('Animation Delay (ms)', 'jankx')}
                                value={animationDelay}
                                onChange={(value?: number) => setAttributes({ animationDelay: value || 0 })}
                                min={0}
                                max={5000}
                                step={100}
                            />
                            <SelectControl
                                label={__('Animation Target', 'jankx')}
                                value={animationTarget || 'entry'}
                                options={[
                                    { label: __('Whole Item (Entry)', 'jankx'), value: 'entry' },
                                    { label: __('Thumbnail Only', 'jankx'), value: 'thumbnail' },
                                ]}
                                onChange={(value) => setAttributes({ animationTarget: value as any })}
                            />
                            <ToggleControl
                                label={__('Reverse Animation on Scroll Out', 'jankx')}
                                checked={animationReverse}
                                onChange={(value) => setAttributes({ animationReverse: value })}
                                help={__('Hide item when scroll back up', 'jankx')}
                            />
                        </>
                    )}
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
