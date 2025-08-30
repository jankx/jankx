/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./blocks/image-button/block.json":
/*!****************************************!*\
  !*** ./blocks/image-button/block.json ***!
  \****************************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"jankx/image-button","title":"Image Button","category":"jankx-blocks","description":"Prompt visitors to take action with a button-style link.","keywords":["link","button","image"],"textdomain":"jankx","attributes":{"tagName":{"type":"string","enum":["a","button"],"default":"a"},"type":{"type":"string","default":"button"},"textAlign":{"type":"string"},"url":{"type":"string","source":"attribute","selector":"a","attribute":"href","role":"content"},"title":{"type":"string","source":"attribute","selector":"a,button","attribute":"title","role":"content"},"text":{"type":"rich-text","source":"rich-text","selector":"a,button","role":"content"},"linkTarget":{"type":"string","source":"attribute","selector":"a","attribute":"target","role":"content"},"rel":{"type":"string","source":"attribute","selector":"a","attribute":"rel","role":"content"},"placeholder":{"type":"string"},"backgroundColor":{"type":"string"},"textColor":{"type":"string"},"gradient":{"type":"string"},"width":{"type":"number"},"imageId":{"type":"number"},"imageUrl":{"type":"string"},"imageAlt":{"type":"string"},"imageSize":{"type":"string","default":"20px"},"imageWidth":{"type":"number"},"imageHeight":{"type":"number","default":20},"imageSizeSlug":{"type":"string"},"imageMarginRight":{"type":"string","default":"5px"}},"supports":{"anchor":true,"splitting":true,"align":false,"alignWide":false,"color":{"__experimentalSkipSerialization":true,"gradients":true,"__experimentalDefaultControls":{"background":true,"text":true}},"typography":{"__experimentalSkipSerialization":["fontSize","lineHeight","fontFamily","fontWeight","fontStyle","textTransform","textDecoration","letterSpacing"],"fontSize":true,"lineHeight":true,"__experimentalFontFamily":true,"__experimentalFontWeight":true,"__experimentalFontStyle":true,"__experimentalTextTransform":true,"__experimentalTextDecoration":true,"__experimentalLetterSpacing":true,"__experimentalWritingMode":true,"__experimentalDefaultControls":{"fontSize":true}},"reusable":false,"shadow":{"__experimentalSkipSerialization":true},"spacing":{"__experimentalSkipSerialization":true,"padding":["horizontal","vertical"],"__experimentalDefaultControls":{"padding":true}},"__experimentalBorder":{"color":true,"radius":true,"style":true,"width":true,"__experimentalSkipSerialization":true,"__experimentalDefaultControls":{"color":true,"radius":true,"style":true,"width":true}},"interactivity":{"clientNavigation":true}},"styles":[{"name":"fill","label":"Fill","isDefault":true},{"name":"outline","label":"Outline"}],"editorScript":"build/index.js","editorStyle":"build/editor.css","style":"build/style.css","selectors":{"root":".wp-block-jankx-image-button .wp-block-jankx-image-button__link","typography":{"writingMode":".wp-block-jankx-image-button"}}}');

/***/ }),

/***/ "./blocks/image-button/constants.ts":
/*!******************************************!*\
  !*** ./blocks/image-button/constants.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   NEW_TAB_REL: () => (/* binding */ NEW_TAB_REL),
/* harmony export */   NEW_TAB_TARGET: () => (/* binding */ NEW_TAB_TARGET),
/* harmony export */   NOFOLLOW_REL: () => (/* binding */ NOFOLLOW_REL)
/* harmony export */ });
const NEW_TAB_REL = 'noreferrer noopener';
const NEW_TAB_TARGET = '_blank';
const NOFOLLOW_REL = 'nofollow';


/***/ }),

/***/ "./blocks/image-button/deprecated.tsx":
/*!********************************************!*\
  !*** ./blocks/image-button/deprecated.tsx ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);
/**
 * WordPress dependencies
 */

/**
 * Deprecated version of the image button block.
 * This is used for backward compatibility with older versions.
 */

