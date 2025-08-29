/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./blocks/tabs/block.json":
/*!********************************!*\
  !*** ./blocks/tabs/block.json ***!
  \********************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"apiVersion":2,"name":"jankx/tabs","version":"0.1.0","title":"Tabs Block","category":"jankx-blocks","description":"Display content in tabs style","supports":{"html":false,"anchor":true,"customClassName":true,"align":["wide","full"],"spacing":{"margin":true,"padding":true},"typography":{"fontSize":true,"lineHeight":true},"color":{"background":true,"text":true,"gradients":true}},"attributes":{"uniqueId":{"type":"string"},"tabLabelsArray":{"type":"array","default":[]},"updateChild":{"type":"boolean","default":false},"tabLayout":{"type":"string","default":"horizontal"},"containerBorderStyle":{"type":"string","default":"solid"},"containerTopBorderWidth":{"type":"string","default":"1"},"containerRightBorderWidth":{"type":"string","default":"1"},"containerBottomBorderWidth":{"type":"string","default":"1"},"containerLeftBorderWidth":{"type":"string","default":"1"},"enableContainerLinkedBorder":{"type":"boolean","default":true},"containerLinkedBorderWidth":{"type":"string","default":"1"},"containerTopBorderRadius":{"type":"string","default":"1"},"containerRightBorderRadius":{"type":"string","default":"1"},"containerBottomBorderRadius":{"type":"string","default":"1"},"containerLeftBorderRadius":{"type":"string","default":"1"},"enableContainerLinkedBorderRadius":{"type":"boolean","default":true},"containerLinkedBorderRadius":{"type":"string","default":"1"},"containerDeskTopMargin":{"type":"string"},"containerDeskBottomMargin":{"type":"string"},"containerTabTopMargin":{"type":"string"},"containerTabBottomMargin":{"type":"string"},"containerMobTopMargin":{"type":"string"},"containerMobBottomMargin":{"type":"string"},"enableContainerBoxShadow":{"type":"boolean","default":false},"containerBorderColor":{"type":"string","default":"#E1E1E1"},"showSeparator":{"type":"boolean","default":true},"separatorStyle":{"type":"string","default":"solid"},"separatorHeight":{"type":"number","default":1},"separatorColor":{"type":"string","default":"#E1E1E1"},"labelsPosition":{"type":"string","default":"left"},"labelsDeskPaddingTop":{"type":"string","default":"10"},"labelsDeskPaddingBottom":{"type":"string","default":"10"},"labelsDeskPaddingLeft":{"type":"string","default":"10"},"labelsDeskPaddingRight":{"type":"string","default":"10"},"enableLinkedDeskPadding":{"type":"boolean","default":true},"labelsLinkedDeskPadding":{"type":"string","default":"10"},"labelsTabPaddingTop":{"type":"string","default":"10"},"labelsTabPaddingBottom":{"type":"string","default":"10"},"labelsTabPaddingLeft":{"type":"string","default":"10"},"labelsTabPaddingRight":{"type":"string","default":"10"},"enableLinkedTabPadding":{"type":"boolean","default":true},"labelsLinkedTabPadding":{"type":"string","default":"10"},"labelsMobPaddingTop":{"type":"string","default":"10"},"labelsMobPaddingBottom":{"type":"string","default":"10"},"labelsMobPaddingLeft":{"type":"string","default":"10"},"labelsMobPaddingRight":{"type":"string","default":"10"},"enableLinkedMobPadding":{"type":"boolean","default":true},"labelsLinkedMobPadding":{"type":"string","default":"10"},"labelsColor":{"type":"string"},"labelsBg":{"type":"string"},"addLabelsSeparator":{"type":"boolean","default":true},"labelsSeparatorStyle":{"type":"string","default":"solid"},"labelsSeparatorWidth":{"type":"number","default":1},"labelsSeparatorColor":{"type":"string","default":"#E1E1E1"},"tabsContentDeskPaddingTop":{"type":"string","default":"10"},"tabsContentDeskPaddingBottom":{"type":"string","default":"10"},"tabsContentDeskPaddingLeft":{"type":"string","default":"10"},"tabsContentDeskPaddingRight":{"type":"string","default":"10"},"enableLinkedContentDeskPadding":{"type":"boolean","default":true},"tabsContentLinkedDeskPadding":{"type":"string","default":"10"},"tabsContentTabPaddingTop":{"type":"string","default":"10"},"tabsContentTabPaddingBottom":{"type":"string","default":"10"},"tabsContentTabPaddingLeft":{"type":"string","default":"10"},"tabsContentTabPaddingRight":{"type":"string","default":"10"},"enableLinkedContentTabPadding":{"type":"boolean","default":true},"tabsContentLinkedTabPadding":{"type":"string","default":"10"},"tabsContentMobPaddingTop":{"type":"string","default":"10"},"tabsContentMobPaddingBottom":{"type":"string","default":"10"},"tabsContentMobPaddingLeft":{"type":"string","default":"10"},"tabsContentMobPaddingRight":{"type":"string","default":"10"},"enableLinkedContentMobPadding":{"type":"boolean","default":true},"tabsContentLinkedMobPadding":{"type":"string","default":"10"},"tabsContentColor":{"type":"string"},"tabsContentBg":{"type":"string"},"useCustomColors":{"type":"boolean","default":true},"activeTabColor":{"type":"string","default":"#44677A"},"activeTabBg":{"type":"string"},"makeActiveTabSeparateLess":{"type":"boolean","default":true},"zIndex":{"type":"number"},"anchorId":{"type":"string"},"customClass":{"type":"string"}},"textdomain":"jankx","editorScript":"file:./index.tsx","editorStyle":"file:./editor.scss","style":"file:./style.scss"}');

/***/ }),

