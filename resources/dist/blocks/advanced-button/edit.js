import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * External dependencies
 */
import classnames from 'classnames';
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { ExternalLink, Popover, SelectControl, TextControl, ToggleControl, ToolbarButton, __experimentalToolsPanel as ToolsPanel, __experimentalToolsPanelItem as ToolsPanelItem, } from '@wordpress/components';
import { BlockControls, InnerBlocks, InspectorControls, RichText, useBlockProps, withColors, __experimentalLinkControl as LinkControl, __experimentalGetBorderClassesAndStyles as getBorderClassesAndStyles, } from '@wordpress/block-editor';
import { useState, useRef, useCallback, useEffect, useMemo } from '@wordpress/element';
import { displayShortcut, isKeyboardEvent } from '@wordpress/keycodes';
import { link } from '@wordpress/icons';
import { useSelect } from '@wordpress/data';
const NEW_TAB_REL = 'noreferrer noopener';
const ALLOWED_BLOCKS = ['jankx/icon-picker', 'jankx/svg-icon', 'core/image', 'core/html'];
const ICON_TEMPLATE = [];
/**
 * The edit function for the Advanced Button Block.
 */
export function Edit(props) {
    const { attributes, setAttributes, backgroundColor, textColor, setBackgroundColor, setTextColor, clientId, } = props;
    const { triggerType = 'link', buttonType = 'button', modalId = '', modalShareObjectId = false, modalSharePostTitle = false, modalShareCurrentUrl = false, modalShareFeaturedImageId = false, modalShareFeaturedImageUrl = false, modalFeaturedImageSize = 'full', formData = [], formMappings = [], text, url, title, linkTarget, rel, placeholder, style, useIconBlocks = false, iconPosition = 'left', showLabel = true, conditionType = 'always', showForPostType = '', hoverAnimation = 'none', unhoverAnimation = 'none', } = attributes;
    const { renderIconOutside } = attributes;
    const shareEnabled = (modalShareObjectId || modalSharePostTitle || modalShareCurrentUrl || modalShareFeaturedImageId || modalShareFeaturedImageUrl);
    // Backward compatibility auto-migrate
    useEffect(() => {
        if (!attributes?.conditionType && showForPostType) {
            setAttributes({ conditionType: 'post-type' });
        }
    }, [showForPostType]);
    // Check if block has inner blocks (icon blocks)
    const hasInnerBlocks = useSelect((select) => {
        const { getBlockCount } = select('core/block-editor');
        return getBlockCount(clientId) > 0;
    }, [clientId]);
    const { isInsideDynamicTemplate, multiPostTypes, detectedPostType } = useSelect((select) => {
        const { getBlockParents, getBlock } = select('core/block-editor');
        const parents = getBlockParents(clientId) || [];
        const templateId = parents.find((id) => getBlock(id)?.name === 'jankx/dynamic-data-template');
        let multi = { enabled: false, postTypes: [] };
        let detected = '';
        if (templateId) {
            const layoutId = getBlockParents(templateId).find((id) => ['jankx/dynamic-data-layout', 'jankx/dynamic-ssr-layout'].includes(getBlock(id)?.name));
            if (layoutId) {
                const layoutBlock = getBlock(layoutId);
                const attrs = layoutBlock?.attributes || {};
                if (attrs?.useMultiPostType && Array.isArray(attrs?.postTypes) && attrs.postTypes.length > 1) {
                    multi = { enabled: true, postTypes: attrs.postTypes };
                }
                if (attrs?.postType) {
                    detected = attrs.postType;
                }
                else if (Array.isArray(attrs?.postTypes) && attrs.postTypes.length > 0) {
                    detected = attrs.postTypes[0];
                }
            }
        }
        return { isInsideDynamicTemplate: !!templateId, multiPostTypes: multi, detectedPostType: detected };
    }, [clientId]);
    const wpPostTypes = useSelect((select) => {
        const core = select('core');
        return core.getPostTypes({ per_page: -1 }) || [];
    }, []);
    const publicPostTypes = Array.isArray(window.jankxPublicPostTypes)
        ? window.jankxPublicPostTypes
        : [];
    const postTypeOptions = useMemo(() => {
        const map = new Map();
        (wpPostTypes || [])
            .filter((type) => type.slug !== 'attachment')
            .forEach((type) => {
            if (!map.has(type.slug)) {
                map.set(type.slug, type.name);
            }
        });
        publicPostTypes
            .filter((pt) => pt.slug !== 'attachment')
            .forEach((pt) => {
            if (!map.has(pt.slug)) {
                map.set(pt.slug, pt.name || pt.slug);
            }
        });
        return Array.from(map.entries()).map(([value, label]) => ({ label, value }));
    }, [wpPostTypes, publicPostTypes]);
    useEffect(() => {
        if (isInsideDynamicTemplate &&
            conditionType === 'always' &&
            (!showForPostType || showForPostType === '') &&
            detectedPostType) {
            setAttributes({ conditionType: 'post-type', showForPostType: detectedPostType });
        }
    }, [isInsideDynamicTemplate, detectedPostType, conditionType, showForPostType, setAttributes]);
    useEffect(() => {
        if (isInsideDynamicTemplate && conditionType === 'post-type') {
            const isInvalid = showForPostType === 'attachment' ||
                (!!showForPostType && !postTypeOptions.some((opt) => opt.value === showForPostType));
            if (isInvalid && detectedPostType) {
                setAttributes({ showForPostType: detectedPostType });
            }
        }
    }, [isInsideDynamicTemplate, conditionType, showForPostType, detectedPostType, postTypeOptions, setAttributes]);
    // Get all modal blocks from the page
    const modalBlocks = useSelect((select) => {
        const { getBlocks } = select('core/block-editor');
        const allBlocks = getBlocks();
        // Recursively find all jankx/modal blocks
        const findModalBlocks = (blocks) => {
            let modals = [];
            blocks.forEach((block) => {
                if (block.name === 'jankx/modal' && block.attributes?.modalId) {
                    modals.push({
                        id: block.attributes.modalId,
                        title: block.attributes.modalTitle || block.attributes.modalId,
                    });
                }
                if (block.innerBlocks && block.innerBlocks.length > 0) {
                    modals = [...modals, ...findModalBlocks(block.innerBlocks)];
                }
            });
            return modals;
        };
        return findModalBlocks(allBlocks);
    }, []);
    const [isEditingURL, setIsEditingURL] = useState(false);
    const [isCustomModalId, setIsCustomModalId] = useState(false);
    const linkRef = useRef(null);
    const isURLSet = !!url;
    const opensInNewTab = linkTarget === '_blank';
    const unlink = useCallback(() => {
        setAttributes({
            url: undefined,
            linkTarget: undefined,
            rel: undefined,
        });
        setIsEditingURL(false);
    }, [setAttributes]);
    const onToggleOpenInNewTab = useCallback((value) => {
        const newLinkTarget = value ? '_blank' : undefined;
        let updatedRel = rel;
        if (newLinkTarget && !rel) {
            updatedRel = NEW_TAB_REL;
        }
        else if (!newLinkTarget && rel === NEW_TAB_REL) {
            updatedRel = undefined;
        }
        setAttributes({
            linkTarget: newLinkTarget,
            rel: updatedRel,
        });
    }, [rel, setAttributes]);
    const onKeyDown = useCallback((event) => {
        if (isKeyboardEvent.primary(event, 'k')) {
            event.preventDefault();
            setIsEditingURL(true);
        }
        else if (isKeyboardEvent.primaryShift(event, 'k')) {
            unlink();
            linkRef.current?.focus();
        }
    }, [unlink]);
    const blockProps = useBlockProps({
        className: classnames('jankx-advanced-button', {
            [`icon-position-${iconPosition}`]: hasInnerBlocks && iconPosition,
        }),
        onKeyDown,
    });
    const borderProps = getBorderClassesAndStyles(attributes);
    // Check if button has no color settings
    const hasNoColorSettings = !backgroundColor?.slug &&
        !backgroundColor?.color &&
        !textColor?.slug &&
        !textColor?.color &&
        !attributes.gradient &&
        !attributes.style?.color?.background &&
        !attributes.style?.color?.text &&
        !attributes.style?.color?.gradient;
    const buttonClasses = classnames('jankx-advanced-button__link', borderProps?.className, {
        [`has-${backgroundColor?.slug}-background-color`]: backgroundColor?.slug,
        [`has-${textColor?.slug}-color`]: textColor?.slug,
        'has-background': backgroundColor?.color,
        'has-text-color': textColor?.color,
        [`icon-position-${iconPosition}`]: hasInnerBlocks && iconPosition,
        'is-default-colors': hasNoColorSettings,
        [`hover-ani-${hoverAnimation}`]: hoverAnimation !== 'none',
        [`unhover-ani-${unhoverAnimation}`]: unhoverAnimation !== 'none',
    });
    // Build button styles - gradient takes priority over background color
    const buttonStyles = {
        ...blockProps.style,
        ...borderProps?.style,
    };
    // Apply preset colors if set
    if (backgroundColor?.color) {
        buttonStyles.backgroundColor = backgroundColor.color;
    }
    if (textColor?.color) {
        buttonStyles.color = textColor.color;
    }
    // Apply custom colors from style.color if set (overrides preset colors)
    if (attributes.style?.color?.text) {
        buttonStyles.color = attributes.style.color.text;
    }
    // Apply gradient if set (gradient takes priority over background color)
    if (attributes.style?.color?.gradient) {
        buttonStyles.background = attributes.style.color.gradient;
        // Remove backgroundColor when gradient is set
        delete buttonStyles.backgroundColor;
    }
    else if (attributes.style?.color?.background) {
        // Only apply background color if no gradient is set
        buttonStyles.backgroundColor = attributes.style.color.background;
    }
    // For Text Link style, we want to force transparency and remove padding in the editor preview
    const isTextLink = attributes.className?.includes('is-style-text-link');
    if (isTextLink) {
        delete buttonStyles.backgroundColor;
        delete buttonStyles.background;
        buttonStyles.border = 'none';
        buttonStyles.padding = '0';
    }
    // Render button content - Always render InnerBlocks at the same position
    // Use CSS flex-order to control visual position
    const renderButtonInnerContent = () => (_jsxs(_Fragment, { children: [!renderIconOutside && (_jsx("span", { className: "button-icon-wrapper", children: _jsx(InnerBlocks, { allowedBlocks: ALLOWED_BLOCKS, template: ICON_TEMPLATE, templateLock: false, renderAppender: hasInnerBlocks ? false : InnerBlocks.ButtonBlockAppender, orientation: "horizontal", __experimentalCaptureToolbars: false }) })), showLabel && (_jsx(RichText, { tagName: "span", className: "button-text", value: text, onChange: (value) => setAttributes({ text: value }), placeholder: placeholder || __('Button text...', 'jankx'), allowedFormats: [] }))] }));
    const renderIconMarkup = () => (renderIconOutside ? (_jsx("span", { className: "button-icon-wrapper", children: _jsx(InnerBlocks, { allowedBlocks: ALLOWED_BLOCKS, template: ICON_TEMPLATE, templateLock: false, renderAppender: hasInnerBlocks ? false : InnerBlocks.ButtonBlockAppender, orientation: "horizontal", __experimentalCaptureToolbars: false }) })) : null);
    const renderButton = (content) => {
        const iconMarkup = renderIconMarkup();
        if (!renderIconOutside)
            return _jsx("div", { ...blockProps, children: content });
        return (_jsxs("div", { ...blockProps, children: [iconPosition === 'left' || iconPosition === 'top' ? iconMarkup : null, content, iconPosition === 'right' || iconPosition === 'bottom' ? iconMarkup : null] }));
    };
    // Render button element based on trigger type
    let buttonElement = null;
    switch (triggerType) {
        case 'link':
            buttonElement = (_jsx("a", { className: buttonClasses, target: linkTarget, rel: rel, style: buttonStyles, title: title, "data-hover-ani": hoverAnimation !== 'none' ? hoverAnimation : undefined, "data-unhover-ani": unhoverAnimation !== 'none' ? unhoverAnimation : undefined, onClick: (e) => {
                    // In editor, prevent default navigation completely
                    e.preventDefault();
                }, onClickCapture: (e) => {
                    // Allow appender clicks to work normally
                    const target = e.target;
                    if (target.closest('.block-list-appender')) {
                        // Don't prevent appender clicks
                        return;
                    }
                    // Allow clicks within inner blocks to propagate normally
                    // This ensures icon blocks can handle their own events
                    if (target.closest('.block-editor-block-list__block:not(.block-list-appender)')) {
                        // Let inner blocks handle their own interactions
                        return;
                    }
                }, children: renderButtonInnerContent() }));
            break;
        case 'button':
            buttonElement = (_jsx("button", { className: buttonClasses, type: buttonType, style: buttonStyles, title: title, "data-hover-ani": hoverAnimation !== 'none' ? hoverAnimation : undefined, "data-unhover-ani": unhoverAnimation !== 'none' ? unhoverAnimation : undefined, children: renderButtonInnerContent() }));
            break;
        case 'detail-link':
            buttonElement = (_jsx("a", { className: buttonClasses, href: "javascript:void(0)", style: buttonStyles, title: title, "data-hover-ani": hoverAnimation !== 'none' ? hoverAnimation : undefined, "data-unhover-ani": unhoverAnimation !== 'none' ? unhoverAnimation : undefined, onClick: (e) => {
                    // Prevent navigation in editor
                    e.preventDefault();
                }, onClickCapture: (e) => {
                    // Allow clicks within inner blocks to propagate normally
                    const target = e.target;
                    if (target.closest('.block-list-appender') || target.closest('.block-editor-block-list__block:not(.block-list-appender)')) {
                        return; // Let inner blocks handle their own interactions
                    }
                }, children: renderButtonInnerContent() }));
            break;
        case 'modal':
            buttonElement = (_jsx("button", { className: buttonClasses, type: "button", "data-modal-id": modalId, style: buttonStyles, title: title, "data-hover-ani": hoverAnimation !== 'none' ? hoverAnimation : undefined, "data-unhover-ani": unhoverAnimation !== 'none' ? unhoverAnimation : undefined, children: renderButtonInnerContent() }));
            break;
        default:
            buttonElement = (_jsx("button", { className: buttonClasses, style: buttonStyles, title: title, "data-hover-ani": hoverAnimation !== 'none' ? hoverAnimation : undefined, "data-unhover-ani": unhoverAnimation !== 'none' ? unhoverAnimation : undefined, children: renderButtonInnerContent() }));
    }
    return (_jsxs(_Fragment, { children: [_jsx(BlockControls, { group: "block", children: triggerType === 'link' && (_jsxs(_Fragment, { children: [_jsx(ToolbarButton, { ref: linkRef, name: "link", icon: link, title: __('Link', 'jankx'), shortcut: displayShortcut.primary('k'), onClick: () => setIsEditingURL(true), isActive: isURLSet }), isEditingURL && (_jsx(Popover, { className: "wp-block-jankx-advanced-button__link-popover", anchor: linkRef?.current, offset: 12, placement: "bottom", onClose: () => {
                                setIsEditingURL(false);
                                linkRef.current?.focus();
                            }, focusOnMount: isEditingURL ? 'firstElement' : false, variant: "alternate", children: _jsx(LinkControl, { value: { url, opensInNewTab }, onChange: ({ url: newURL = '', opensInNewTab: newOpensInNewTab, }) => {
                                    setAttributes({ url: newURL });
                                    if (opensInNewTab !== newOpensInNewTab) {
                                        onToggleOpenInNewTab(newOpensInNewTab);
                                    }
                                }, onRemove: () => {
                                    unlink();
                                    linkRef.current?.focus();
                                }, settings: [
                                    {
                                        id: 'opensInNewTab',
                                        title: __('Open in new tab', 'jankx'),
                                    },
                                ], showSuggestions: true, showInitialSuggestions: true }) }))] })) }), _jsxs(InspectorControls, { group: "settings", children: [_jsxs(ToolsPanel, { label: __('Trigger Settings', 'jankx'), resetAll: () => {
                            setAttributes({
                                triggerType: 'link',
                                buttonType: 'button',
                                url: undefined,
                                linkTarget: undefined,
                                rel: undefined,
                                conditionType: 'always',
                                showForPostType: '',
                            });
                        }, children: [_jsxs(ToolsPanelItem, { label: __('Condition Type', 'jankx'), isShownByDefault: true, hasValue: () => conditionType !== 'always', onDeselect: () => {
                                    setAttributes({ conditionType: 'always', showForPostType: '' });
                                }, children: [_jsx(SelectControl, { label: __('Condition Type', 'jankx'), value: conditionType, options: [
                                            { label: __('Always show', 'jankx'), value: 'always' },
                                            { label: __('Only show for Post Type', 'jankx'), value: 'post-type' },
                                        ], onChange: (value) => setAttributes({ conditionType: value }), help: __('Choose when this button should be visible', 'jankx') }), conditionType === 'post-type' && (_jsx(SelectControl, { label: __('Post Type', 'jankx'), value: showForPostType || '', options: [{ label: __('Select Post Type', 'jankx'), value: '' }, ...postTypeOptions], onChange: (value) => setAttributes({ showForPostType: value }), help: __('Only render this button for the selected post type', 'jankx') }))] }), _jsx(ToolsPanelItem, { label: __('Trigger Type', 'jankx'), isShownByDefault: true, hasValue: () => triggerType !== 'link', onDeselect: () => setAttributes({ triggerType: 'link' }), children: _jsx(SelectControl, { label: __('Trigger Type', 'jankx'), value: triggerType, options: [
                                        { label: __('🔗 Link - Custom URL', 'jankx'), value: 'link' },
                                        { label: __('🔘 Button - Form Action', 'jankx'), value: 'button' },
                                        { label: __('📄 Detail Link - Current Object', 'jankx'), value: 'detail-link' },
                                        { label: __('🪟 Modal - Open Modal', 'jankx'), value: 'modal' }
                                    ], onChange: (value) => setAttributes({ triggerType: value }), help: __('Choose what happens when users click this button', 'jankx') }) }), triggerType === 'link' && (_jsxs(_Fragment, { children: [_jsx(ToolsPanelItem, { label: __('URL', 'jankx'), isShownByDefault: true, hasValue: () => !!url, onDeselect: () => setAttributes({ url: undefined }), children: _jsx(TextControl, { label: __('URL', 'jankx'), value: url || '', onChange: (value) => setAttributes({ url: value }), placeholder: __('Enter URL...', 'jankx'), __nextHasNoMarginBottom: true }) }), _jsx(ToolsPanelItem, { label: __('Open in new tab', 'jankx'), isShownByDefault: true, hasValue: () => opensInNewTab, onDeselect: () => onToggleOpenInNewTab(false), children: _jsx(ToggleControl, { label: __('Open in new tab', 'jankx'), checked: opensInNewTab, onChange: onToggleOpenInNewTab, help: __('Adds target="_blank" and rel="noreferrer noopener"', 'jankx') }) })] })), triggerType === 'button' && (_jsx(ToolsPanelItem, { label: __('Button Type', 'jankx'), isShownByDefault: true, hasValue: () => buttonType !== 'button', onDeselect: () => setAttributes({ buttonType: 'button' }), children: _jsx(SelectControl, { label: __('Button Type', 'jankx'), value: buttonType, options: [
                                        { label: __('Button', 'jankx'), value: 'button' },
                                        { label: __('Submit', 'jankx'), value: 'submit' },
                                        { label: __('Reset', 'jankx'), value: 'reset' }
                                    ], onChange: (value) => setAttributes({ buttonType: value }), help: __('Defines the button behavior in forms', 'jankx') }) })), triggerType === 'detail-link' && (_jsx("div", { style: {
                                    padding: '12px',
                                    background: '#fff3cd',
                                    borderRadius: '4px',
                                    marginTop: '12px',
                                    border: '1px solid #ffeaa7'
                                }, children: _jsxs("p", { style: { margin: '0', fontSize: '12px', color: '#856404' }, children: ["\uD83D\uDCC4 ", __('This button will link to the current post/page permalink on the frontend.', 'jankx')] }) })), triggerType === 'modal' && (_jsxs(_Fragment, { children: [_jsxs(ToolsPanelItem, { label: __('Modal ID', 'jankx'), isShownByDefault: true, hasValue: () => !!modalId, onDeselect: () => {
                                            setAttributes({ modalId: undefined });
                                            setIsCustomModalId(false);
                                        }, children: [_jsx(SelectControl, { label: __('Modal ID', 'jankx'), value: isCustomModalId ? '__custom__' : (modalId || ''), options: [
                                                    { label: __('Select a modal...', 'jankx'), value: '' },
                                                    ...modalBlocks.map((modal) => ({
                                                        label: modal.title,
                                                        value: modal.id,
                                                    })),
                                                    { label: __('✏️ Custom ID (Manual Input)', 'jankx'), value: '__custom__' },
                                                ], onChange: (value) => {
                                                    if (value === '__custom__') {
                                                        setIsCustomModalId(true);
                                                        setAttributes({ modalId: '' });
                                                    }
                                                    else {
                                                        setIsCustomModalId(false);
                                                        setAttributes({ modalId: value });
                                                    }
                                                }, help: isCustomModalId
                                                    ? __('Enter custom modal ID in the field below', 'jankx')
                                                    : modalBlocks.length === 0
                                                        ? __('No modal blocks found on this page. Add a modal block first or use custom ID.', 'jankx')
                                                        : __('Select a modal block to trigger, or choose custom ID', 'jankx'), __nextHasNoMarginBottom: true }), isCustomModalId && (_jsx(_Fragment, { children: _jsx("div", { style: { marginTop: '12px' }, children: _jsx(TextControl, { label: __('Custom Modal ID', 'jankx'), value: modalId || '', onChange: (value) => setAttributes({ modalId: value }), placeholder: __('e.g. modal-contact-form', 'jankx'), help: __('Enter the ID of your modal. Must match exactly with the modal block ID.', 'jankx'), __nextHasNoMarginBottom: true }) }) }))] }), _jsxs("div", { style: { marginTop: '16px', borderTop: '1px solid #ddd', paddingTop: '16px', gridColumn: '1 / -1' }, children: [_jsx("p", { style: { fontSize: '13px', fontWeight: 600, marginBottom: '8px' }, children: __('Form Data Mapping', 'jankx') }), !shareEnabled && (_jsx("div", { style: {
                                                    padding: '10px',
                                                    borderRadius: '6px',
                                                    background: '#fff3cd',
                                                    border: '1px solid #ffeaa7',
                                                    marginBottom: '12px'
                                                }, children: _jsx("p", { style: { margin: 0, fontSize: '12px', color: '#856404' }, children: __('Enable Share Data options above to use mapping. Without shared data attributes, mappings will have no values.', 'jankx') }) })), shareEnabled && (formMappings || []).map((item, index) => (_jsxs("div", { style: {
                                                    border: '1px solid #e0e0e0',
                                                    borderRadius: '6px',
                                                    padding: '10px',
                                                    marginBottom: '10px',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    gap: '8px'
                                                }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' }, children: [_jsxs("span", { style: { fontSize: '12px', fontWeight: 600 }, children: [__('Mapping', 'jankx'), " #", index + 1] }), _jsx("button", { type: "button", onClick: () => {
                                                                    const next = (formMappings || []).filter((_, i) => i !== index);
                                                                    setAttributes({ formMappings: next });
                                                                }, style: {
                                                                    background: 'none',
                                                                    border: 'none',
                                                                    cursor: 'pointer',
                                                                    color: '#cc1818',
                                                                    padding: '4px',
                                                                }, "aria-label": __('Remove mapping', 'jankx'), title: __('Remove mapping', 'jankx'), children: "\u2715" })] }), _jsx(SelectControl, { label: __('Source', 'jankx'), value: item.source, options: [
                                                            { label: __('Button Title', 'jankx'), value: 'button_title' },
                                                            { label: __('Current Post Title', 'jankx'), value: 'current_post_title' },
                                                            { label: __('Current Post ID', 'jankx'), value: 'current_post_id' },
                                                            { label: __('Current URL', 'jankx'), value: 'current_url' },
                                                            { label: __('Featured Image URL', 'jankx'), value: 'current_featured_image_url' },
                                                            { label: __('Featured Image ID', 'jankx'), value: 'current_featured_image_id' },
                                                        ], onChange: (val) => {
                                                            const next = [...formMappings];
                                                            next[index] = { ...next[index], source: val };
                                                            setAttributes({ formMappings: next });
                                                        }, __nextHasNoMarginBottom: true }), _jsx(SelectControl, { label: __('Apply To', 'jankx'), value: item.mode || 'value', options: [
                                                            { label: __('Value', 'jankx'), value: 'value' },
                                                            { label: __('Attribute', 'jankx'), value: 'attribute' },
                                                            { label: __('Text Content', 'jankx'), value: 'text' },
                                                        ], onChange: (val) => {
                                                            const next = [...formMappings];
                                                            next[index] = { ...next[index], mode: val };
                                                            setAttributes({ formMappings: next });
                                                        }, __nextHasNoMarginBottom: true }), (item.mode || 'value') === 'attribute' && (_jsx(TextControl, { label: __('Attribute Name', 'jankx'), placeholder: "e.g. value, href, src, alt, data-foo", value: item.attributeName || '', onChange: (val) => {
                                                            const next = [...formMappings];
                                                            next[index] = { ...next[index], attributeName: val };
                                                            setAttributes({ formMappings: next });
                                                        }, __nextHasNoMarginBottom: true })), _jsx(TextControl, { label: __('Destination Selector', 'jankx'), placeholder: "e.g. input[name='your-name']", value: item.selector || '', onChange: (val) => {
                                                            const next = [...formMappings];
                                                            next[index] = { ...next[index], selector: val };
                                                            setAttributes({ formMappings: next });
                                                        }, __nextHasNoMarginBottom: true })] }, index))), _jsxs("button", { type: "button", onClick: () => {
                                                    setAttributes({ formMappings: [...(formMappings || []), { source: 'button_title', selector: '', mode: 'value', attributeName: '' }] });
                                                }, style: {
                                                    background: '#f0f0f0',
                                                    border: '1px dashed #ccc',
                                                    width: '100%',
                                                    padding: '6px',
                                                    cursor: 'pointer',
                                                    borderRadius: '4px',
                                                    fontSize: '12px'
                                                }, disabled: !shareEnabled, children: ["+ ", __('Add Mapping', 'jankx')] }), _jsx("p", { style: { fontSize: '11px', color: '#666', marginTop: '4px', fontStyle: 'italic' }, children: __('When clicking the button, values will be pushed into matched elements inside the modal.', 'jankx') })] }), _jsx(ToolsPanelItem, { label: __('Share Data with Modal', 'jankx'), isShownByDefault: true, hasValue: () => !!(modalShareObjectId || modalSharePostTitle || modalShareCurrentUrl), onDeselect: () => setAttributes({
                                            modalShareObjectId: false,
                                            modalSharePostTitle: false,
                                            modalShareCurrentUrl: false
                                        }), children: _jsxs("div", { style: { marginBottom: '12px' }, children: [_jsx("p", { style: { fontSize: '12px', color: '#666', marginBottom: '8px' }, children: __('Share current post data with modal:', 'jankx') }), _jsx(ToggleControl, { label: __('Share Object ID', 'jankx'), checked: modalShareObjectId || false, onChange: (value) => setAttributes({ modalShareObjectId: value }), help: __('Share current post/page ID', 'jankx'), __nextHasNoMarginBottom: true }), _jsx(ToggleControl, { label: __('Share Post Title', 'jankx'), checked: modalSharePostTitle || false, onChange: (value) => setAttributes({ modalSharePostTitle: value }), help: __('Share current post/page title', 'jankx'), __nextHasNoMarginBottom: true }), _jsx(ToggleControl, { label: __('Share Current URL', 'jankx'), checked: modalShareCurrentUrl || false, onChange: (value) => setAttributes({ modalShareCurrentUrl: value }), help: __('Share current page URL', 'jankx'), __nextHasNoMarginBottom: true }), _jsx(ToggleControl, { label: __('Share Featured Image ID', 'jankx'), checked: modalShareFeaturedImageId || false, onChange: (value) => setAttributes({ modalShareFeaturedImageId: value }), help: __('Share current post featured image ID', 'jankx'), __nextHasNoMarginBottom: true }), _jsx(ToggleControl, { label: __('Share Featured Image URL', 'jankx'), checked: modalShareFeaturedImageUrl || false, onChange: (value) => setAttributes({ modalShareFeaturedImageUrl: value }), help: __('Share current post featured image URL', 'jankx'), __nextHasNoMarginBottom: true }), modalShareFeaturedImageUrl && (_jsx(SelectControl, { label: __('Featured image size', 'jankx'), value: modalFeaturedImageSize, options: [
                                                        { label: 'thumbnail', value: 'thumbnail' },
                                                        { label: 'medium', value: 'medium' },
                                                        { label: 'medium_large', value: 'medium_large' },
                                                        { label: 'large', value: 'large' },
                                                        { label: 'full', value: 'full' }
                                                    ], onChange: (value) => setAttributes({ modalFeaturedImageSize: value }), __nextHasNoMarginBottom: true })), _jsxs("div", { style: { marginTop: '16px', borderTop: '1px solid #ddd', paddingTop: '16px' }, children: [_jsx("p", { style: { fontSize: '13px', fontWeight: 600, marginBottom: '8px' }, children: __('Custom Form Data', 'jankx') }), formData.map((item, index) => (_jsxs("div", { style: { display: 'flex', gap: '8px', marginBottom: '8px' }, children: [_jsx(TextControl, { placeholder: "Key", value: item.key, onChange: (val) => {
                                                                        const newFormData = [...formData];
                                                                        newFormData[index].key = val;
                                                                        setAttributes({ formData: newFormData });
                                                                    }, __nextHasNoMarginBottom: true }), _jsx(TextControl, { placeholder: "Value", value: item.value, onChange: (val) => {
                                                                        const newFormData = [...formData];
                                                                        newFormData[index].value = val;
                                                                        setAttributes({ formData: newFormData });
                                                                    }, __nextHasNoMarginBottom: true }), _jsx("button", { type: "button", onClick: () => {
                                                                        const newFormData = formData.filter((_, i) => i !== index);
                                                                        setAttributes({ formData: newFormData });
                                                                    }, style: {
                                                                        background: 'none',
                                                                        border: 'none',
                                                                        cursor: 'pointer',
                                                                        color: '#cc1818',
                                                                        padding: '4px'
                                                                    }, children: "\u2715" })] }, index))), _jsxs("button", { type: "button", onClick: () => {
                                                                setAttributes({ formData: [...formData, { key: '', value: '' }] });
                                                            }, style: {
                                                                background: '#f0f0f0',
                                                                border: '1px dashed #ccc',
                                                                width: '100%',
                                                                padding: '6px',
                                                                cursor: 'pointer',
                                                                borderRadius: '4px',
                                                                fontSize: '12px'
                                                            }, children: ["+ ", __('Add Data Item', 'jankx')] }), _jsx("p", { style: { fontSize: '11px', color: '#666', marginTop: '4px', fontStyle: 'italic' }, children: __('These values will be sent to the modal form. Use {post_title}, {price}, {post_id} as placeholders.', 'jankx') })] })] }) })] })), _jsx(ToolsPanelItem, { label: __('Show Label', 'jankx'), isShownByDefault: true, hasValue: () => !showLabel, onDeselect: () => setAttributes({ showLabel: true }), children: _jsx(ToggleControl, { label: __('Show Label', 'jankx'), checked: showLabel, onChange: (value) => setAttributes({ showLabel: value }), help: __('Show or hide button label text', 'jankx'), __nextHasNoMarginBottom: true }) }), hasInnerBlocks && (_jsxs(ToolsPanelItem, { label: __('Icon Position', 'jankx'), isShownByDefault: true, hasValue: () => iconPosition !== 'left' || renderIconOutside, onDeselect: () => setAttributes({ iconPosition: 'left', renderIconOutside: false }), children: [_jsx(SelectControl, { label: __('Icon Position', 'jankx'), value: iconPosition, options: [
                                            { label: __('⬅️ Left', 'jankx'), value: 'left' },
                                            { label: __('➡️ Right', 'jankx'), value: 'right' },
                                            { label: __('⬆️ Top', 'jankx'), value: 'top' },
                                            { label: __('⬇️ Bottom', 'jankx'), value: 'bottom' }
                                        ], onChange: (value) => setAttributes({ iconPosition: value }), help: __('Choose where to display the icon relative to text', 'jankx') }), _jsx(ToggleControl, { label: __('Render Icon Outside Link', 'jankx'), checked: renderIconOutside, onChange: (value) => setAttributes({ renderIconOutside: value }), help: __('Place the icon outside the <a> or <button> tag', 'jankx'), __nextHasNoMarginBottom: true })] }))] }), _jsxs(ToolsPanel, { label: __('Animation Settings', 'jankx'), resetAll: () => {
                            setAttributes({
                                hoverAnimation: 'none',
                                unhoverAnimation: 'none',
                            });
                        }, children: [_jsx(ToolsPanelItem, { label: __('Hover Animation', 'jankx'), isShownByDefault: true, hasValue: () => hoverAnimation !== 'none', onDeselect: () => setAttributes({ hoverAnimation: 'none' }), children: _jsx(SelectControl, { label: __('Hover Animation', 'jankx'), value: hoverAnimation, options: [
                                        { label: __('None', 'jankx'), value: 'none' },
                                        { label: __('Bounce', 'jankx'), value: 'bounce' },
                                        { label: __('Flash', 'jankx'), value: 'flash' },
                                        { label: __('Pulse', 'jankx'), value: 'pulse' },
                                        { label: __('Rubber Band', 'jankx'), value: 'rubberBand' },
                                        { label: __('Shake', 'jankx'), value: 'shakeX' },
                                        { label: __('Swing', 'jankx'), value: 'swing' },
                                        { label: __('Tada', 'jankx'), value: 'tada' },
                                        { label: __('Wobble', 'jankx'), value: 'wobble' },
                                        { label: __('Jello', 'jankx'), value: 'jello' },
                                        { label: __('Heart Beat', 'jankx'), value: 'heartBeat' },
                                    ], onChange: (value) => setAttributes({ hoverAnimation: value }), help: __('Animation effect when hovering over the button', 'jankx') }) }), _jsx(ToolsPanelItem, { label: __('Unhover Animation', 'jankx'), isShownByDefault: true, hasValue: () => unhoverAnimation !== 'none', onDeselect: () => setAttributes({ unhoverAnimation: 'none' }), children: _jsx(SelectControl, { label: __('Unhover Animation', 'jankx'), value: unhoverAnimation, options: [
                                        { label: __('None', 'jankx'), value: 'none' },
                                        { label: __('Bounce', 'jankx'), value: 'bounce' },
                                        { label: __('Flash', 'jankx'), value: 'flash' },
                                        { label: __('Pulse', 'jankx'), value: 'pulse' },
                                        { label: __('Rubber Band', 'jankx'), value: 'rubberBand' },
                                        { label: __('Shake', 'jankx'), value: 'shakeX' },
                                        { label: __('Swing', 'jankx'), value: 'swing' },
                                        { label: __('Tada', 'jankx'), value: 'tada' },
                                        { label: __('Wobble', 'jankx'), value: 'wobble' },
                                        { label: __('Jello', 'jankx'), value: 'jello' },
                                        { label: __('Heart Beat', 'jankx'), value: 'heartBeat' },
                                    ], onChange: (value) => setAttributes({ unhoverAnimation: value }), help: __('Animation effect when mouse leaves the button', 'jankx') }) })] })] }), _jsxs(InspectorControls, { group: "advanced", children: [_jsx(TextControl, { label: __('Link rel', 'jankx'), value: rel || '', onChange: (value) => setAttributes({ rel: value }), help: __('Additional rel attributes for the link', 'jankx'), __nextHasNoMarginBottom: true }), _jsx(TextControl, { label: __('Title attribute', 'jankx'), value: title || '', onChange: (value) => setAttributes({ title: value }), help: _jsxs(_Fragment, { children: [__('Describe the role of this button on the page.', 'jankx'), _jsx(ExternalLink, { href: "https://www.w3.org/TR/html52/dom.html#the-title-attribute", children: __('Note: many devices and browsers do not display this text', 'jankx') })] }), __nextHasNoMarginBottom: true })] }), renderButton(buttonElement)] }));
}
const colorAttributes = {
    backgroundColor: 'background-color',
    textColor: 'text-color',
};
export default withColors(colorAttributes)(Edit);
