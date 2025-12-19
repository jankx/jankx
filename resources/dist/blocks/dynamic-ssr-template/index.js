import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl, ToggleControl, RangeControl, TextControl } from '@wordpress/components';
import { useMemo, useEffect, useState } from '@wordpress/element';
import metadata from './block.json';
import './style.scss';
import './editor.scss';
function Edit({ attributes, setAttributes, context }) {
    const { contentLoopLayout = 'default', thumbnailPosition = 'top', imageRatio = '', itemSpacing = 'normal', showItemBorder = false, itemBorderRadius = 0, showExcerpt = true, excerptLength = 55, } = attributes;
    const postType = context?.postType || 'post';
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
    const [previewHtml, setPreviewHtml] = useState('');
    const [loading, setLoading] = useState(false);
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
        }
        else if (!ajaxUrl.startsWith('http://') && !ajaxUrl.startsWith('https://')) {
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
            postType: context?.postType || 'post',
            layout: context?.displayLayout || 'grid',
            postsPerPage: context?.postsPerPage || 6,
            columns: context?.columns || undefined,
            columnsTablet: context?.columnsTablet || undefined,
            columnsMobile: context?.columnsMobile || undefined,
            slidesToScroll: context?.slidesToScroll ?? undefined,
            loop: context?.loop ?? undefined,
            autoplay: context?.autoplay ?? undefined,
            autoplayDelay: context?.autoplayDelay ?? undefined,
            showArrows: context?.showArrows ?? undefined,
            showDots: context?.showDots ?? undefined,
            carouselAlign: context?.carouselAlign ?? undefined,
            carouselAxis: context?.carouselAxis ?? undefined,
            carouselDirection: context?.carouselDirection ?? undefined,
            carouselStartIndex: context?.carouselStartIndex ?? undefined,
            carouselDuration: context?.carouselDuration ?? undefined,
            carouselDragFree: context?.carouselDragFree ?? undefined,
            carouselDragThreshold: context?.carouselDragThreshold ?? undefined,
            carouselSkipSnaps: context?.carouselSkipSnaps ?? undefined,
            carouselContainScroll: context?.carouselContainScroll ?? undefined,
            carouselInViewThreshold: context?.carouselInViewThreshold ?? undefined,
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
            }
            else {
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
    return (_jsxs(_Fragment, { children: [_jsxs(InspectorControls, { children: [_jsxs(PanelBody, { title: __('SSR Template Settings', 'jankx'), initialOpen: true, children: [_jsx(SelectControl, { label: __('Content Loop Layout', 'jankx'), value: contentLoopLayout, options: layoutOptions, onChange: (value) => setAttributes({ contentLoopLayout: value }) }), _jsx(SelectControl, { label: __('Item Spacing', 'jankx'), value: itemSpacing, options: [
                                    { label: __('None', 'jankx'), value: 'none' },
                                    { label: __('Compact', 'jankx'), value: 'compact' },
                                    { label: __('Normal', 'jankx'), value: 'normal' },
                                    { label: __('Loose', 'jankx'), value: 'loose' },
                                ], onChange: (value) => setAttributes({ itemSpacing: value }) }), _jsx(ToggleControl, { label: __('Show Item Border', 'jankx'), checked: !!showItemBorder, onChange: (value) => setAttributes({ showItemBorder: value }) }), !!showItemBorder && (_jsx(RangeControl, { label: __('Border Radius', 'jankx'), value: itemBorderRadius, onChange: (value) => setAttributes({ itemBorderRadius: value || 0 }), min: 0, max: 50 }))] }), _jsxs(PanelBody, { title: __('Image Settings', 'jankx'), initialOpen: false, children: [_jsx(SelectControl, { label: __('Thumbnail Position', 'jankx'), value: thumbnailPosition, options: [
                                    { label: __('Top', 'jankx'), value: 'top' },
                                    { label: __('Bottom', 'jankx'), value: 'bottom' },
                                    { label: __('Left', 'jankx'), value: 'left' },
                                    { label: __('Right', 'jankx'), value: 'right' },
                                ], onChange: (value) => setAttributes({ thumbnailPosition: value }) }), _jsx(TextControl, { label: __('Image Ratio (e.g. 16/9)', 'jankx'), value: imageRatio, onChange: (value) => setAttributes({ imageRatio: value }) })] }), _jsxs(PanelBody, { title: __('Content Settings', 'jankx'), initialOpen: false, children: [_jsx(ToggleControl, { label: __('Show Excerpt', 'jankx'), checked: !!showExcerpt, onChange: (value) => setAttributes({ showExcerpt: value }) }), !!showExcerpt && (_jsx(RangeControl, { label: __('Excerpt Length', 'jankx'), value: excerptLength, onChange: (value) => setAttributes({ excerptLength: value || 55 }), min: 10, max: 200 }))] })] }), _jsx("div", { ...blockProps, children: loading ? (_jsx("div", { style: { padding: '12px' }, children: __('Loading preview…', 'jankx') })) : previewHtml ? (_jsx("div", { dangerouslySetInnerHTML: { __html: previewHtml } })) : (_jsx("div", { style: { padding: '12px' }, children: __('No preview available', 'jankx') })) })] }));
}
registerBlockType(metadata.name, {
    ...metadata,
    edit: Edit,
    save: () => null,
});