const deprecated = [{
        attributes: {
            tagName: {
                type: 'string',
                default: 'a'
            },
            text: {
                type: 'string',
                source: 'html',
                selector: 'a,button'
            },
            url: {
                type: 'string',
                source: 'attribute',
                selector: 'a',
                attribute: 'href'
            },
            linkTarget: {
                type: 'string',
                source: 'attribute',
                selector: 'a',
                attribute: 'target'
            },
            rel: {
                type: 'string',
                source: 'attribute',
                selector: 'a',
                attribute: 'rel'
            },
            placeholder: {
                type: 'string'
            },
            textAlign: {
                type: 'string'
            },
            width: {
                type: 'number'
            },
            imageId: {
                type: 'number'
            },
            imageUrl: {
                type: 'string'
            },
            imageAlt: {
                type: 'string'
            },
            imageHeight: {
                type: 'number',
                default: 20
            },
            imageMarginRight: {
                type: 'string',
                default: '5px'
            }
        },
        save: ({ attributes }) => {
            const { tagName, text, url, linkTarget, rel, textAlign, width, imageUrl, imageAlt, imageHeight, imageMarginRight } = attributes;
            const TagName = tagName || 'a';
            const isButtonTag = 'button' === TagName;
            const wrapperClasses = ['wp-block-jankx-image-button'];
            if (width) {
                wrapperClasses.push(`has-custom-width wp-block-jankx-image-button__width-${width}`);
            }
            const buttonClasses = ['wp-block-jankx-image-button__link'];
            if (textAlign) {
                buttonClasses.push(`has-text-align-${textAlign}`);
            }
            return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
                ..._wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.useBlockProps.save({
                    className: wrapperClasses.join(' ')
                }),
                children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(TagName, {
                    type: isButtonTag ? 'button' : null,
                    className: buttonClasses.join(' '),
                    href: isButtonTag ? null : url,
                    target: isButtonTag ? null : linkTarget,
                    rel: isButtonTag ? null : rel,
                    children: [imageUrl && /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("img", {
                            src: imageUrl,
                            alt: imageAlt || '',
                            style: {
                                height: imageHeight,
                                width: 'auto',
                                marginRight: imageMarginRight || '5px'
                            },
                            className: "wp-block-jankx-image-button__image"
                        }), text && /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.RichText.Content, {
                            value: text
                        })]
                })
            });
        }
    }];
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (deprecated);


/***/ }),

/***/ "./blocks/image-button/edit.tsx":
/*!**************************************!*\
  !*** ./blocks/image-button/edit.tsx ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var clsx__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! clsx */ "./node_modules/clsx/dist/clsx.mjs");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./constants */ "./blocks/image-button/constants.ts");
/* harmony import */ var _get_updated_link_attributes__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./get-updated-link-attributes */ "./blocks/image-button/get-updated-link-attributes.ts");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _wordpress_keycodes__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @wordpress/keycodes */ "@wordpress/keycodes");
/* harmony import */ var _wordpress_keycodes__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_wordpress_keycodes__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/link.js");
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/link-off.js");
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/plus.js");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @wordpress/compose */ "@wordpress/compose");
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(_wordpress_compose__WEBPACK_IMPORTED_MODULE_12__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_13___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_13__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__);
/**
 * External dependencies
 */

/**
 * Internal dependencies
 */


/**
 * WordPress dependencies
 */










const LINK_SETTINGS = [..._wordpress_block_editor__WEBPACK_IMPORTED_MODULE_6__.LinkControl.DEFAULT_LINK_SETTINGS, {
        id: 'nofollow',
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Mark as nofollow')
    }];