/***/ "./blocks/tabs/edit.tsx":
/*!******************************!*\
  !*** ./blocks/tabs/edit.tsx ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Edit)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _editor_scss__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./editor.scss */ "./blocks/tabs/editor.scss");
/* harmony import */ var _tab__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./tab */ "./blocks/tabs/tab.tsx");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__);






// Import tab block


const ALLOWED_BLOCKS = ['jankx/tab'];
// Options
const borderStyles = [{
        label: 'None',
        value: 'none'
    }, {
        label: 'Solid',
        value: 'solid'
    }, {
        label: 'Dashed',
        value: 'dashed'
    }, {
        label: 'Dotted',
        value: 'dotted'
    }, {
        label: 'Double',
        value: 'double'
    }, {
        label: 'Groove',
        value: 'groove'
    }, {
        label: 'Ridge',
        value: 'ridge'
    }, {
        label: 'Inset',
        value: 'inset'
    }, {
        label: 'Outset',
        value: 'outset'
    }];
const separatorStyles = [{
        label: 'Solid',
        value: 'solid'
    }, {
        label: 'Dashed',
        value: 'dashed'
    }, {
        label: 'Dotted',
        value: 'dotted'
    }, {
        label: 'Double',
        value: 'double'
    }];
const layoutOptions = [{
        label: 'Horizontal',
        value: 'horizontal'
    }, {
        label: 'Vertical',
        value: 'vertical'
    }];
const positionOptions = [{
        label: 'Top',
        value: 'top'
    }, {
        label: 'Bottom',
        value: 'bottom'
    }, {
        label: 'Left',
        value: 'left'
    }, {
        label: 'Right',
        value: 'right'
    }];
