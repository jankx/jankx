import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * External dependencies
 */
import clsx from 'clsx';
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';
import { BlockControls, InspectorControls, MediaReplaceFlow, RichText, useBlockProps, InnerBlocks, __experimentalUseBorderProps as useBorderProps, __experimentalGetShadowClassesAndStyles as getShadowClassesAndStyles, store as blockEditorStore, useBlockEditingMode, } from '@wordpress/block-editor';
import { PanelBody, SelectControl, RangeControl, ToggleControl, 
// Use ColorPalette to leverage Gutenberg theme color settings
ColorPicker, ColorPalette, Button, ToolbarGroup, ToolbarButton, } from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { link, linkOff } from '@wordpress/icons';
import { isBlobURL } from '@wordpress/blob';
import { ANIMATION_OPTIONS, OVERLAY_POSITIONS, HOVER_EFFECTS, ALLOWED_INNER_BLOCKS } from './constants';
import { renderPresetCSS } from './presetCSSHelpers';
export default function edit({ attributes, setAttributes, isSelected, className, clientId, context, onReplace, insertBlocksAfter, }) {
    // Helper: parse color string to { colorHex, alpha }
    const parseColorAndAlpha = (value) => {
        const str = String(value ?? '').trim();
        // rgba(...) format
        const rgbaMatch = str.match(/rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*(0|0?\.\d+|1(?:\.0+)?)\s*)?\)/i);
        if (rgbaMatch) {
            const r = Number(rgbaMatch[1]);
            const g = Number(rgbaMatch[2]);
            const b = Number(rgbaMatch[3]);
            const a = rgbaMatch[4] !== undefined ? Number(rgbaMatch[4]) : 1;
            const hex = rgbToHex(r, g, b);
            return { colorHex: hex, alpha: a };
        }
        // Hex format #rrggbb or #rgb
        const hexMatch = str.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
        if (hexMatch) {
            const hex = normalizeHex(str);
            return { colorHex: hex, alpha: 1 };
        }
        // Unknown format - fallback to empty
        return { colorHex: String(value ?? '') || '#000000', alpha: 1 };
    };
    const rgbToHex = (r, g, b) => `#${[r, g, b]
        .map((x) => {
        const s = x.toString(16);
        return s.length === 1 ? `0${s}` : s;
    })
        .join('')}`;
    const normalizeHex = (hex) => {
        const h = hex.replace('#', '').toLowerCase();
        if (h.length === 3) {
            return `#${h[0]}${h[0]}${h[1]}${h[1]}${h[2]}${h[2]}`;
        }
        return `#${h}`;
    };
    const combineHexAndAlpha = (hex, alpha) => {
        const normalized = normalizeHex(hex);
        if (alpha >= 1)
            return normalized;
        // Convert hex to rgb
        const r = parseInt(normalized.slice(1, 3), 16);
        const g = parseInt(normalized.slice(3, 5), 16);
        const b = parseInt(normalized.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };
    const { url = '', alt = '', title = '', id = 0, width = '', height = '', aspectRatio = '', scale = '', href = '', linkTarget = '', rel = '', caption = '', showOverlayOnHover = false, overlayAnimation = 'fadeIn', overlayAnimationDuration = 1000, overlayAnimationDelay = 0, overlayPosition = 'bottom', overlayBackground = 'rgba(0,0,0,0.5)', overlayOpacity = 1, imageHoverEffect = 'none', borderRadius = '0px', preset = '', presetOptions = {} } = attributes || {};
    // Validation state removed for better UX
    const [isEditingURL, setIsEditingURL] = useState(false);
    const [popoverAnchor, setPopoverAnchor] = useState(null);
    const borderProps = useBorderProps(attributes);
    const shadowProps = getShadowClassesAndStyles(attributes);
    const blockEditingMode = useBlockEditingMode();
    const { getSettings, getBlockRootClientId } = useSelect(blockEditorStore);
    const { createErrorNotice } = useDispatch('core/notices');
    // Get inner blocks for validation and template check
    const innerBlocks = useSelect((select) => {
        const blocks = select(blockEditorStore).getBlocks(clientId);
        return Array.isArray(blocks) ? blocks : [];
    }, [clientId]);
    // Only apply template if inner blocks are empty (to preserve existing content)
    const hasInnerBlocks = innerBlocks && innerBlocks.length > 0;
    // Get presets from PHP
    const presets = window.jankxAdvancedImageBoxPresets || {};
    // Provide editor theme color palette for preset color options
    const settingsObj = typeof getSettings === 'function' ? getSettings() : undefined;
    const editorColors = (settingsObj && settingsObj.colors) ? settingsObj.colors : undefined;
    const currentPreset = preset ? presets[preset] : null;
    // Merge new preset options when preset data changes
    useEffect(() => {
        if (preset && currentPreset && currentPreset.options) {
            const currentOptions = presetOptions || {};
            const mergedOptions = { ...currentOptions };
            let hasNewOptions = false;
            currentPreset.options.forEach((option) => {
                // Add new options that don't exist in current presetOptions
                if (!(option.name in mergedOptions) && option.default !== undefined) {
                    mergedOptions[option.name] = option.default;
                    hasNewOptions = true;
                }
            });
            // Only update if there are new options
            if (hasNewOptions) {
                setAttributes({ presetOptions: mergedOptions });
            }
        }
    }, [preset, currentPreset, presetOptions, setAttributes]);
    // Handle preset change
    const handlePresetChange = (newPresetId) => {
        const newPreset = presets[newPresetId];
        if (!newPreset) {
            setAttributes({ preset: undefined, presetOptions: undefined });
            return;
        }
        // Merge default options with existing presetOptions
        // This ensures new options are added while preserving existing values
        const mergedOptions = { ...(presetOptions || {}) };
        if (newPreset.options) {
            newPreset.options.forEach((option) => {
                // Only set default if option doesn't exist in current presetOptions
                if (!(option.name in mergedOptions) && option.default !== undefined) {
                    mergedOptions[option.name] = option.default;
                }
            });
        }
        setAttributes({
            preset: newPresetId,
            presetOptions: mergedOptions
        });
        // If preset requires inner blocks, add template
        if (newPreset.requiresInnerBlocks && newPreset.innerBlocksTemplate) {
            // This will be handled by InnerBlocks component
        }
    };
    // Handle preset option change
    const handlePresetOptionChange = (optionName, value) => {
        setAttributes({
            presetOptions: {
                ...presetOptions,
                [optionName]: value
            }
        });
    };
    // Render preset option control
    const renderPresetOption = (option) => {
        const value = presetOptions[option.name] ?? option.default;
        switch (option.type) {
            case 'text':
                return (_jsxs("div", { style: { marginBottom: '16px' }, children: [_jsx("label", { style: { display: 'block', marginBottom: '4px' }, children: option.label }), _jsx("input", { type: "text", value: String(value || ''), onChange: (e) => handlePresetOptionChange(option.name, e.target.value), style: { width: '100%' } }), option.help && (_jsx("p", { style: { fontSize: '12px', color: '#757575', marginTop: '4px' }, children: option.help }))] }, option.name));
            case 'number':
            case 'range':
                return (_jsx(RangeControl, { label: option.label, value: Number(value ?? option.default ?? 0), onChange: (newValue) => handlePresetOptionChange(option.name, newValue), min: option.min ?? 0, max: option.max ?? 100, step: option.step ?? 1, help: option.help }, option.name));
            case 'color':
                // Use Gutenberg ColorPalette so preset color options follow editor/theme palettes.
                // Also provide an opacity slider (alpha). ColorPalette returns a hex value, so alpha
                // is stored separately and combined into rgba(...) when alpha < 1.
                return (_jsxs("div", { style: { marginBottom: '16px' }, children: [_jsx("label", { style: { display: 'block', marginBottom: '6px' }, children: option.label }), 
                        // Parse stored value to split into hex and alpha
                        (() => {
                            const { colorHex: storedHex, alpha: storedAlpha } = parseColorAndAlpha(value);
                            const colorValue = storedHex || String(option.default ?? '#000000');
                            const alphaValue = Number(storedAlpha ?? 1);
                            if (editorColors && editorColors.length > 0) {
                                return (_jsxs(_Fragment, { children: [_jsx(ColorPalette, { value: String(colorValue), onChange: (newHex) => handlePresetOptionChange(option.name, combineHexAndAlpha(String(newHex || colorValue), alphaValue)), colors: editorColors }), _jsxs("div", { style: { marginTop: '6px' }, children: [_jsx("label", { style: { display: 'block', marginBottom: '4px' }, children: __('Opacity') }), _jsx(RangeControl, { value: alphaValue, onChange: (newAlpha) => handlePresetOptionChange(option.name, combineHexAndAlpha(String(colorValue), Number(newAlpha))), min: 0, max: 1, step: 0.01 })] })] }));
                            }
                            // Fallback: use ColorPicker which supports alpha as rgba string
                            return (_jsx(ColorPicker, { color: String(value ?? option.default ?? '#000000'), onChange: (newValue) => handlePresetOptionChange(option.name, newValue) }));
                        })(), option.help && (_jsx("p", { style: { fontSize: '12px', color: '#757575', marginTop: '4px' }, children: option.help }))] }, option.name));
            case 'select':
                return (_jsx(SelectControl, { label: option.label, value: String(value ?? option.default ?? ''), options: option.options?.map(opt => ({
                        label: opt.label,
                        value: String(opt.value)
                    })) || [], onChange: (newValue) => handlePresetOptionChange(option.name, newValue), help: option.help }, option.name));
            case 'toggle':
                return (_jsx(ToggleControl, { label: option.label, checked: Boolean(value ?? option.default ?? false), onChange: (newValue) => handlePresetOptionChange(option.name, newValue), help: option.help }, option.name));
            default:
                return null;
        }
    };
    // Render preset CSS for editor preview
    const presetCSS = currentPreset && preset
        ? renderPresetCSS(currentPreset, presetOptions)
        : '';
    // Apply WordPress margin (style.spacing.margin) to title-box in editor preview
    const styleMargin = attributes?.style?.spacing?.margin || {};
    const po = presetOptions || {};
    const pos = String(po?.titlePosition ?? 'bottom-center');
    const full = Boolean(po?.titleFullWidth ?? false);
    const mTop = String(styleMargin.top ?? (po?.titleMarginTop !== undefined ? `${po.titleMarginTop}px` : ''));
    const mRight = String(styleMargin.right ?? (po?.titleMarginRight !== undefined ? `${po.titleMarginRight}px` : ''));
    const mBottom = String(styleMargin.bottom ?? (po?.titleMarginBottom !== undefined ? `${po.titleMarginBottom}px` : ''));
    const mLeft = String(styleMargin.left ?? (po?.titleMarginLeft !== undefined ? `${po.titleMarginLeft}px` : ''));
    const offsetsCSS = (() => {
        if (!preset || !currentPreset)
            return '';
        if (full) {
            if (pos.startsWith('top'))
                return `.wp-block-jankx-advanced-image-box.preset-bordered-frame .wp-block-jankx-advanced-image-box__title-box { top: ${mTop || '0'}; left: 0; right: 0; }`;
            if (pos.startsWith('bottom'))
                return `.wp-block-jankx-advanced-image-box.preset-bordered-frame .wp-block-jankx-advanced-image-box__title-box { bottom: ${mBottom || '0'}; left: 0; right: 0; }`;
            if (pos.startsWith('left'))
                return `.wp-block-jankx-advanced-image-box.preset-bordered-frame .wp-block-jankx-advanced-image-box__title-box { left: ${mLeft || '0'}; top: 0; bottom: 0; }`;
            if (pos.startsWith('right'))
                return `.wp-block-jankx-advanced-image-box.preset-bordered-frame .wp-block-jankx-advanced-image-box__title-box { right: ${mRight || '0'}; top: 0; bottom: 0; }`;
            return '';
        }
        switch (pos) {
            case 'top-left':
                return `.wp-block-jankx-advanced-image-box.preset-bordered-frame .wp-block-jankx-advanced-image-box__title-box { top: ${mTop || '0'}; left: ${mLeft || '0'}; }`;
            case 'top-center':
                return `.wp-block-jankx-advanced-image-box.preset-bordered-frame .wp-block-jankx-advanced-image-box__title-box { top: ${mTop || '0'}; left: 50%; transform: translateX(-50%); }`;
            case 'top-right':
                return `.wp-block-jankx-advanced-image-box.preset-bordered-frame .wp-block-jankx-advanced-image-box__title-box { top: ${mTop || '0'}; right: ${mRight || '0'}; }`;
            case 'bottom-left':
                return `.wp-block-jankx-advanced-image-box.preset-bordered-frame .wp-block-jankx-advanced-image-box__title-box { bottom: ${mBottom || '0'}; left: ${mLeft || '0'}; }`;
            case 'bottom-center':
                return `.wp-block-jankx-advanced-image-box.preset-bordered-frame .wp-block-jankx-advanced-image-box__title-box { bottom: ${mBottom || '0'}; left: 50%; transform: translateX(-50%); }`;
            case 'bottom-right':
                return `.wp-block-jankx-advanced-image-box.preset-bordered-frame .wp-block-jankx-advanced-image-box__title-box { bottom: ${mBottom || '0'}; right: ${mRight || '0'}; }`;
            case 'left-top':
                return `.wp-block-jankx-advanced-image-box.preset-bordered-frame .wp-block-jankx-advanced-image-box__title-box { top: ${mTop || '0'}; left: ${mLeft || '0'}; }`;
            case 'left-center':
                return `.wp-block-jankx-advanced-image-box.preset-bordered-frame .wp-block-jankx-advanced-image-box__title-box { top: 50%; left: ${mLeft || '0'}; transform: translateY(-50%); }`;
            case 'left-bottom':
                return `.wp-block-jankx-advanced-image-box.preset-bordered-frame .wp-block-jankx-advanced-image-box__title-box { bottom: ${mBottom || '0'}; left: ${mLeft || '0'}; }`;
            case 'right-top':
                return `.wp-block-jankx-advanced-image-box.preset-bordered-frame .wp-block-jankx-advanced-image-box__title-box { top: ${mTop || '0'}; right: ${mRight || '0'}; }`;
            case 'right-center':
                return `.wp-block-jankx-advanced-image-box.preset-bordered-frame .wp-block-jankx-advanced-image-box__title-box { top: 50%; right: ${mRight || '0'}; transform: translateY(-50%); }`;
            case 'right-bottom':
                return `.wp-block-jankx-advanced-image-box.preset-bordered-frame .wp-block-jankx-advanced-image-box__title-box { bottom: ${mBottom || '0'}; right: ${mRight || '0'}; }`;
            case 'center':
                return `.wp-block-jankx-advanced-image-box.preset-bordered-frame .wp-block-jankx-advanced-image-box__title-box { top: 50%; left: 50%; transform: translate(-50%, -50%); }`;
            default:
                return '';
        }
    })();
    const padTop = po?.titlePaddingTop !== undefined ? `${po.titlePaddingTop}px` : '';
    const padRight = po?.titlePaddingRight !== undefined ? `${po.titlePaddingRight}px` : '';
    const padBottom = po?.titlePaddingBottom !== undefined ? `${po.titlePaddingBottom}px` : '';
    const padLeft = po?.titlePaddingLeft !== undefined ? `${po.titlePaddingLeft}px` : '';
    const widthUnit = String(po?.titleWidthUnit ?? 'px');
    const widthVal = po?.titleWidth && Number(po.titleWidth) > 0 ? `${po.titleWidth}${widthUnit}` : '';
    const minWidthVal = po?.titleMinWidth && Number(po.titleMinWidth) > 0 ? `${po.titleMinWidth}px` : '';
    const paddingCSS = (padTop || padRight || padBottom || padLeft || widthVal || minWidthVal) ? `
.wp-block-jankx-advanced-image-box.preset-bordered-frame .wp-block-jankx-advanced-image-box__title-box {
    ${padTop ? `padding-top: ${padTop};` : ''}
    ${padRight ? `padding-right: ${padRight};` : ''}
    ${padBottom ? `padding-bottom: ${padBottom};` : ''}
    ${padLeft ? `padding-left: ${padLeft};` : ''}
    ${widthVal ? `width: ${widthVal};` : ''}
    ${minWidthVal ? `min-width: ${minWidthVal};` : ''}
}
` : '';
    const combinedPresetCSS = `${presetCSS}${offsetsCSS}${paddingCSS}`;
    // Validation removed for better UX
    const blockProps = useBlockProps({
        ref: setPopoverAnchor,
        className: clsx(className, 'wp-block-jankx-advanced-image-box', {
            'has-overlay': showOverlayOnHover,
            'has-hover-effect': imageHoverEffect && imageHoverEffect !== 'none',
            'is-selected': isSelected,
            ...(currentPreset?.className ? { [currentPreset.className]: true } : {}),
        }),
    });
    const onSelectImage = (media) => {
        if (!media || !media.url) {
            setAttributes({
                url: undefined,
                alt: undefined,
                id: undefined,
                title: undefined,
            });
            return;
        }
        if (isBlobURL(media.url)) {
            return;
        }
        const { imageDefaultSize } = getSettings();
        const newSize = imageDefaultSize || 'full';
        setAttributes({
            url: media.url,
            alt: media.alt || '',
            title: media.title || '',
            id: media.id,
            sizeSlug: newSize,
        });
    };
    const onSelectURL = (newURL) => {
        if (newURL !== url) {
            setAttributes({
                url: newURL,
                id: undefined,
                sizeSlug: getSettings().imageDefaultSize,
            });
        }
    };
    const onUploadError = (message) => {
        createErrorNotice(message, { type: 'snackbar' });
        setAttributes({
            url: undefined,
            id: undefined,
        });
    };
    const startEditing = () => {
        setIsEditingURL(true);
    };
    const unlink = () => {
        setAttributes({
            href: undefined,
            linkTarget: undefined,
            rel: undefined,
        });
        setIsEditingURL(false);
    };
    // Validation notice removed for better UX
    const hasImage = Boolean(url && String(url).trim() !== '');
    const presetBg = String(presetOptions?.titleBackground ?? overlayBackground ?? 'transparent');
    const placeholderMinHeight = height || '240px';
    const imageElement = hasImage ? (_jsx("img", { src: url, alt: alt || '', title: title, className: clsx('wp-block-jankx-advanced-image-box__image', borderProps.className, {
            [`has-hover-${imageHoverEffect}`]: imageHoverEffect && imageHoverEffect !== 'none',
        }), style: {
            ...borderProps.style,
            ...shadowProps.style,
            aspectRatio,
            objectFit: scale,
            width,
            height,
            borderRadius,
        } })) : (_jsxs("div", { className: "wp-block-jankx-advanced-image-box__placeholder", children: [!hasImage && alt && (_jsx("div", { className: "wp-block-jankx-advanced-image-box__no-image__alt", style: { color: String(presetOptions?.titleColor ?? '#ffffff') }, children: alt })), _jsx(MediaReplaceFlow, { mediaId: id, mediaURL: url, allowedTypes: ['image'], accept: "image/*", onSelect: onSelectImage, onSelectURL: onSelectURL, onError: onUploadError, name: !url ? __('Add image') : __('Replace') })] }));
    // Wrap image with link in editor to match frontend rendering
    const wrappedImage = href ? (_jsx("a", { href: href, target: linkTarget, rel: rel, className: "wp-block-jankx-advanced-image-box__link", children: imageElement })) : (imageElement);
    // InnerBlocks MUST be rendered in ONE fixed location in the DOM
    // This is critical for WordPress to properly track and save inner blocks
    const innerBlocksProps = {
        allowedBlocks: ALLOWED_INNER_BLOCKS,
        templateLock: false,
        renderAppender: false,
        // Only apply template if inner blocks are empty and preset requires it
        template: !hasInnerBlocks &&
            preset &&
            currentPreset?.requiresInnerBlocks &&
            currentPreset.innerBlocksTemplate
            ? currentPreset.innerBlocksTemplate
            : undefined
    };
    // Determine where to render InnerBlocks based on preset and overlay
    // But always render it in ONE place only
    let innerBlocksWrapper = null;
    if (preset && currentPreset?.requiresInnerBlocks) {
        // When preset is active, render in title-box
        innerBlocksWrapper = (_jsxs("div", { className: "wp-block-jankx-advanced-image-box__frame-wrapper", children: [_jsx("div", { className: "wp-block-jankx-advanced-image-box__frame" }), _jsx("div", { className: "wp-block-jankx-advanced-image-box__title-box", children: _jsx("div", { className: "wp-block-jankx-advanced-image-box__overlay__content", children: _jsx(InnerBlocks, { ...innerBlocksProps }) }) })] }));
    }
    else if (showOverlayOnHover) {
        // When overlay is enabled, render in overlay
        innerBlocksWrapper = (_jsx("div", { className: clsx('wp-block-jankx-advanced-image-box__overlay', `wp-block-jankx-advanced-image-box__overlay--${overlayPosition}`, 'animated', overlayAnimation), style: {
                backgroundColor: overlayBackground,
                opacity: overlayOpacity,
                animationDuration: `${overlayAnimationDuration}ms`,
                animationDelay: `${overlayAnimationDelay}ms`,
            }, children: _jsx("div", { className: "wp-block-jankx-advanced-image-box__overlay__content", children: _jsx(InnerBlocks, { ...innerBlocksProps }) }) }));
    }
    else {
        // When no preset and no overlay, render in hidden container (still visible for editing)
        innerBlocksWrapper = (_jsx("div", { className: "wp-block-jankx-advanced-image-box__overlay__content", children: _jsx(InnerBlocks, { ...innerBlocksProps }) }));
    }
    // Separate visual elements (overlay wrapper for non-preset, preset frame for preset)
    const overlayContent = showOverlayOnHover && !preset ? innerBlocksWrapper : null;
    const presetContent = preset && currentPreset ? innerBlocksWrapper : null;
    const hiddenInnerBlocks = !preset && !showOverlayOnHover ? innerBlocksWrapper : null;
    return (_jsxs(_Fragment, { children: [combinedPresetCSS && (_jsx("style", { dangerouslySetInnerHTML: { __html: combinedPresetCSS } })), _jsxs("figure", { ...blockProps, children: [wrappedImage, overlayContent, presetContent, hiddenInnerBlocks, !RichText.isEmpty(caption) && (_jsx(RichText, { className: "wp-block-jankx-advanced-image-box__caption", tagName: "figcaption", value: caption, onChange: (value) => setAttributes({ caption: value }), placeholder: __('Add caption…') }))] }), isSelected && (_jsx(BlockControls, { children: _jsxs(ToolbarGroup, { children: [_jsx(MediaReplaceFlow, { mediaId: id, mediaURL: url, allowedTypes: ['image'], accept: "image/*", onSelect: onSelectImage, onSelectURL: onSelectURL, onError: onUploadError, name: !url ? __('Add image') : __('Replace') }), href && (_jsx(ToolbarButton, { icon: linkOff, label: __('Unlink'), onClick: unlink })), !href && (_jsx(ToolbarButton, { icon: link, label: __('Link'), onClick: startEditing }))] }) })), _jsxs(InspectorControls, { children: [_jsxs(PanelBody, { title: __('Preset'), initialOpen: true, children: [_jsx(SelectControl, { label: __('Layout Preset'), value: preset || '', options: [
                                    { label: __('None', 'jankx'), value: '' },
                                    ...Object.values(presets).map((p) => ({
                                        label: p.label,
                                        value: p.id
                                    }))
                                ], onChange: handlePresetChange, help: __('Choose a preset layout for the image box', 'jankx') }), currentPreset && currentPreset.description && (_jsx("p", { style: { fontSize: '12px', color: '#757575', marginTop: '8px' }, children: currentPreset.description })), currentPreset && currentPreset.options && currentPreset.options.length > 0 && (_jsxs("div", { style: { marginTop: '16px' }, children: [_jsx("strong", { style: { display: 'block', marginBottom: '12px' }, children: __('Preset Options', 'jankx') }), currentPreset.options.map(renderPresetOption)] }))] }), _jsxs(PanelBody, { title: __('Image Settings'), initialOpen: true, children: [_jsxs("div", { style: { marginBottom: '12px' }, children: [_jsx(MediaReplaceFlow, { mediaId: id, mediaURL: url, allowedTypes: ['image'], accept: "image/*", onSelect: onSelectImage, onSelectURL: onSelectURL, onError: onUploadError, name: !url ? __('Add image') : __('Replace') }), url && (_jsx(Button, { isSecondary: true, onClick: () => setAttributes({ url: undefined, id: undefined, alt: undefined, title: undefined }), style: { marginLeft: '8px' }, children: __('Remove image') }))] }), _jsx(RichText, { className: "wp-block-jankx-advanced-image-box__alt-text", tagName: "p", value: alt || '', onChange: (value) => setAttributes({ alt: value }), placeholder: __('Add alt text…'), help: __('Describe the purpose of the image. Leave empty if decorative.') }), _jsx(RichText, { className: "wp-block-jankx-advanced-image-box__title", tagName: "p", value: title || '', onChange: (value) => setAttributes({ title: value }), placeholder: __('Add title…'), help: __('Describe the role of this image on the page.') })] }), _jsxs(PanelBody, { title: __('Overlay Settings'), initialOpen: false, children: [_jsx(ToggleControl, { label: __('Show overlay on hover'), checked: showOverlayOnHover, onChange: (value) => setAttributes({ showOverlayOnHover: value }) }), showOverlayOnHover && (_jsxs(_Fragment, { children: [_jsx(SelectControl, { label: __('Animation'), value: overlayAnimation, options: [
                                            { label: __('None'), value: 'none' },
                                            ...ANIMATION_OPTIONS.map(option => ({
                                                label: option.label,
                                                value: option.value
                                            }))
                                        ], onChange: (value) => setAttributes({ overlayAnimation: value }) }), _jsx(RangeControl, { label: __('Animation Duration (ms)'), value: overlayAnimationDuration, onChange: (value) => setAttributes({ overlayAnimationDuration: value }), min: 100, max: 5000, step: 100 }), _jsx(RangeControl, { label: __('Animation Delay (ms)'), value: overlayAnimationDelay, onChange: (value) => setAttributes({ overlayAnimationDelay: value }), min: 0, max: 2000, step: 100 }), _jsx(SelectControl, { label: __('Overlay Position'), value: overlayPosition, options: OVERLAY_POSITIONS.map(position => ({
                                            label: position.label,
                                            value: position.value
                                        })), onChange: (value) => setAttributes({ overlayPosition: value }) }), _jsx(ColorPicker, { color: overlayBackground, onChange: (value) => setAttributes({ overlayBackground: value }), label: __('Overlay Background') }), _jsx(RangeControl, { label: __('Overlay Opacity'), value: overlayOpacity, onChange: (value) => setAttributes({ overlayOpacity: value }), min: 0, max: 1, step: 0.1 })] }))] }), _jsx(PanelBody, { title: __('Hover Effects'), initialOpen: false, children: _jsx(SelectControl, { label: __('Image Hover Effect'), value: imageHoverEffect, options: HOVER_EFFECTS.map(effect => ({
                                label: effect.label,
                                value: effect.value
                            })), onChange: (value) => setAttributes({ imageHoverEffect: value }) }) }), _jsx(PanelBody, { title: __('Styling'), initialOpen: false, children: _jsx(RangeControl, { label: __('Border Radius (px)'), value: parseInt(borderRadius) || 0, onChange: (value) => setAttributes({ borderRadius: `${value}px` }), min: 0, max: 50, step: 1 }) })] })] }));
}