function useEnter(props) {
    const { replaceBlocks, selectionChange } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_13__.useDispatch)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_6__.store);
    const { getBlock, getBlockRootClientId, getBlockIndex } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_13__.useSelect)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_6__.store);
    const propsRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useRef)(props);
    propsRef.current = props;
    return (0,_wordpress_compose__WEBPACK_IMPORTED_MODULE_12__.useRefEffect)(element => {
        function onKeyDown(event) {
            if (event.defaultPrevented || event.keyCode !== _wordpress_keycodes__WEBPACK_IMPORTED_MODULE_7__.ENTER) {
                return;
            }
            const { content, clientId } = propsRef.current;
            if (content.length) {
                return;
            }
            event.preventDefault();
            const topParentListBlock = getBlock(getBlockRootClientId(clientId));
            const blockIndex = getBlockIndex(clientId);
            const head = (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_11__.cloneBlock)({
                ...topParentListBlock,
                innerBlocks: topParentListBlock.innerBlocks.slice(0, blockIndex)
            });
            const middle = (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_11__.createBlock)((0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_11__.getDefaultBlockName)());
            const after = topParentListBlock.innerBlocks.slice(blockIndex + 1);
            const tail = after.length ? [(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_11__.cloneBlock)({
                    ...topParentListBlock,
                    innerBlocks: after
                })] : [];
            replaceBlocks(topParentListBlock.clientId, [head, middle, ...tail], 1);
            // We manually change the selection here because we are replacing
            // a different block than the selected one.
            selectionChange(middle.clientId);
        }
        element.addEventListener('keydown', onKeyDown);
        return () => {
            element.removeEventListener('keydown', onKeyDown);
        };
    }, []);
}
function WidthPanel({ selectedWidth, setAttributes }) {
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__.__experimentalToolsPanel, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Settings'),
        resetAll: () => setAttributes({
            width: undefined
        }),
        children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__.__experimentalToolsPanelItem, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Width'),
            isShownByDefault: true,
            hasValue: () => !!selectedWidth,
            onDeselect: () => setAttributes({
                width: undefined
            }),
            __nextHasNoMarginBottom: true,
            children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__.__experimentalToggleGroupControl, {
                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Width'),
                value: selectedWidth,
                onChange: newWidth => setAttributes({
                    width: newWidth
                }),
                isBlock: true,
                __next40pxDefaultSize: true,
                __nextHasNoMarginBottom: true,
                children: [25, 50, 75, 100].map(widthValue => {
                    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__.__experimentalToggleGroupControlOption, {
                        value: widthValue,
                        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.sprintf)(/* translators: %d: Percentage value. */ (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('%d%%'), widthValue)
                    }, widthValue);
                })
            })
        })
    });
}
function ButtonEdit(props) {
    const { attributes, setAttributes, className, isSelected, onReplace, mergeBlocks, clientId, context } = props;
    const { tagName, textAlign, linkTarget, placeholder, rel, style, text, url, width, metadata, imageId, imageUrl, imageAlt, imageHeight, imageMarginRight } = attributes;
    const cleanText = text ? text.replace(/<img[^>]*>/g, '') : '';
    const TagName = tagName || 'a';
    function onKeyDown(event) {
        if (_wordpress_keycodes__WEBPACK_IMPORTED_MODULE_7__.isKeyboardEvent.primary(event, 'k')) {
            startEditing(event);
        }
        else if (_wordpress_keycodes__WEBPACK_IMPORTED_MODULE_7__.isKeyboardEvent.primaryShift(event, 'k')) {
            unlink();
            richTextRef.current?.focus();
        }
    }
    // Use internal state instead of a ref to make sure that the component
    // re-renders when the popover's anchor updates.
    const [popoverAnchor, setPopoverAnchor] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useState)(null);
    const borderProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_6__.__experimentalUseBorderProps)(attributes);
    const colorProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_6__.__experimentalUseColorProps)(attributes);
    const spacingProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_6__.__experimentalGetSpacingClassesAndStyles)(attributes);
    const shadowProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_6__.__experimentalGetShadowClassesAndStyles)(attributes);
    const ref = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useRef)();
    const richTextRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useRef)();
    const blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_6__.useBlockProps)({
        ref: (0,_wordpress_compose__WEBPACK_IMPORTED_MODULE_12__.useMergeRefs)([setPopoverAnchor, ref]),
        onKeyDown
    });
    const blockEditingMode = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_6__.useBlockEditingMode)();
    const [isEditingURL, setIsEditingURL] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useState)(false);
    const isURLSet = !!url;
    const opensInNewTab = linkTarget === _constants__WEBPACK_IMPORTED_MODULE_1__.NEW_TAB_TARGET;
    const nofollow = !!rel?.includes(_constants__WEBPACK_IMPORTED_MODULE_1__.NOFOLLOW_REL);
    const isLinkTag = 'a' === TagName;
    const { createPageEntity, userCanCreatePages, lockUrlControls = false } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_13__.useSelect)(select => {
        if (!isSelected) {
            return {};
        }
        const _settings = select(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_6__.store).getSettings();
        const blockBindingsSource = (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_11__.getBlockBindingsSource)(metadata?.bindings?.url?.source);
        return {
            createPageEntity: _settings.__experimentalCreatePageEntity,
            userCanCreatePages: _settings.__experimentalUserCanCreatePages,
            lockUrlControls: !!metadata?.bindings?.url && !blockBindingsSource?.canUserEditValue?.({
                select,
                context,
                args: metadata?.bindings?.url?.args
            })
        };
    }, [context, isSelected, metadata?.bindings?.url]);
    async function handleCreate(pageTitle) {
        const page = await createPageEntity({
            title: pageTitle,
            status: 'draft'
        });
        return {
            id: page.id,
            type: page.type,
            title: page.title.rendered,
            url: page.link,
            kind: 'post-type'
        };
    }
    function createButtonText(searchTerm) {
        return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.createInterpolateElement)((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.sprintf)(/* translators: %s: search term. */ (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Create page: <mark>%s</mark>'), searchTerm), {
            mark: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsx)("mark", {})
        });
    }
    function startEditing(event) {
        event.preventDefault();
        setIsEditingURL(true);
    }
    function unlink() {
        setAttributes({
            url: undefined,
            linkTarget: undefined,
            rel: undefined
        });
        setIsEditingURL(false);
    }
    (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useEffect)(() => {
        if (!isSelected) {
            setIsEditingURL(false);
        }
    }, [isSelected]);
    // Memoize link value to avoid overriding the LinkControl's internal state.
    // This is a temporary fix. See https://github.com/WordPress/gutenberg/issues/51256.
    const linkValue = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useMemo)(() => ({
        url,
        opensInNewTab,
        nofollow
    }), [url, opensInNewTab, nofollow]);
    const useEnterRef = useEnter({
        content: text,
        clientId
    });
    const mergedRef = (0,_wordpress_compose__WEBPACK_IMPORTED_MODULE_12__.useMergeRefs)([useEnterRef, richTextRef]);
    const [fluidTypographySettings, layout] = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_6__.useSettings)('typography.fluid', 'layout');
    const typographyProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_6__.getTypographyClassesAndStyles)(attributes, {
        typography: {
            fluid: fluidTypographySettings
        },
        layout: {
            wideSize: layout?.wideSize
        }
    });
    const hasNonContentControls = blockEditingMode === 'default';
    const hasBlockControls = hasNonContentControls || isLinkTag && !lockUrlControls;
    // Handle media upload with wp.media API
    const handleMediaUpload = () => {
        if (typeof wp === 'undefined' || !wp.media) {
            console.warn('WordPress media API not available');
            return;
        }
        // Polyfill for _.contains if not available
        if (typeof _ !== 'undefined' && !_.contains) {
            _.contains = function (array, item) {
                return array.indexOf(item) !== -1;
            };
        }
        const frame = wp.media({
            title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Select or Upload Image'),
            button: {
                text: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Use this image')
            },
            multiple: false,
            library: {
                type: 'image'
            }
        });
        frame.on('select', () => {
            const attachment = frame.state().get('selection').first().toJSON();
            setAttributes({
                imageId: attachment.id,
                imageUrl: attachment.url,
                imageAlt: attachment.alt || ''
            });
        });
        frame.open();
    };
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.Fragment, {
        children: [/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsx)("div", {
                ...blockProps,
                className: (0,clsx__WEBPACK_IMPORTED_MODULE_0__["default"])(blockProps.className, {
                    [`has-custom-width wp-block-jankx-image-button__width-${width}`]: width
                }),
                children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsxs)("div", {
                    className: (0,clsx__WEBPACK_IMPORTED_MODULE_0__["default"])('wp-block-jankx-image-button__link-container', 'wp-block-jankx-image-button__link', colorProps.className, borderProps.className, typographyProps.className, {
                        [`has-text-align-${textAlign}`]: textAlign,
                        'no-border-radius': style?.border?.radius === 0,
                        [`has-custom-font-size`]: blockProps.style.fontSize
                    }, (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_6__.__experimentalGetElementClassName)('button')),
                    style: {
                        ...borderProps.style,
                        ...colorProps.style,
                        ...spacingProps.style,
                        ...shadowProps.style,
                        ...typographyProps.style,
                        writingMode: undefined
                    },
                    children: [imageUrl && /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsx)("img", {
                            src: imageUrl,
                            alt: imageAlt || '',
                            style: {
                                height: imageHeight ? `${imageHeight}px` : '20px',
                                width: 'auto',
                                marginRight: imageMarginRight || '5px'
                            },
                            className: "wp-block-jankx-image-button__image"
                        }), /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_6__.RichText, {
                            ref: mergedRef,
                            "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Button text'),
                            placeholder: placeholder || (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Add text…'),
                            value: cleanText,
                            onChange: value => setAttributes({
                                text: value
                            }),
                            withoutInteractiveFormatting: true,
                            allowedFormats: ['core/bold', 'core/italic', 'core/strikethrough', 'core/link'],
                            className: "block-editor-rich-text__editable",
                            onReplace: onReplace,
                            onMerge: mergeBlocks,
                            identifier: "text"
                        })]
                })
            }), hasBlockControls && /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsxs)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_6__.BlockControls, {
                group: "block",
                children: [hasNonContentControls && /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_6__.AlignmentControl, {
                        value: textAlign,
                        onChange: nextAlign => {
                            setAttributes({
                                textAlign: nextAlign
                            });
                        }
                    }), isLinkTag && !lockUrlControls && /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__.ToolbarButton, {
                        name: "link",
                        icon: !isURLSet ? _wordpress_icons__WEBPACK_IMPORTED_MODULE_8__["default"] : _wordpress_icons__WEBPACK_IMPORTED_MODULE_9__["default"],
                        title: !isURLSet ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Link') : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Unlink'),
                        shortcut: !isURLSet ? _wordpress_keycodes__WEBPACK_IMPORTED_MODULE_7__.displayShortcut.primary('k') : _wordpress_keycodes__WEBPACK_IMPORTED_MODULE_7__.displayShortcut.primaryShift('k'),
                        onClick: !isURLSet ? startEditing : unlink,
                        isActive: isURLSet
                    }), /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__.ToolbarButton, {
                        icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_10__["default"],
                        title: imageUrl ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Replace Image') : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Choose Image'),
                        onClick: handleMediaUpload,
                        isActive: !!imageUrl
                    })]
            }), isLinkTag && isSelected && (isEditingURL || isURLSet) && !lockUrlControls && /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__.Popover, {
                placement: "bottom",
                onClose: () => {
                    setIsEditingURL(false);
                    richTextRef.current?.focus();
                },
                anchor: popoverAnchor,
                focusOnMount: isEditingURL ? 'firstElement' : false,
                __unstableSlotName: "__unstable-block-tools-after",
                shift: true,
                children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_6__.LinkControl, {
                    value: linkValue,
                    onChange: ({ url: newURL, opensInNewTab: newOpensInNewTab, nofollow: newNofollow }) => setAttributes((0,_get_updated_link_attributes__WEBPACK_IMPORTED_MODULE_2__.getUpdatedLinkAttributes)({
                        rel,
                        url: newURL,
                        opensInNewTab: newOpensInNewTab,
                        nofollow: newNofollow
                    })),
                    onRemove: () => {
                        unlink();
                        richTextRef.current?.focus();
                    },
                    forceIsEditingLink: isEditingURL,
                    settings: LINK_SETTINGS,
                    createSuggestion: createPageEntity && handleCreate,
                    withCreateSuggestion: userCanCreatePages,
                    createSuggestionButtonText: createButtonText
                })
            }), /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsxs)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_6__.InspectorControls, {
                children: [/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsx)(WidthPanel, {
                        selectedWidth: width,
                        setAttributes: setAttributes
                    }), imageUrl && /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__.PanelBody, {
                        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Image Settings'),
                        initialOpen: false,
                        children: [/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__.RangeControl, {
                                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Image Height'),
                                value: imageHeight || 20,
                                onChange: value => setAttributes({
                                    imageHeight: value
                                }),
                                min: 10,
                                max: 100,
                                step: 1,
                                help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Adjust the height of the image in pixels.')
                            }), /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__.RangeControl, {
                                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Image Margin Right'),
                                value: parseInt(imageMarginRight) || 8,
                                onChange: value => setAttributes({
                                    imageMarginRight: `${value}px`
                                }),
                                min: 0,
                                max: 50,
                                step: 1,
                                help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Adjust the margin between image and text.')
                            }), /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__.TextControl, {
                                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Image Alt Text'),
                                value: imageAlt || '',
                                onChange: value => setAttributes({
                                    imageAlt: value
                                }),
                                help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Alternative text for accessibility.')
                            })]
                    })]
            }), /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsxs)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_6__.InspectorControls, {
                group: "advanced",
                children: [/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__.SelectControl, {
                        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('HTML Element'),
                        value: tagName || 'a',
                        onChange: value => setAttributes({
                            tagName: value
                        }),
                        options: [{
                                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Default (<a>)'),
                                value: 'a'
                            }, {
                                label: '<button>',
                                value: 'button'
                            }]
                    }), isLinkTag && /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__.TextControl, {
                        __next40pxDefaultSize: true,
                        __nextHasNoMarginBottom: true,
                        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Link rel'),
                        value: rel || '',
                        onChange: newRel => setAttributes({
                            rel: newRel
                        })
                    })]
            })]
    });
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ButtonEdit);