function Edit({ attributes, setAttributes, clientId }) {
    const { tabLabelsArray, updateChild, tabLayout, activeTabColor, activeTabBg, containerBorderStyle, containerTopBorderWidth, containerRightBorderWidth, containerBottomBorderWidth, containerLeftBorderWidth, enableContainerLinkedBorder, containerLinkedBorderWidth, containerTopBorderRadius, containerRightBorderRadius, containerBottomBorderRadius, containerLeftBorderRadius, enableContainerLinkedBorderRadius, containerLinkedBorderRadius, containerDeskTopMargin, containerDeskBottomMargin, containerTabTopMargin, containerTabBottomMargin, containerMobTopMargin, containerMobBottomMargin, enableContainerBoxShadow, containerBorderColor, showSeparator, separatorStyle, separatorColor, separatorHeight, labelsPosition, labelsDeskPaddingTop, labelsDeskPaddingRight, labelsDeskPaddingBottom, labelsDeskPaddingLeft, enableLinkedDeskPadding, labelsLinkedDeskPadding, labelsTabPaddingTop, labelsTabPaddingRight, labelsTabPaddingBottom, labelsTabPaddingLeft, enableLinkedTabPadding, labelsLinkedTabPadding, labelsMobPaddingTop, labelsMobPaddingRight, labelsMobPaddingBottom, labelsMobPaddingLeft, enableLinkedMobPadding, labelsLinkedMobPadding, labelsColor, labelsBg, addLabelsSeparator, labelsSeparatorStyle, labelsSeparatorColor, labelsSeparatorWidth, tabsContentDeskPaddingTop, tabsContentDeskPaddingRight, tabsContentDeskPaddingBottom, tabsContentDeskPaddingLeft, enableLinkedContentDeskPadding, tabsContentLinkedDeskPadding, tabsContentTabPaddingTop, tabsContentTabPaddingRight, tabsContentTabPaddingBottom, tabsContentTabPaddingLeft, enableLinkedContentTabPadding, tabsContentLinkedTabPadding, tabsContentMobPaddingTop, tabsContentMobPaddingRight, tabsContentMobPaddingBottom, tabsContentMobPaddingLeft, enableLinkedContentMobPadding, tabsContentLinkedMobPadding, tabsContentColor, tabsContentBg, useCustomColors, makeActiveTabSeparateLess, zIndex, anchorId, customClass } = attributes;
    const { updateBlockAttributes } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_4__.useDispatch)('core/block-editor');
    const [activeTab, setActiveTab] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useState)(0);
    // Get child blocks
    const childBlocks = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_4__.useSelect)(select => {
        return select('core/block-editor').getBlocks(clientId);
    }, [clientId]);
    // Update tab labels when child blocks change
    (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useEffect)(() => {
        if (updateChild) {
            const newTabLabels = childBlocks.map(block => {
                return block.attributes.tabLabel || `Tab ${block.attributes.blockIndex + 1}`;
            });
            setAttributes({
                tabLabelsArray: newTabLabels,
                updateChild: false
            });
        }
    }, [updateChild, childBlocks, setAttributes]);
    // Generate unique ID if not exists
    (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useEffect)(() => {
        if (!attributes.uniqueId) {
            setAttributes({
                uniqueId: `tabs-${Date.now()}`
            });
        }
    }, [attributes.uniqueId, setAttributes]);
    const blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps)({
        className: `jankx-tabs-block ${customClass || ''}`,
        id: anchorId || attributes.uniqueId
    });
    // Build inline styles
    const containerStyles = {
        borderStyle: containerBorderStyle,
        borderTopWidth: containerTopBorderWidth ? `${containerTopBorderWidth}px` : undefined,
        borderRightWidth: containerRightBorderWidth ? `${containerRightBorderWidth}px` : undefined,
        borderBottomWidth: containerBottomBorderWidth ? `${containerBottomBorderWidth}px` : undefined,
        borderLeftWidth: containerLeftBorderWidth ? `${containerLeftBorderWidth}px` : undefined,
        borderColor: containerBorderColor,
        borderRadius: enableContainerLinkedBorderRadius && containerLinkedBorderRadius ? `${containerLinkedBorderRadius}px` : `${containerTopBorderRadius || 0}px ${containerRightBorderRadius || 0}px ${containerBottomBorderRadius || 0}px ${containerLeftBorderRadius || 0}px`,
        marginTop: containerDeskTopMargin,
        marginBottom: containerDeskBottomMargin,
        zIndex: zIndex
    };
    const labelsStyles = {
        backgroundColor: labelsBg,
        color: labelsColor,
        paddingTop: enableLinkedDeskPadding && labelsLinkedDeskPadding ? `${labelsLinkedDeskPadding}px` : labelsDeskPaddingTop ? `${labelsDeskPaddingTop}px` : undefined,
        paddingRight: enableLinkedDeskPadding && labelsLinkedDeskPadding ? `${labelsLinkedDeskPadding}px` : labelsDeskPaddingRight ? `${labelsDeskPaddingRight}px` : undefined,
        paddingBottom: enableLinkedDeskPadding && labelsLinkedDeskPadding ? `${labelsLinkedDeskPadding}px` : labelsDeskPaddingBottom ? `${labelsDeskPaddingBottom}px` : undefined,
        paddingLeft: enableLinkedDeskPadding && labelsLinkedDeskPadding ? `${labelsLinkedDeskPadding}px` : labelsDeskPaddingLeft ? `${labelsDeskPaddingLeft}px` : undefined
    };
    const contentStyles = {
        backgroundColor: tabsContentBg,
        color: tabsContentColor,
        paddingTop: enableLinkedContentDeskPadding && tabsContentLinkedDeskPadding ? `${tabsContentLinkedDeskPadding}px` : tabsContentDeskPaddingTop ? `${tabsContentDeskPaddingTop}px` : undefined,
        paddingRight: enableLinkedContentDeskPadding && tabsContentLinkedDeskPadding ? `${tabsContentLinkedDeskPadding}px` : tabsContentDeskPaddingRight ? `${tabsContentDeskPaddingRight}px` : undefined,
        paddingBottom: enableLinkedContentDeskPadding && tabsContentLinkedDeskPadding ? `${tabsContentLinkedDeskPadding}px` : tabsContentDeskPaddingBottom ? `${tabsContentDeskPaddingBottom}px` : undefined,
        paddingLeft: enableLinkedContentDeskPadding && tabsContentLinkedDeskPadding ? `${tabsContentLinkedDeskPadding}px` : tabsContentDeskPaddingLeft ? `${tabsContentDeskPaddingLeft}px` : undefined
    };
    const handleTabClick = index => {
        setActiveTab(index);
    };
    const addNewTab = () => {
        const newTabBlock = wp.blocks.createBlock('jankx/tab', {
            tabLabel: `Tab ${childBlocks.length + 1}`,
            blockIndex: childBlocks.length
        });
        const newBlocks = [...childBlocks, newTabBlock];
        updateBlockAttributes(clientId, {
            innerContent: newBlocks,
            updateChild: true
        });
    };
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.Fragment, {
        children: [/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InspectorControls, {
                children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TabPanel, {
                    className: "jankx-tabs-inspector",
                    activeClass: "active-tab",
                    tabs: [{
                            name: 'general',
                            title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('General', 'jankx'),
                            className: 'general-tab'
                        }, {
                            name: 'style',
                            title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Style', 'jankx'),
                            className: 'style-tab'
                        }, {
                            name: 'advanced',
                            title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Advanced', 'jankx'),
                            className: 'advanced-tab'
                        }],
                    children: tab => /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
                        children: [tab.name === 'general' && /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.Fragment, {
                                children: [/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
                                        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('General Settings', 'jankx'),
                                        initialOpen: true,
                                        children: [/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
                                                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Tab Layout', 'jankx'),
                                                value: tabLayout,
                                                options: layoutOptions,
                                                onChange: value => setAttributes({
                                                    tabLayout: value
                                                })
                                            }), /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
                                                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Labels Position', 'jankx'),
                                                value: labelsPosition,
                                                options: positionOptions,
                                                onChange: value => setAttributes({
                                                    labelsPosition: value
                                                })
                                            }), /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
                                                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Show Separator', 'jankx'),
                                                checked: showSeparator,
                                                onChange: value => setAttributes({
                                                    showSeparator: value
                                                })
                                            }), showSeparator && /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.Fragment, {
                                                children: [/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
                                                        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Separator Style', 'jankx'),
                                                        value: separatorStyle,
                                                        options: separatorStyles,
                                                        onChange: value => setAttributes({
                                                            separatorStyle: value
                                                        })
                                                    }), /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
                                                        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Separator Height', 'jankx'),
                                                        value: separatorHeight,
                                                        onChange: value => setAttributes({
                                                            separatorHeight: value
                                                        }),
                                                        min: 1,
                                                        max: 10
                                                    }), /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
                                                        className: "components-base-control",
                                                        children: [/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("label", {
                                                                className: "components-base-control__label",
                                                                children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Separator Color', 'jankx')
                                                            }), /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ColorPicker, {
                                                                color: separatorColor,
                                                                onChangeComplete: color => setAttributes({
                                                                    separatorColor: color.hex
                                                                })
                                                            })]
                                                    })]
                                            }), /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
                                                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Add Labels Separator', 'jankx'),
                                                checked: addLabelsSeparator,
                                                onChange: value => setAttributes({
                                                    addLabelsSeparator: value
                                                })
                                            }), addLabelsSeparator && /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.Fragment, {
                                                children: [/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
                                                        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Labels Separator Style', 'jankx'),
                                                        value: labelsSeparatorStyle,
                                                        options: separatorStyles,
                                                        onChange: value => setAttributes({
                                                            labelsSeparatorStyle: value
                                                        })
                                                    }), /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
                                                        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Labels Separator Width', 'jankx'),
                                                        value: labelsSeparatorWidth,
                                                        onChange: value => setAttributes({
                                                            labelsSeparatorWidth: value
                                                        }),
                                                        min: 1,
                                                        max: 10
                                                    }), /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
                                                        className: "components-base-control",
                                                        children: [/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("label", {
                                                                className: "components-base-control__label",
                                                                children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Labels Separator Color', 'jankx')
                                                            }), /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ColorPicker, {
                                                                color: labelsSeparatorColor,
                                                                onChangeComplete: color => setAttributes({
                                                                    labelsSeparatorColor: color.hex
                                                                })
                                                            })]
                                                    })]
                                            })]
                                    }), /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
                                        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Colors', 'jankx'),
                                        initialOpen: false,
                                        children: [/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
                                                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Use Custom Colors', 'jankx'),
                                                checked: useCustomColors,
                                                onChange: value => setAttributes({
                                                    useCustomColors: value
                                                })
                                            }), useCustomColors && /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.Fragment, {
                                                children: [/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
                                                        className: "components-base-control",
                                                        children: [/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("label", {
                                                                className: "components-base-control__label",
                                                                children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Active Tab Color', 'jankx')
                                                            }), /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ColorPicker, {
                                                                color: activeTabColor,
                                                                onChangeComplete: color => setAttributes({
                                                                    activeTabColor: color.hex
                                                                })
                                                            })]
                                                    }), /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
                                                        className: "components-base-control",
                                                        children: [/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("label", {
                                                                className: "components-base-control__label",
                                                                children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Active Tab Background', 'jankx')
                                                            }), /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ColorPicker, {
                                                                color: activeTabBg,
                                                                onChangeComplete: color => setAttributes({
                                                                    activeTabBg: color.hex
                                                                })
                                                            })]
                                                    }), /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
                                                        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Make Active Tab Separate Less', 'jankx'),
                                                        checked: makeActiveTabSeparateLess,
                                                        onChange: value => setAttributes({
                                                            makeActiveTabSeparateLess: value
                                                        })
                                                    })]
                                            })]
                                    })]
                            }), tab.name === 'style' && /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.Fragment, {
                                children: [/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
                                        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Container Style', 'jankx'),
                                        initialOpen: true,
                                        children: [/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
                                                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Border Style', 'jankx'),
                                                value: containerBorderStyle,
                                                options: borderStyles,
                                                onChange: value => setAttributes({
                                                    containerBorderStyle: value
                                                })
                                            }), containerBorderStyle !== 'none' && /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.Fragment, {
                                                children: [/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
                                                        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Linked Border Width', 'jankx'),
                                                        checked: enableContainerLinkedBorder,
                                                        onChange: value => setAttributes({
                                                            enableContainerLinkedBorder: value
                                                        })
                                                    }), enableContainerLinkedBorder ? /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
                                                        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Border Width', 'jankx'),
                                                        value: parseInt(containerLinkedBorderWidth),
                                                        onChange: value => setAttributes({
                                                            containerLinkedBorderWidth: value.toString()
                                                        }),
                                                        min: 0,
                                                        max: 20
                                                    }) : /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.Fragment, {
                                                        children: [/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
                                                                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Top Border Width', 'jankx'),
                                                                value: parseInt(containerTopBorderWidth),
                                                                onChange: value => setAttributes({
                                                                    containerTopBorderWidth: value.toString()
                                                                }),
                                                                min: 0,
                                                                max: 20
                                                            }), /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
                                                                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Right Border Width', 'jankx'),
                                                                value: parseInt(containerRightBorderWidth),
                                                                onChange: value => setAttributes({
                                                                    containerRightBorderWidth: value.toString()
                                                                }),
                                                                min: 0,
                                                                max: 20
                                                            }), /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
                                                                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Bottom Border Width', 'jankx'),
                                                                value: parseInt(containerBottomBorderWidth),
                                                                onChange: value => setAttributes({
                                                                    containerBottomBorderWidth: value.toString()
                                                                }),
                                                                min: 0,
                                                                max: 20
                                                            }), /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
                                                                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Left Border Width', 'jankx'),
                                                                value: parseInt(containerLeftBorderWidth),
                                                                onChange: value => setAttributes({
                                                                    containerLeftBorderWidth: value.toString()
                                                                }),
                                                                min: 0,
                                                                max: 20
                                                            })]
                                                    }), /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
                                                        className: "components-base-control",
                                                        children: [/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("label", {
                                                                className: "components-base-control__label",
                                                                children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Border Color', 'jankx')
                                                            }), /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ColorPicker, {
                                                                color: containerBorderColor,
                                                                onChangeComplete: color => setAttributes({
                                                                    containerBorderColor: color.hex
                                                                })
                                                            })]
                                                    })]
                                            }), /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
                                                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Linked Border Radius', 'jankx'),
                                                checked: enableContainerLinkedBorderRadius,
                                                onChange: value => setAttributes({
                                                    enableContainerLinkedBorderRadius: value
                                                })
                                            }), enableContainerLinkedBorderRadius ? /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
                                                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Border Radius', 'jankx'),
                                                value: parseInt(containerLinkedBorderRadius),
                                                onChange: value => setAttributes({
                                                    containerLinkedBorderRadius: value.toString()
                                                }),
                                                min: 0,
                                                max: 50
                                            }) : /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.Fragment, {
                                                children: [/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
                                                        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Top Left Radius', 'jankx'),
                                                        value: parseInt(containerTopBorderRadius),
                                                        onChange: value => setAttributes({
                                                            containerTopBorderRadius: value.toString()
                                                        }),
                                                        min: 0,
                                                        max: 50
                                                    }), /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
                                                        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Top Right Radius', 'jankx'),
                                                        value: parseInt(containerRightBorderRadius),
                                                        onChange: value => setAttributes({
                                                            containerRightBorderRadius: value.toString()
                                                        }),
                                                        min: 0,
                                                        max: 50
                                                    }), /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
                                                        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Bottom Right Radius', 'jankx'),
                                                        value: parseInt(containerBottomBorderRadius),
                                                        onChange: value => setAttributes({
                                                            containerBottomBorderRadius: value.toString()
                                                        }),
                                                        min: 0,
                                                        max: 50
                                                    }), /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
                                                        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Bottom Left Radius', 'jankx'),
                                                        value: parseInt(containerLeftBorderRadius),
                                                        onChange: value => setAttributes({
                                                            containerLeftBorderRadius: value.toString()
                                                        }),
                                                        min: 0,
                                                        max: 50
                                                    })]
                                            }), /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
                                                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Enable Box Shadow', 'jankx'),
                                                checked: enableContainerBoxShadow,
                                                onChange: value => setAttributes({
                                                    enableContainerBoxShadow: value
                                                })
                                            })]
                                    }), /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
                                        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Labels Style', 'jankx'),
                                        initialOpen: false,
                                        children: [/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
                                                className: "components-base-control",
                                                children: [/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("label", {
                                                        className: "components-base-control__label",
                                                        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Labels Background', 'jankx')
                                                    }), /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ColorPicker, {
                                                        color: labelsBg,
                                                        onChangeComplete: color => setAttributes({
                                                            labelsBg: color.hex
                                                        })
                                                    })]
                                            }), /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
                                                className: "components-base-control",
                                                children: [/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("label", {
                                                        className: "components-base-control__label",
                                                        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Labels Color', 'jankx')
                                                    }), /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ColorPicker, {
                                                        color: labelsColor,
                                                        onChangeComplete: color => setAttributes({
                                                            labelsColor: color.hex
                                                        })
                                                    })]
                                            }), /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.CardDivider, {}), /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("h4", {
                                                children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Desktop Padding', 'jankx')
                                            }), /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
                                                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Linked Padding', 'jankx'),
                                                checked: enableLinkedDeskPadding,
                                                onChange: value => setAttributes({
                                                    enableLinkedDeskPadding: value
                                                })
                                            }), enableLinkedDeskPadding ? /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
                                                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Padding', 'jankx'),
                                                value: parseInt(labelsLinkedDeskPadding),
                                                onChange: value => setAttributes({
                                                    labelsLinkedDeskPadding: value.toString()
                                                }),
                                                min: 0,
                                                max: 100
                                            }) : /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.Fragment, {
                                                children: [/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
                                                        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Top Padding', 'jankx'),
                                                        value: parseInt(labelsDeskPaddingTop),
                                                        onChange: value => setAttributes({
                                                            labelsDeskPaddingTop: value.toString()
                                                        }),
                                                        min: 0,
                                                        max: 100
                                                    }), /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
                                                        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Right Padding', 'jankx'),
                                                        value: parseInt(labelsDeskPaddingRight),
                                                        onChange: value => setAttributes({
                                                            labelsDeskPaddingRight: value.toString()
                                                        }),
                                                        min: 0,
                                                        max: 100
                                                    }), /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
                                                        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Bottom Padding', 'jankx'),
                                                        value: parseInt(labelsDeskPaddingBottom),
                                                        onChange: value => setAttributes({
                                                            labelsDeskPaddingBottom: value.toString()
                                                        }),
                                                        min: 0,
                                                        max: 100
                                                    }), /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
                                                        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Left Padding', 'jankx'),
                                                        value: parseInt(labelsDeskPaddingLeft),
                                                        onChange: value => setAttributes({
                                                            labelsDeskPaddingLeft: value.toString()
                                                        }),
                                                        min: 0,
                                                        max: 100
                                                    })]
                                            })]
                                    }), /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
                                        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Content Style', 'jankx'),
                                        initialOpen: false,
                                        children: [/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
                                                className: "components-base-control",
                                                children: [/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("label", {
                                                        className: "components-base-control__label",
                                                        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Content Background', 'jankx')
                                                    }), /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ColorPicker, {
                                                        color: tabsContentBg,
                                                        onChangeComplete: color => setAttributes({
                                                            tabsContentBg: color.hex
                                                        })
                                                    })]
                                            }), /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
                                                className: "components-base-control",
                                                children: [/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("label", {
                                                        className: "components-base-control__label",
                                                        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Content Color', 'jankx')
                                                    }), /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ColorPicker, {
                                                        color: tabsContentColor,
                                                        onChangeComplete: color => setAttributes({
                                                            tabsContentColor: color.hex
                                                        })
                                                    })]
                                            }), /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.CardDivider, {}), /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("h4", {
                                                children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Desktop Padding', 'jankx')
                                            }), /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
                                                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Linked Padding', 'jankx'),
                                                checked: enableLinkedContentDeskPadding,
                                                onChange: value => setAttributes({
                                                    enableLinkedContentDeskPadding: value
                                                })
                                            }), enableLinkedContentDeskPadding ? /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
                                                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Padding', 'jankx'),
                                                value: parseInt(tabsContentLinkedDeskPadding),
                                                onChange: value => setAttributes({
                                                    tabsContentLinkedDeskPadding: value.toString()
                                                }),
                                                min: 0,
                                                max: 100
                                            }) : /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.Fragment, {
                                                children: [/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
                                                        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Top Padding', 'jankx'),
                                                        value: parseInt(tabsContentDeskPaddingTop),
                                                        onChange: value => setAttributes({
                                                            tabsContentDeskPaddingTop: value.toString()
                                                        }),
                                                        min: 0,
                                                        max: 100
                                                    }), /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
                                                        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Right Padding', 'jankx'),
                                                        value: parseInt(tabsContentDeskPaddingRight),
                                                        onChange: value => setAttributes({
                                                            tabsContentDeskPaddingRight: value.toString()
                                                        }),
                                                        min: 0,
                                                        max: 100
                                                    }), /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
                                                        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Bottom Padding', 'jankx'),
                                                        value: parseInt(tabsContentDeskPaddingBottom),
                                                        onChange: value => setAttributes({
                                                            tabsContentDeskPaddingBottom: value.toString()
                                                        }),
                                                        min: 0,
                                                        max: 100
                                                    }), /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
                                                        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Left Padding', 'jankx'),
                                                        value: parseInt(tabsContentDeskPaddingLeft),
                                                        onChange: value => setAttributes({
                                                            tabsContentDeskPaddingLeft: value.toString()
                                                        }),
                                                        min: 0,
                                                        max: 100
                                                    })]
                                            })]
                                    })]
                            }), tab.name === 'advanced' && /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.Fragment, {
                                children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
                                    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Advanced Settings', 'jankx'),
                                    initialOpen: true,
                                    children: [/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
                                            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Anchor ID', 'jankx'),
                                            value: anchorId || '',
                                            onChange: value => setAttributes({
                                                anchorId: value
                                            }),
                                            help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Add an anchor ID for deep linking', 'jankx')
                                        }), /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
                                            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Custom CSS Class', 'jankx'),
                                            value: customClass || '',
                                            onChange: value => setAttributes({
                                                customClass: value
                                            }),
                                            help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Add custom CSS classes', 'jankx')
                                        }), /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
                                            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Z-Index', 'jankx'),
                                            value: zIndex || 1,
                                            onChange: value => setAttributes({
                                                zIndex: value
                                            }),
                                            min: 0,
                                            max: 9999,
                                            help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Control the stacking order', 'jankx')
                                        })]
                                })
                            })]
                    })
                })
            }), /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("div", {
                ...blockProps,
                style: containerStyles,
                children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
                    className: `jankx-tabs-container layout-${tabLayout} position-${labelsPosition}`,
                    children: [/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
                            className: "jankx-tabs-labels",
                            style: labelsStyles,
                            children: [tabLabelsArray.map((label, index) => /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("button", {
                                    className: `jankx-tab-label ${index === activeTab ? 'active' : ''}`,
                                    onClick: () => handleTabClick(index),
                                    style: {
                                        backgroundColor: index === activeTab && useCustomColors ? activeTabBg : undefined,
                                        color: index === activeTab && useCustomColors ? activeTabColor : undefined
                                    },
                                    children: label || `Tab ${index + 1}`
                                }, index)), /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
                                    className: "jankx-add-tab-button",
                                    onClick: addNewTab,
                                    variant: "secondary",
                                    size: "small",
                                    children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('+ Add Tab', 'jankx')
                                })]
                        }), /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("div", {
                            className: "jankx-tabs-content",
                            style: contentStyles,
                            children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InnerBlocks, {
                                allowedBlocks: ALLOWED_BLOCKS,
                                template: [['jankx/tab']],
                                templateLock: false
                            })
                        })]
                })
            })]
    });
}