/***/ }),

/***/ "./blocks/image-button/get-updated-link-attributes.ts":
/*!************************************************************!*\
  !*** ./blocks/image-button/get-updated-link-attributes.ts ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getUpdatedLinkAttributes: () => (/* binding */ getUpdatedLinkAttributes)
/* harmony export */ });
/**
 * Updates the link attributes based on the provided values.
 *
 * @param {Object} attributes - The current attributes.
 * @param {string} attributes.rel - The current rel attribute.
 * @param {string} attributes.url - The new URL.
 * @param {boolean} attributes.opensInNewTab - Whether the link opens in a new tab.
 * @param {boolean} attributes.nofollow - Whether the link should be marked as nofollow.
 * @return {Object} The updated attributes.
 */
function getUpdatedLinkAttributes({ rel, url, opensInNewTab, nofollow }) {
    const newRel = [];
    if (rel) {
        newRel.push(rel);
    }
    if (nofollow) {
        newRel.push('nofollow');
    }
    return {
        url,
        linkTarget: opensInNewTab ? '_blank' : undefined,
        rel: newRel.length > 0 ? newRel.join(' ') : undefined
    };
}


/***/ }),

/***/ "./blocks/image-button/save.tsx":
/*!**************************************!*\
  !*** ./blocks/image-button/save.tsx ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ save)
/* harmony export */ });
/* harmony import */ var clsx__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! clsx */ "./node_modules/clsx/dist/clsx.mjs");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__);
/**
 * External dependencies
 */

/**
 * WordPress dependencies
 */


function save({ attributes, className }) {
    const { tagName, type, textAlign, fontSize, linkTarget, rel, style, text, title, url, width, imageId, imageUrl, imageAlt, imageHeight, imageMarginRight } = attributes;
    const TagName = tagName || 'a';
    const isButtonTag = 'button' === TagName;
    const buttonType = type || 'button';
    const borderProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.__experimentalGetBorderClassesAndStyles)(attributes);
    const colorProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.__experimentalGetColorClassesAndStyles)(attributes);
    const spacingProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.__experimentalGetSpacingClassesAndStyles)(attributes);
    const shadowProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.__experimentalGetShadowClassesAndStyles)(attributes);
    const typographyProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.getTypographyClassesAndStyles)(attributes);
    const buttonClasses = (0,clsx__WEBPACK_IMPORTED_MODULE_0__["default"])('wp-block-jankx-image-button__link', colorProps.className, borderProps.className, typographyProps.className, {
        [`has-text-align-${textAlign}`]: textAlign,
        // For backwards compatibility add style that isn't provided via
        // block support.
        'no-border-radius': style?.border?.radius === 0,
        [`has-custom-font-size`]: fontSize || style?.typography?.fontSize
    }, (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.__experimentalGetElementClassName)('button'));
    const buttonStyle = {
        ...borderProps.style,
        ...colorProps.style,
        ...spacingProps.style,
        ...shadowProps.style,
        ...typographyProps.style,
        writingMode: undefined
    };
    // The use of a `title` attribute here is soft-deprecated, but still applied
    // if it had already been assigned, for the sake of backward-compatibility.
    // A title will no longer be assigned for new or updated button block links.
    const wrapperClasses = (0,clsx__WEBPACK_IMPORTED_MODULE_0__["default"])(className, {
        [`has-custom-width wp-block-jankx-image-button__width-${width}`]: width
    });
    // Check if text contains img tags
    const textContainsImg = text && text.includes('<img');
    const richText = text && /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText.Content, {
        value: text
    });
    const saveData = /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
        ..._wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps.save({
            className: wrapperClasses
        }),
        children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)(TagName, {
            type: isButtonTag ? buttonType : null,
            className: buttonClasses,
            href: isButtonTag ? null : url,
            title: title,
            style: buttonStyle,
            target: isButtonTag ? null : linkTarget,
            rel: isButtonTag ? null : rel,
            children: [!textContainsImg && imageUrl && /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("img", {
                    src: imageUrl,
                    alt: imageAlt || '',
                    style: {
                        height: imageHeight ? `${imageHeight}px` : '20px',
                        width: 'auto',
                        marginRight: imageMarginRight || '5px'
                    },
                    className: "wp-block-jankx-image-button__image"
                }), richText]
        })
    });
    return saveData;
}