/***/ }),

/***/ "./blocks/tabs/editor.scss":
/*!*********************************!*\
  !*** ./blocks/tabs/editor.scss ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./blocks/tabs/save.tsx":
/*!******************************!*\
  !*** ./blocks/tabs/save.tsx ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Save)
/* harmony export */ });
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);


function Save({ attributes }) {
    const { uniqueId, tabLayout, labelsPosition, containerBorderStyle, containerTopBorderWidth, containerRightBorderWidth, containerBottomBorderWidth, containerLeftBorderWidth, enableContainerLinkedBorder, containerLinkedBorderWidth, containerTopBorderRadius, containerRightBorderRadius, containerBottomBorderRadius, containerLeftBorderRadius, enableContainerLinkedBorderRadius, containerLinkedBorderRadius, containerDeskTopMargin, containerDeskBottomMargin, enableContainerBoxShadow, containerBorderColor, showSeparator, separatorStyle, separatorColor, separatorHeight, labelsDeskPaddingTop, labelsDeskPaddingRight, labelsDeskPaddingBottom, labelsDeskPaddingLeft, enableLinkedDeskPadding, labelsLinkedDeskPadding, labelsColor, labelsBg, addLabelsSeparator, labelsSeparatorStyle, labelsSeparatorColor, labelsSeparatorWidth, tabsContentDeskPaddingTop, tabsContentDeskPaddingRight, tabsContentDeskPaddingBottom, tabsContentDeskPaddingLeft, enableLinkedContentDeskPadding, tabsContentLinkedDeskPadding, tabsContentColor, tabsContentBg, useCustomColors, activeTabColor, activeTabBg, makeActiveTabSeparateLess, zIndex, anchorId, customClass } = attributes;
    const blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.useBlockProps.save({
        className: `jankx-tabs-block ${customClass || ''}`,
        id: anchorId || uniqueId
    });
    // Build inline styles
    const containerStyles = {
        borderStyle: containerBorderStyle,
        borderTopWidth: containerTopBorderWidth ? `${containerTopBorderWidth}px` : undefined,
        borderRightWidth: containerRightBorderWidth ? `${containerRightBorderWidth}px` : undefined,
        borderBottomWidth: containerBottomBorderWidth ? `${containerBottomBorderWidth}px` : undefined,
        borderLeftWidth: containerLeftBorderWidth ? `${containerLeftBorderWidth}px` : undefined,
        borderColor: containerBorderColor,
        borderRadius: enableContainerLinkedBorderRadius && containerLinkedBorderRadius ? `${containerLinkedBorderRadius}px` : `${containerTopBorderRadius || 0}px ${containerRightBorderRadius || 0}px ${containerBottomBorderRadius || 0}px ${containerLeftBorderRadius || 0}px`,
        marginTop: containerDeskTopMargin,
        marginBottom: containerDeskBottomMargin,
        zIndex: zIndex
    };
    const labelsStyles = {
        backgroundColor: labelsBg,
        color: labelsColor,
        paddingTop: enableLinkedDeskPadding && labelsLinkedDeskPadding ? `${labelsLinkedDeskPadding}px` : labelsDeskPaddingTop ? `${labelsDeskPaddingTop}px` : undefined,
        paddingRight: enableLinkedDeskPadding && labelsLinkedDeskPadding ? `${labelsLinkedDeskPadding}px` : labelsDeskPaddingRight ? `${labelsDeskPaddingRight}px` : undefined,
        paddingBottom: enableLinkedDeskPadding && labelsLinkedDeskPadding ? `${labelsLinkedDeskPadding}px` : labelsDeskPaddingBottom ? `${labelsDeskPaddingBottom}px` : undefined,
        paddingLeft: enableLinkedDeskPadding && labelsLinkedDeskPadding ? `${labelsLinkedDeskPadding}px` : labelsDeskPaddingLeft ? `${labelsDeskPaddingLeft}px` : undefined
    };
    const contentStyles = {
        backgroundColor: tabsContentBg,
        color: tabsContentColor,
        paddingTop: enableLinkedContentDeskPadding && tabsContentLinkedDeskPadding ? `${tabsContentLinkedDeskPadding}px` : tabsContentDeskPaddingTop ? `${tabsContentDeskPaddingTop}px` : undefined,
        paddingRight: enableLinkedContentDeskPadding && tabsContentLinkedDeskPadding ? `${tabsContentLinkedDeskPadding}px` : tabsContentDeskPaddingRight ? `${tabsContentDeskPaddingRight}px` : undefined,
        paddingBottom: enableLinkedContentDeskPadding && tabsContentLinkedDeskPadding ? `${tabsContentLinkedDeskPadding}px` : tabsContentDeskPaddingBottom ? `${tabsContentDeskPaddingBottom}px` : undefined,
        paddingLeft: enableLinkedContentDeskPadding && tabsContentLinkedDeskPadding ? `${tabsContentLinkedDeskPadding}px` : tabsContentDeskPaddingLeft ? `${tabsContentDeskPaddingLeft}px` : undefined
    };
    // Build CSS custom properties for frontend JavaScript
    const cssVars = {
        '--jankx-tabs-layout': tabLayout,
        '--jankx-tabs-labels-position': labelsPosition,
        '--jankx-tabs-separator-style': showSeparator ? separatorStyle : 'none',
        '--jankx-tabs-separator-color': separatorColor,
        '--jankx-tabs-separator-height': `${separatorHeight}px`,
        '--jankx-tabs-labels-separator-style': addLabelsSeparator ? labelsSeparatorStyle : 'none',
        '--jankx-tabs-labels-separator-color': labelsSeparatorColor,
        '--jankx-tabs-labels-separator-width': `${labelsSeparatorWidth}px`,
        '--jankx-tabs-active-color': useCustomColors ? activeTabColor : undefined,
        '--jankx-tabs-active-bg': useCustomColors ? activeTabBg : undefined,
        '--jankx-tabs-active-separate-less': makeActiveTabSeparateLess ? '1' : '0'
    };
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
        ...blockProps,
        style: {
            ...containerStyles,
            ...cssVars
        },
        children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
            className: `jankx-tabs-container layout-${tabLayout} position-${labelsPosition}`,
            children: [/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
                    className: "jankx-tabs-labels",
                    style: labelsStyles
                }), showSeparator && /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
                    className: "jankx-tabs-separator",
                    style: {
                        borderStyle: separatorStyle,
                        borderColor: separatorColor,
                        borderTopWidth: separatorHeight ? `${separatorHeight}px` : '1px'
                    }
                }), /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
                    className: "jankx-tabs-content",
                    style: contentStyles,
                    children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.InnerBlocks.Content, {})
                })]
        })
    });
}