/***/ }),

/***/ "./node_modules/@wordpress/icons/build-module/library/button.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@wordpress/icons/build-module/library/button.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/primitives */ "@wordpress/primitives");
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);
/**
 * WordPress dependencies
 */


const button = /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.SVG, {
  viewBox: "0 0 24 24",
  xmlns: "http://www.w3.org/2000/svg",
  children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.Path, {
    d: "M8 12.5h8V11H8v1.5Z M19 6.5H5a2 2 0 0 0-2 2V15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.5a2 2 0 0 0-2-2ZM5 8h14a.5.5 0 0 1 .5.5V15a.5.5 0 0 1-.5.5H5a.5.5 0 0 1-.5-.5V8.5A.5.5 0 0 1 5 8Z"
  })
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (button);


/***/ }),

/***/ "./node_modules/@wordpress/icons/build-module/library/link-off.js":
/*!************************************************************************!*\
  !*** ./node_modules/@wordpress/icons/build-module/library/link-off.js ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/primitives */ "@wordpress/primitives");
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);
/**
 * WordPress dependencies
 */


const linkOff = /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.SVG, {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.Path, {
    d: "M17.031 4.703 15.576 4l-1.56 3H14v.03l-2.324 4.47H9.5V13h1.396l-1.502 2.889h-.95a3.694 3.694 0 0 1 0-7.389H10V7H8.444a5.194 5.194 0 1 0 0 10.389h.17L7.5 19.53l1.416.719L15.049 8.5h.507a3.694 3.694 0 0 1 0 7.39H14v1.5h1.556a5.194 5.194 0 0 0 .273-10.383l1.202-2.304Z"
  })
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (linkOff);


/***/ }),

/***/ "./node_modules/@wordpress/icons/build-module/library/link.js":
/*!********************************************************************!*\
  !*** ./node_modules/@wordpress/icons/build-module/library/link.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/primitives */ "@wordpress/primitives");
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);
/**
 * WordPress dependencies
 */


const link = /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.SVG, {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.Path, {
    d: "M10 17.389H8.444A5.194 5.194 0 1 1 8.444 7H10v1.5H8.444a3.694 3.694 0 0 0 0 7.389H10v1.5ZM14 7h1.556a5.194 5.194 0 0 1 0 10.39H14v-1.5h1.556a3.694 3.694 0 0 0 0-7.39H14V7Zm-4.5 6h5v-1.5h-5V13Z"
  })
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (link);


/***/ }),

/***/ "./node_modules/@wordpress/icons/build-module/library/plus.js":
/*!********************************************************************!*\
  !*** ./node_modules/@wordpress/icons/build-module/library/plus.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/primitives */ "@wordpress/primitives");
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);
/**
 * WordPress dependencies
 */


const plus = /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.SVG, {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.Path, {
    d: "M11 12.5V17.5H12.5V12.5H17.5V11H12.5V6H11V11H6V12.5H11Z"
  })
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (plus);


/***/ }),

/***/ "./node_modules/clsx/dist/clsx.mjs":
/*!*****************************************!*\
  !*** ./node_modules/clsx/dist/clsx.mjs ***!
  \*****************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   clsx: () => (/* binding */ clsx),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function r(e){var t,f,n="";if("string"==typeof e||"number"==typeof e)n+=e;else if("object"==typeof e)if(Array.isArray(e)){var o=e.length;for(t=0;t<o;t++)e[t]&&(f=r(e[t]))&&(n&&(n+=" "),n+=f)}else for(f in e)e[f]&&(n&&(n+=" "),n+=f);return n}function clsx(){for(var e,t,f=0,n="",o=arguments.length;f<o;f++)(e=arguments[f])&&(t=r(e))&&(n&&(n+=" "),n+=t);return n}/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (clsx);