/***/ }),

/***/ "./blocks/tabs/style.scss":
/*!********************************!*\
  !*** ./blocks/tabs/style.scss ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./blocks/tabs/tab.tsx":
/*!*****************************!*\
  !*** ./blocks/tabs/tab.tsx ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__);






// Tab Edit Component
function TabEdit({ attributes, setAttributes, clientId }) {
    const { tabLabel, blockIndex } = attributes;
    const { updateBlockAttributes } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_2__.useDispatch)('core/block-editor');
    // Get parent block ID
    const parentBlockID = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_2__.useSelect)(select => {
        return select('core/block-editor').getBlockParentsByBlockName(clientId, ['jankx/tabs'])[0];
    }, [clientId]);
    // Get current block index
    const currentBlockIndex = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_2__.useSelect)(select => {
        if (!parentBlockID)
            return 0;
        return select('core/block-editor').getBlockOrder(parentBlockID).indexOf(clientId);
    }, [parentBlockID, clientId]);
    // Update block index when it changes
    (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useEffect)(() => {
        if (currentBlockIndex !== blockIndex) {
            setAttributes({
                blockIndex: currentBlockIndex
            });
            if (parentBlockID) {
                updateBlockAttributes(parentBlockID, {
                    updateChild: true
                });
            }
        }
    }, [currentBlockIndex, blockIndex, setAttributes, parentBlockID, updateBlockAttributes]);
    const onChangeTabLabel = newTabLabel => {
        setAttributes({
            tabLabel: newTabLabel
        });
        if (parentBlockID) {
            updateBlockAttributes(parentBlockID, {
                updateChild: true
            });
        }
    };
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
        className: "jankx-tab-edit",
        children: [/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
                tagName: "p",
                className: "jankx-tab-label",
                value: tabLabel,
                onChange: onChangeTabLabel,
                placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Tab label...', 'jankx')
            }), /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
                className: "jankx-tab-content",
                children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InnerBlocks, {
                    allowedBlocks: true,
                    template: [['core/paragraph']],
                    templateLock: false
                })
            })]
    });
}
// Tab Save Component
function TabSave({ attributes }) {
    const { tabLabel } = attributes;
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
        className: "jankx-tab-panel",
        role: "tabpanel",
        tabIndex: 0,
        "aria-labelledby": tabLabel,
        "data-tab-label": tabLabel,
        children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InnerBlocks.Content, {})
    });
}
// Register Tab Block
(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_4__.registerBlockType)('jankx/tab', {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Tab', 'jankx'),
    description: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Acts as child block for Tabs', 'jankx'),
    supports: {
        html: false,
        customClassName: false,
        anchor: false
    },
    icon: {
        foreground: '#38687c',
        src: 'minus'
    },
    parent: ['jankx/tabs'],
    category: 'jankx-blocks',
    keywords: [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('tab', 'jankx'), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('tabs', 'jankx')],
    attributes: {
        tabLabel: {
            type: 'string',
            default: ''
        },
        blockIndex: {
            type: 'number',
            default: 0
        }
    },
    edit: TabEdit,
    save: TabSave
});


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
/*!*******************************!*\
  !*** ./blocks/tabs/index.tsx ***!
  \*******************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./style.scss */ "./blocks/tabs/style.scss");
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./block.json */ "./blocks/tabs/block.json");
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./edit */ "./blocks/tabs/edit.tsx");
/* harmony import */ var _save__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./save */ "./blocks/tabs/save.tsx");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__);



/**
 * Internal dependencies
 */


/**
 * Block Registration
 */

(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_2__, {
    icon: {
        src: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("svg", {
            width: "17px",
            height: "17px",
            viewBox: "0 0 17 17",
            version: "1.1",
            children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("path", {
                d: "M6 1v1h-6v4h1v4h5v6.018h11v-15.018h-11zM2 6h4v1h-4v-1zM2 9v-1h4v1h-4zM16 15.018h-9v-10.018h-6v-2h6v-1h9v13.018z",
                fill: "#38687c"
            })
        }),
        foreground: '#38687c'
    },
    edit: _edit__WEBPACK_IMPORTED_MODULE_3__["default"],
    save: _save__WEBPACK_IMPORTED_MODULE_4__["default"]
});

})();

/******/ })()
;
//# sourceMappingURL=index.js.map