/***/ }),

/***/ "@wordpress/block-editor":
/*!*************************************!*\
  !*** external ["wp","blockEditor"] ***!
  \*************************************/
/***/ ((module) => {

module.exports = window["wp"]["blockEditor"];

/***/ }),

/***/ "@wordpress/blocks":
/*!********************************!*\
  !*** external ["wp","blocks"] ***!
  \********************************/
/***/ ((module) => {

module.exports = window["wp"]["blocks"];

/***/ }),

/***/ "@wordpress/components":
/*!************************************!*\
  !*** external ["wp","components"] ***!
  \************************************/
/***/ ((module) => {

module.exports = window["wp"]["components"];

/***/ }),

/***/ "@wordpress/compose":
/*!*********************************!*\
  !*** external ["wp","compose"] ***!
  \*********************************/
/***/ ((module) => {

module.exports = window["wp"]["compose"];

/***/ }),

/***/ "@wordpress/data":
/*!******************************!*\
  !*** external ["wp","data"] ***!
  \******************************/
/***/ ((module) => {

module.exports = window["wp"]["data"];

/***/ }),

/***/ "@wordpress/element":
/*!*********************************!*\
  !*** external ["wp","element"] ***!
  \*********************************/
/***/ ((module) => {

module.exports = window["wp"]["element"];

/***/ }),

/***/ "@wordpress/i18n":
/*!******************************!*\
  !*** external ["wp","i18n"] ***!
  \******************************/
/***/ ((module) => {

module.exports = window["wp"]["i18n"];

/***/ }),

/***/ "@wordpress/keycodes":
/*!**********************************!*\
  !*** external ["wp","keycodes"] ***!
  \**********************************/
/***/ ((module) => {

module.exports = window["wp"]["keycodes"];

/***/ }),

/***/ "@wordpress/primitives":
/*!************************************!*\
  !*** external ["wp","primitives"] ***!
  \************************************/
/***/ ((module) => {

module.exports = window["wp"]["primitives"];

/***/ }),

/***/ "react/jsx-runtime":
/*!**********************************!*\
  !*** external "ReactJSXRuntime" ***!
  \**********************************/
/***/ ((module) => {

module.exports = window["ReactJSXRuntime"];

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!***************************************!*\
  !*** ./blocks/image-button/index.tsx ***!
  \***************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   metadata: () => (/* reexport default export from named module */ _block_json__WEBPACK_IMPORTED_MODULE_5__),
/* harmony export */   name: () => (/* binding */ name),
/* harmony export */   settings: () => (/* binding */ settings)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/button.js");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _deprecated__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./deprecated */ "./blocks/image-button/deprecated.tsx");
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./edit */ "./blocks/image-button/edit.tsx");
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./block.json */ "./blocks/image-button/block.json");
/* harmony import */ var _save__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./save */ "./blocks/image-button/save.tsx");
/**
 * WordPress dependencies
 */



/**
 * Internal dependencies
 */




const { name } = _block_json__WEBPACK_IMPORTED_MODULE_5__;

const settings = {
    icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_1__["default"],
    example: {
        attributes: {
            className: 'is-style-fill',
            text: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Call to action')
        }
    },
    edit: _edit__WEBPACK_IMPORTED_MODULE_4__["default"],
    save: _save__WEBPACK_IMPORTED_MODULE_6__["default"],
    deprecated: _deprecated__WEBPACK_IMPORTED_MODULE_3__["default"],
    merge: (a, { text = '' }) => ({
        ...a,
        text: (a.text || '') + text
    })
};
// Register the block
(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_2__.registerBlockType)(name, settings);

})();

/******/ })()
;
//# sourceMappingURL=index.js.map