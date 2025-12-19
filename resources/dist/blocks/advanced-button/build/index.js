"use strict";
/******/ (() => {
    /******/ var __webpack_modules__ = ({
        /***/ "./blocks/advanced-button/block.json": 
        /*!*******************************************!*\
          !*** ./blocks/advanced-button/block.json ***!
          \*******************************************/
        /***/ ((module) => {
            "use strict";
            module.exports = /*#__PURE__*/ JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"jankx/advanced-button","title":"Advanced Button","category":"jankx","description":"Advanced button block with enhanced features and styling options.","keywords":["button","link","advanced","cta","action"],"textdomain":"jankx","allowedBlocks":["jankx/icon-picker","jankx/svg-icon","core/image","core/html"],"attributes":{"conditionType":{"type":"string","enum":["always","post-type"],"default":"always"},"showForPostType":{"type":"string","default":""},"triggerType":{"type":"string","enum":["link","button","detail-link","modal"],"default":"link","source":"attribute","selector":".jankx-advanced-button__link","attribute":"data-trigger-type"},"buttonType":{"type":"string","enum":["button","submit","reset"],"default":"button","source":"attribute","selector":"button","attribute":"type"},"modalId":{"type":"string","default":""},"modalShareObjectId":{"type":"boolean","default":false},"modalSharePostTitle":{"type":"boolean","default":false},"modalShareCurrentUrl":{"type":"boolean","default":false},"modalShareFeaturedImageId":{"type":"boolean","default":false},"modalShareFeaturedImageUrl":{"type":"boolean","default":false},"formMappings":{"type":"array","default":[]},"text":{"type":"string","source":"html","selector":".button-text","default":"Button"},"url":{"type":"string","source":"attribute","selector":"a","attribute":"href","role":"content","default":""},"title":{"type":"string","source":"attribute","selector":"a,button","attribute":"title","role":"content"},"linkTarget":{"type":"string","source":"attribute","selector":"a","attribute":"target","role":"content"},"rel":{"type":"string","source":"attribute","selector":"a","attribute":"rel","role":"content"},"placeholder":{"type":"string","default":""},"backgroundColor":{"type":"string"},"textColor":{"type":"string"},"gradient":{"type":"string"},"width":{"type":"number"},"style":{"type":"object","default":{"spacing":{"padding":{"top":"0.5rem","right":"1rem","bottom":"0.5rem","left":"1rem"}}}},"useIconBlocks":{"type":"boolean","default":false},"iconPosition":{"type":"string","enum":["left","right","top","bottom"],"default":"left"},"showLabel":{"type":"boolean","default":true}},"supports":{"anchor":true,"align":false,"alignWide":false,"color":{"__experimentalSkipSerialization":true,"gradients":true,"__experimentalDefaultControls":{"background":true,"text":true}},"typography":{"fontSize":true,"lineHeight":true,"textAlign":true,"__experimentalFontFamily":true,"__experimentalFontWeight":true,"__experimentalFontStyle":true,"__experimentalTextTransform":true,"__experimentalTextDecoration":true,"__experimentalLetterSpacing":true,"__experimentalDefaultControls":{"fontSize":true}},"reusable":false,"shadow":true,"spacing":{"padding":["horizontal","vertical"],"margin":true,"__experimentalDefaultControls":{"padding":true,"margin":false}},"layout":{"default":{"type":"flex","justifyContent":"center"},"allowSwitching":false,"allowInheriting":false,"allowEditing":false},"dimensions":{"minHeight":true},"__experimentalBorder":{"color":true,"radius":true,"style":true,"width":true,"__experimentalDefaultControls":{"color":true,"radius":true,"style":true,"width":true}}},"styles":[{"name":"fill","label":"Fill","isDefault":true},{"name":"outline","label":"Outline"}],"editorScript":"file:./build/index.js","editorStyle":"file:./build/editor.css","style":"file:./build/style.css","viewScript":"file:./build/frontend.js"}');
            /***/ 
        }),
        /***/ "./blocks/advanced-button/edit.tsx": 
        /*!*****************************************!*\
          !*** ./blocks/advanced-button/edit.tsx ***!
          \*****************************************/
        /***/ (() => {
            throw new Error("Module build failed (from ./node_modules/babel-loader/lib/index.js):\nSyntaxError: c:\\Users\\puleeno\\Projects\\raglai-culture\\wp-content\\themes\\jankx\\resources\\blocks\\advanced-button\\edit.tsx: Adjacent JSX elements must be wrapped in an enclosing tag. Did you want a JSX fragment <>...</>? (701:9)\n\n\u001b[0m \u001b[90m 699 |\u001b[39m \t\t\t\t\t\t\t\t\t\u001b[33m<\u001b[39m\u001b[33m/\u001b[39m\u001b[33mdiv\u001b[39m\u001b[33m>\u001b[39m\n \u001b[90m 700 |\u001b[39m \t\t\t\t\t\t\t\t\t\n\u001b[31m\u001b[1m>\u001b[22m\u001b[39m\u001b[90m 701 |\u001b[39m \t\t\t\t\t\t\t\t\t\u001b[33m<\u001b[39m\u001b[33mdiv\u001b[39m style\u001b[33m=\u001b[39m{{ marginTop\u001b[33m:\u001b[39m \u001b[32m'16px'\u001b[39m\u001b[33m,\u001b[39m borderTop\u001b[33m:\u001b[39m \u001b[32m'1px solid #ddd'\u001b[39m\u001b[33m,\u001b[39m paddingTop\u001b[33m:\u001b[39m \u001b[32m'16px'\u001b[39m }}\u001b[33m>\u001b[39m\n \u001b[90m     |\u001b[39m \t\t\t\t\t\t\t\t\t\u001b[31m\u001b[1m^\u001b[22m\u001b[39m\n \u001b[90m 702 |\u001b[39m \t\t\t\t\t\t\t\t\t\t\u001b[33m<\u001b[39m\u001b[33mp\u001b[39m style\u001b[33m=\u001b[39m{{ fontSize\u001b[33m:\u001b[39m \u001b[32m'13px'\u001b[39m\u001b[33m,\u001b[39m fontWeight\u001b[33m:\u001b[39m \u001b[35m600\u001b[39m\u001b[33m,\u001b[39m marginBottom\u001b[33m:\u001b[39m \u001b[32m'8px'\u001b[39m }}\u001b[33m>\u001b[39m\n \u001b[90m 703 |\u001b[39m \t\t\t\t\t\t\t\t\t\t\t{__(\u001b[32m'Form Data Mapping'\u001b[39m\u001b[33m,\u001b[39m \u001b[32m'jankx'\u001b[39m)}\n \u001b[90m 704 |\u001b[39m \t\t\t\t\t\t\t\t\t\t\u001b[33m<\u001b[39m\u001b[33m/\u001b[39m\u001b[33mp\u001b[39m\u001b[33m>\u001b[39m\u001b[0m\n    at constructor (c:\\Users\\puleeno\\Projects\\raglai-culture\\wp-content\\themes\\jankx\\resources\\node_modules\\@babel\\parser\\lib\\index.js:367:19)\n    at TypeScriptParserMixin.raise (c:\\Users\\puleeno\\Projects\\raglai-culture\\wp-content\\themes\\jankx\\resources\\node_modules\\@babel\\parser\\lib\\index.js:6630:19)\n    at TypeScriptParserMixin.jsxParseElementAt (c:\\Users\\puleeno\\Projects\\raglai-culture\\wp-content\\themes\\jankx\\resources\\node_modules\\@babel\\parser\\lib\\index.js:4775:18)\n    at TypeScriptParserMixin.jsxParseElement (c:\\Users\\puleeno\\Projects\\raglai-culture\\wp-content\\themes\\jankx\\resources\\node_modules\\@babel\\parser\\lib\\index.js:4782:17)\n    at TypeScriptParserMixin.parseExprAtom (c:\\Users\\puleeno\\Projects\\raglai-culture\\wp-content\\themes\\jankx\\resources\\node_modules\\@babel\\parser\\lib\\index.js:4792:19)\n    at TypeScriptParserMixin.parseExprSubscripts (c:\\Users\\puleeno\\Projects\\raglai-culture\\wp-content\\themes\\jankx\\resources\\node_modules\\@babel\\parser\\lib\\index.js:11081:23)\n    at TypeScriptParserMixin.parseUpdate (c:\\Users\\puleeno\\Projects\\raglai-culture\\wp-content\\themes\\jankx\\resources\\node_modules\\@babel\\parser\\lib\\index.js:11066:21)\n    at TypeScriptParserMixin.parseMaybeUnary (c:\\Users\\puleeno\\Projects\\raglai-culture\\wp-content\\themes\\jankx\\resources\\node_modules\\@babel\\parser\\lib\\index.js:11046:23)\n    at TypeScriptParserMixin.parseMaybeUnary (c:\\Users\\puleeno\\Projects\\raglai-culture\\wp-content\\themes\\jankx\\resources\\node_modules\\@babel\\parser\\lib\\index.js:9857:18)\n    at TypeScriptParserMixin.parseMaybeUnaryOrPrivate (c:\\Users\\puleeno\\Projects\\raglai-culture\\wp-content\\themes\\jankx\\resources\\node_modules\\@babel\\parser\\lib\\index.js:10899:61)\n    at TypeScriptParserMixin.parseExprOps (c:\\Users\\puleeno\\Projects\\raglai-culture\\wp-content\\themes\\jankx\\resources\\node_modules\\@babel\\parser\\lib\\index.js:10904:23)\n    at TypeScriptParserMixin.parseMaybeConditional (c:\\Users\\puleeno\\Projects\\raglai-culture\\wp-content\\themes\\jankx\\resources\\node_modules\\@babel\\parser\\lib\\index.js:10881:23)\n    at TypeScriptParserMixin.parseMaybeAssign (c:\\Users\\puleeno\\Projects\\raglai-culture\\wp-content\\themes\\jankx\\resources\\node_modules\\@babel\\parser\\lib\\index.js:10831:21)\n    at c:\\Users\\puleeno\\Projects\\raglai-culture\\wp-content\\themes\\jankx\\resources\\node_modules\\@babel\\parser\\lib\\index.js:9795:39\n    at TypeScriptParserMixin.tryParse (c:\\Users\\puleeno\\Projects\\raglai-culture\\wp-content\\themes\\jankx\\resources\\node_modules\\@babel\\parser\\lib\\index.js:6938:20)\n    at TypeScriptParserMixin.parseMaybeAssign (c:\\Users\\puleeno\\Projects\\raglai-culture\\wp-content\\themes\\jankx\\resources\\node_modules\\@babel\\parser\\lib\\index.js:9795:18)\n    at c:\\Users\\puleeno\\Projects\\raglai-culture\\wp-content\\themes\\jankx\\resources\\node_modules\\@babel\\parser\\lib\\index.js:10800:39\n    at TypeScriptParserMixin.allowInAnd (c:\\Users\\puleeno\\Projects\\raglai-culture\\wp-content\\themes\\jankx\\resources\\node_modules\\@babel\\parser\\lib\\index.js:12432:12)\n    at TypeScriptParserMixin.parseMaybeAssignAllowIn (c:\\Users\\puleeno\\Projects\\raglai-culture\\wp-content\\themes\\jankx\\resources\\node_modules\\@babel\\parser\\lib\\index.js:10800:17)\n    at TypeScriptParserMixin.parseMaybeAssignAllowInOrVoidPattern (c:\\Users\\puleeno\\Projects\\raglai-culture\\wp-content\\themes\\jankx\\resources\\node_modules\\@babel\\parser\\lib\\index.js:12499:17)\n    at TypeScriptParserMixin.parseParenAndDistinguishExpression (c:\\Users\\puleeno\\Projects\\raglai-culture\\wp-content\\themes\\jankx\\resources\\node_modules\\@babel\\parser\\lib\\index.js:11679:28)\n    at TypeScriptParserMixin.parseExprAtom (c:\\Users\\puleeno\\Projects\\raglai-culture\\wp-content\\themes\\jankx\\resources\\node_modules\\@babel\\parser\\lib\\index.js:11331:23)\n    at TypeScriptParserMixin.parseExprAtom (c:\\Users\\puleeno\\Projects\\raglai-culture\\wp-content\\themes\\jankx\\resources\\node_modules\\@babel\\parser\\lib\\index.js:4797:20)\n    at TypeScriptParserMixin.parseExprSubscripts (c:\\Users\\puleeno\\Projects\\raglai-culture\\wp-content\\themes\\jankx\\resources\\node_modules\\@babel\\parser\\lib\\index.js:11081:23)\n    at TypeScriptParserMixin.parseUpdate (c:\\Users\\puleeno\\Projects\\raglai-culture\\wp-content\\themes\\jankx\\resources\\node_modules\\@babel\\parser\\lib\\index.js:11066:21)\n    at TypeScriptParserMixin.parseMaybeUnary (c:\\Users\\puleeno\\Projects\\raglai-culture\\wp-content\\themes\\jankx\\resources\\node_modules\\@babel\\parser\\lib\\index.js:11046:23)\n    at TypeScriptParserMixin.parseMaybeUnary (c:\\Users\\puleeno\\Projects\\raglai-culture\\wp-content\\themes\\jankx\\resources\\node_modules\\@babel\\parser\\lib\\index.js:9857:18)\n    at TypeScriptParserMixin.parseMaybeUnaryOrPrivate (c:\\Users\\puleeno\\Projects\\raglai-culture\\wp-content\\themes\\jankx\\resources\\node_modules\\@babel\\parser\\lib\\index.js:10899:61)\n    at TypeScriptParserMixin.parseExprOpBaseRightExpr (c:\\Users\\puleeno\\Projects\\raglai-culture\\wp-content\\themes\\jankx\\resources\\node_modules\\@babel\\parser\\lib\\index.js:10986:34)\n    at TypeScriptParserMixin.parseExprOpRightExpr (c:\\Users\\puleeno\\Projects\\raglai-culture\\wp-content\\themes\\jankx\\resources\\node_modules\\@babel\\parser\\lib\\index.js:10981:21)\n    at TypeScriptParserMixin.parseExprOp (c:\\Users\\puleeno\\Projects\\raglai-culture\\wp-content\\themes\\jankx\\resources\\node_modules\\@babel\\parser\\lib\\index.js:10947:27)\n    at TypeScriptParserMixin.parseExprOp (c:\\Users\\puleeno\\Projects\\raglai-culture\\wp-content\\themes\\jankx\\resources\\node_modules\\@babel\\parser\\lib\\index.js:9394:18)\n    at TypeScriptParserMixin.parseExprOps (c:\\Users\\puleeno\\Projects\\raglai-culture\\wp-content\\themes\\jankx\\resources\\node_modules\\@babel\\parser\\lib\\index.js:10908:17)\n    at TypeScriptParserMixin.parseMaybeConditional (c:\\Users\\puleeno\\Projects\\raglai-culture\\wp-content\\themes\\jankx\\resources\\node_modules\\@babel\\parser\\lib\\index.js:10881:23)\n    at TypeScriptParserMixin.parseMaybeAssign (c:\\Users\\puleeno\\Projects\\raglai-culture\\wp-content\\themes\\jankx\\resources\\node_modules\\@babel\\parser\\lib\\index.js:10831:21)\n    at TypeScriptParserMixin.parseMaybeAssign (c:\\Users\\puleeno\\Projects\\raglai-culture\\wp-content\\themes\\jankx\\resources\\node_modules\\@babel\\parser\\lib\\index.js:9806:20)\n    at TypeScriptParserMixin.parseExpressionBase (c:\\Users\\puleeno\\Projects\\raglai-culture\\wp-content\\themes\\jankx\\resources\\node_modules\\@babel\\parser\\lib\\index.js:10784:23)\n    at c:\\Users\\puleeno\\Projects\\raglai-culture\\wp-content\\themes\\jankx\\resources\\node_modules\\@babel\\parser\\lib\\index.js:10780:39\n    at TypeScriptParserMixin.allowInAnd (c:\\Users\\puleeno\\Projects\\raglai-culture\\wp-content\\themes\\jankx\\resources\\node_modules\\@babel\\parser\\lib\\index.js:12432:12)\n    at TypeScriptParserMixin.parseExpression (c:\\Users\\puleeno\\Projects\\raglai-culture\\wp-content\\themes\\jankx\\resources\\node_modules\\@babel\\parser\\lib\\index.js:10780:17)\n    at TypeScriptParserMixin.jsxParseExpressionContainer (c:\\Users\\puleeno\\Projects\\raglai-culture\\wp-content\\themes\\jankx\\resources\\node_modules\\@babel\\parser\\lib\\index.js:4665:31)\n    at TypeScriptParserMixin.jsxParseElementAt (c:\\Users\\puleeno\\Projects\\raglai-culture\\wp-content\\themes\\jankx\\resources\\node_modules\\@babel\\parser\\lib\\index.js:4744:36)\n    at TypeScriptParserMixin.jsxParseElementAt (c:\\Users\\puleeno\\Projects\\raglai-culture\\wp-content\\themes\\jankx\\resources\\node_modules\\@babel\\parser\\lib\\index.js:4731:32)\n    at TypeScriptParserMixin.jsxParseElement (c:\\Users\\puleeno\\Projects\\raglai-culture\\wp-content\\themes\\jankx\\resources\\node_modules\\@babel\\parser\\lib\\index.js:4782:17)\n    at TypeScriptParserMixin.parseExprAtom (c:\\Users\\puleeno\\Projects\\raglai-culture\\wp-content\\themes\\jankx\\resources\\node_modules\\@babel\\parser\\lib\\index.js:4792:19)\n    at TypeScriptParserMixin.parseExprSubscripts (c:\\Users\\puleeno\\Projects\\raglai-culture\\wp-content\\themes\\jankx\\resources\\node_modules\\@babel\\parser\\lib\\index.js:11081:23)\n    at TypeScriptParserMixin.parseUpdate (c:\\Users\\puleeno\\Projects\\raglai-culture\\wp-content\\themes\\jankx\\resources\\node_modules\\@babel\\parser\\lib\\index.js:11066:21)\n    at TypeScriptParserMixin.parseMaybeUnary (c:\\Users\\puleeno\\Projects\\raglai-culture\\wp-content\\themes\\jankx\\resources\\node_modules\\@babel\\parser\\lib\\index.js:11046:23)\n    at TypeScriptParserMixin.parseMaybeUnary (c:\\Users\\puleeno\\Projects\\raglai-culture\\wp-content\\themes\\jankx\\resources\\node_modules\\@babel\\parser\\lib\\index.js:9857:18)\n    at TypeScriptParserMixin.parseMaybeUnaryOrPrivate (c:\\Users\\puleeno\\Projects\\raglai-culture\\wp-content\\themes\\jankx\\resources\\node_modules\\@babel\\parser\\lib\\index.js:10899:61)");
            /***/ 
        }),
        /***/ "./blocks/advanced-button/save.tsx": 
        /*!*****************************************!*\
          !*** ./blocks/advanced-button/save.tsx ***!
          \*****************************************/
        /***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
            "use strict";
            __webpack_require__.r(__webpack_exports__);
            /* harmony export */ __webpack_require__.d(__webpack_exports__, {
                /* harmony export */ "default": () => ( /* binding */Save)
                /* harmony export */ 
            });
            /* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
            /* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_0__);
            /* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
            /* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/ __webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__);
            /* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
            /* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/ __webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__);
            /**
             * External dependencies
             */
            /**
             * WordPress dependencies
             */
            /**
             * The save function for the Advanced Button Block.
             */
            function Save(props) {
                const { triggerType = 'link', buttonType = 'button', modalId = '', modalShareObjectId = false, modalSharePostTitle = false, modalShareCurrentUrl = false, modalShareFeaturedImageId = false, modalShareFeaturedImageUrl = false, formData = [], formMappings = [], text, url, title, linkTarget, rel, backgroundColor, textColor, gradient, useIconBlocks = false, iconPosition = 'left', showLabel = true, conditionType = 'always', showForPostType = '' } = props.attributes;
                // Always render the button - InnerBlocks.Content will handle inner blocks if they exist
                // Don't return null here because:
                // 1. If showLabel=true and text exists → render text
                // 2. If showLabel=true and no text but has inner blocks → InnerBlocks.Content will render them
                // 3. If showLabel=false → button can still have inner blocks (icon-only buttons)
                // We can't reliably check for inner blocks in save function, so we always render
                const blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps.save();
                // Get border props (includes border radius)
                const borderProps = (0, _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.__experimentalGetBorderClassesAndStyles)(props.attributes);
                // Check if button has no color settings
                const hasNoColorSettings = !backgroundColor && !textColor && !gradient && !props.attributes.style?.color?.background && !props.attributes.style?.color?.text && !props.attributes.style?.color?.gradient;
                const buttonClasses = classnames__WEBPACK_IMPORTED_MODULE_0___default()('jankx-advanced-button__link', borderProps?.className, {
                    [`has-${backgroundColor}-background-color`]: backgroundColor,
                    [`has-${textColor}-color`]: textColor,
                    [`has-${gradient}-gradient-background`]: gradient,
                    [`icon-position-${iconPosition}`]: iconPosition,
                    'has-base-color': hasNoColorSettings,
                    // Add classes for custom colors (WordPress may add these automatically)
                    'has-background': props.attributes.style?.color?.background || props.attributes.style?.color?.gradient,
                    'has-text-color': props.attributes.style?.color?.text
                });
                // Build button styles - include custom background/text colors from style.color
                const buttonStyles = {
                    ...blockProps.style,
                    ...borderProps?.style
                };
                // Copy spacing (padding, margin) from blockProps if needed
                // Border radius is already included from borderProps.style above
                // Apply custom background color from style.color.background if set
                if (props.attributes.style?.color?.background) {
                    buttonStyles.backgroundColor = props.attributes.style.color.background;
                }
                // Apply custom text color from style.color.text if set
                if (props.attributes.style?.color?.text) {
                    buttonStyles.color = props.attributes.style.color.text;
                }
                // Apply gradient if set (gradient takes priority over background color)
                if (props.attributes.style?.color?.gradient) {
                    buttonStyles.background = props.attributes.style.color.gradient;
                    // Remove backgroundColor when gradient is set
                    delete buttonStyles.backgroundColor;
                }
                // Sanitize text content to remove any nested anchor tags
                // This prevents invalid HTML like <a><a>text</a></a>
                const sanitizeText = html => {
                    if (!html)
                        return '';
                    // Remove any anchor tags but keep their content
                    return html.replace(/<\/?a[^>]*>/gi, '');
                };
                const sanitizedText = text ? sanitizeText(text) : '';
                // Always render in same order - use CSS to control visual position
                const textMarkup = /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.Fragment, {
                    children: [/*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("span", {
                            className: "button-icon-wrapper",
                            children: /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InnerBlocks.Content, {})
                        }), showLabel && /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText.Content, {
                            tagName: "span",
                            className: "button-text",
                            value: sanitizedText
                        })]
                });
                // Render button element based on trigger type
                let buttonElement = null;
                switch (triggerType) {
                    case 'link':
                        buttonElement = /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("a", {
                            className: buttonClasses,
                            href: url || '#',
                            target: linkTarget || undefined,
                            rel: rel || undefined,
                            style: buttonStyles,
                            title: title,
                            "data-condition-type": conditionType,
                            "data-show-for-post-type": showForPostType || undefined,
                            "data-trigger-type": "link",
                            children: textMarkup
                        });
                        break;
                    case 'button':
                        buttonElement = /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("button", {
                            className: buttonClasses,
                            type: buttonType,
                            style: buttonStyles,
                            title: title,
                            "data-condition-type": conditionType,
                            "data-show-for-post-type": showForPostType || undefined,
                            "data-trigger-type": "button",
                            children: textMarkup
                        });
                        break;
                    case 'detail-link':
                        // href="#" will be replaced by PHP with actual permalink
                        buttonElement = /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("a", {
                            className: buttonClasses + ' jankx-button-detail-link',
                            href: "#",
                            "data-trigger-type": "detail-link",
                            "data-condition-type": conditionType,
                            "data-show-for-post-type": showForPostType || undefined,
                            style: buttonStyles,
                            title: title,
                            children: textMarkup
                        });
                        break;
                    case 'modal':
                        // Build data attributes object for Micromodal
                        const modalDataAttrs = {
                            'data-micromodal-trigger': modalId || '',
                            // Micromodal standard attribute
                            'data-modal-id': modalId || '',
                            // Keep for backward compatibility
                            'data-trigger-type': 'modal'
                        };
                        modalDataAttrs['data-condition-type'] = conditionType;
                        if (showForPostType) {
                            modalDataAttrs['data-show-for-post-type'] = showForPostType;
                        }
                        // Add share data attributes if enabled
                        // These will be read by the modal's view.js when triggered
                        if (modalShareObjectId) {
                            modalDataAttrs['data-share-object-id'] = 'true';
                            modalDataAttrs['data-current-object-id'] = '{{CURRENT_POST_ID}}';
                        }
                        if (modalSharePostTitle) {
                            modalDataAttrs['data-share-post-title'] = 'true';
                            modalDataAttrs['data-current-post-title'] = '{{CURRENT_POST_TITLE}}';
                        }
                        if (modalShareCurrentUrl) {
                            modalDataAttrs['data-share-current-url'] = 'true';
                            modalDataAttrs['data-current-url'] = '{{CURRENT_POST_URL}}';
                        }
                        if (modalShareFeaturedImageId) {
                            modalDataAttrs['data-share-featured-image-id'] = 'true';
                            modalDataAttrs['data-current-featured-image-id'] = '{{CURRENT_FEATURED_IMAGE_ID}}';
                        }
                        if (modalShareFeaturedImageUrl) {
                            modalDataAttrs['data-share-featured-image-url'] = 'true';
                            modalDataAttrs['data-current-featured-image-url'] = '{{CURRENT_FEATURED_IMAGE_URL}}';
                        }
                        // Add custom form data
                        if (formData && formData.length > 0) {
                            formData.forEach(item => {
                                if (item.key && item.value) {
                                    modalDataAttrs[`data-form-${item.key}`] = item.value;
                                }
                            });
                        }
                        // Add form data mappings (as JSON payload)
                        if (Array.isArray(formMappings) && formMappings.length > 0) {
                            try {
                                modalDataAttrs['data-form-mappings'] = JSON.stringify(formMappings);
                            }
                            catch (e) {
                                // ignore JSON errors silently
                            }
                        }
                        buttonElement = /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("button", {
                            className: buttonClasses + (modalId ? ' jankx-button-modal-trigger' : ''),
                            type: "button",
                            ...modalDataAttrs,
                            style: buttonStyles,
                            title: title,
                            children: textMarkup
                        });
                        break;
                    default:
                        buttonElement = /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("a", {
                            className: buttonClasses,
                            href: "#",
                            style: buttonStyles,
                            title: title,
                            "data-trigger-type": "link",
                            children: textMarkup
                        });
                }
                return /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
                    ...blockProps,
                    children: buttonElement
                });
            }
            /***/ 
        }),
        /***/ "./node_modules/@wordpress/icons/build-module/library/button.js": 
        /*!**********************************************************************!*\
          !*** ./node_modules/@wordpress/icons/build-module/library/button.js ***!
          \**********************************************************************/
        /***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
            "use strict";
            __webpack_require__.r(__webpack_exports__);
            /* harmony export */ __webpack_require__.d(__webpack_exports__, {
                /* harmony export */ "default": () => ( /* binding */button_default)
                /* harmony export */ 
            });
            /* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/primitives */ "@wordpress/primitives");
            /* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__);
            /* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
            /* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/ __webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);
            // packages/icons/src/library/button.tsx
            var button_default = /* @__PURE__ */ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.SVG, {
                viewBox: "0 0 24 24",
                xmlns: "http://www.w3.org/2000/svg",
                children: /* @__PURE__ */ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.Path, {
                    d: "M8 12.5h8V11H8v1.5Z M19 6.5H5a2 2 0 0 0-2 2V15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.5a2 2 0 0 0-2-2ZM5 8h14a.5.5 0 0 1 .5.5V15a.5.5 0 0 1-.5.5H5a.5.5 0 0 1-.5-.5V8.5A.5.5 0 0 1 5 8Z"
                })
            });
            /***/ 
        }),
        /***/ "./node_modules/classnames/index.js": 
        /*!******************************************!*\
          !*** ./node_modules/classnames/index.js ***!
          \******************************************/
        /***/ ((module, exports) => {
            var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__; /*!
                Copyright (c) 2018 Jed Watson.
                Licensed under the MIT License (MIT), see
                http://jedwatson.github.io/classnames
            */
            /* global define */
            (function () {
                'use strict';
                var hasOwn = {}.hasOwnProperty;
                function classNames() {
                    var classes = '';
                    for (var i = 0; i < arguments.length; i++) {
                        var arg = arguments[i];
                        if (arg) {
                            classes = appendClass(classes, parseValue(arg));
                        }
                    }
                    return classes;
                }
                function parseValue(arg) {
                    if (typeof arg === 'string' || typeof arg === 'number') {
                        return arg;
                    }
                    if (typeof arg !== 'object') {
                        return '';
                    }
                    if (Array.isArray(arg)) {
                        return classNames.apply(null, arg);
                    }
                    if (arg.toString !== Object.prototype.toString && !arg.toString.toString().includes('[native code]')) {
                        return arg.toString();
                    }
                    var classes = '';
                    for (var key in arg) {
                        if (hasOwn.call(arg, key) && arg[key]) {
                            classes = appendClass(classes, key);
                        }
                    }
                    return classes;
                }
                function appendClass(value, newClass) {
                    if (!newClass) {
                        return value;
                    }
                    if (value) {
                        return value + ' ' + newClass;
                    }
                    return value + newClass;
                }
                if (true && module.exports) {
                    classNames.default = classNames;
                    module.exports = classNames;
                }
                else if (true) {
                    // register as 'classnames', consistent with npm package name
                    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function () {
                        return classNames;
                    }).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
                        __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
                }
                else // removed by dead control flow
                 { }
            })();
            /***/ 
        }),
        /***/ "@wordpress/block-editor": 
        /*!*************************************!*\
          !*** external ["wp","blockEditor"] ***!
          \*************************************/
        /***/ ((module) => {
            "use strict";
            module.exports = window["wp"]["blockEditor"];
            /***/ 
        }),
        /***/ "@wordpress/blocks": 
        /*!********************************!*\
          !*** external ["wp","blocks"] ***!
          \********************************/
        /***/ ((module) => {
            "use strict";
            module.exports = window["wp"]["blocks"];
            /***/ 
        }),
        /***/ "@wordpress/i18n": 
        /*!******************************!*\
          !*** external ["wp","i18n"] ***!
          \******************************/
        /***/ ((module) => {
            "use strict";
            module.exports = window["wp"]["i18n"];
            /***/ 
        }),
        /***/ "@wordpress/primitives": 
        /*!************************************!*\
          !*** external ["wp","primitives"] ***!
          \************************************/
        /***/ ((module) => {
            "use strict";
            module.exports = window["wp"]["primitives"];
            /***/ 
        }),
        /***/ "react/jsx-runtime": 
        /*!**********************************!*\
          !*** external "ReactJSXRuntime" ***!
          \**********************************/
        /***/ ((module) => {
            "use strict";
            module.exports = window["ReactJSXRuntime"];
            /***/ 
        })
        /******/ 
    });
    /************************************************************************/
    /******/ // The module cache
    /******/ var __webpack_module_cache__ = {};
    /******/
    /******/ // The require function
    /******/ function __webpack_require__(moduleId) {
        /******/ // Check if module is in cache
        /******/ var cachedModule = __webpack_module_cache__[moduleId];
        /******/ if (cachedModule !== undefined) {
            /******/ return cachedModule.exports;
            /******/ }
        /******/ // Create a new module (and put it into the cache)
        /******/ var module = __webpack_module_cache__[moduleId] = {
            /******/ // no module.id needed
            /******/ // no module.loaded needed
            /******/ exports: {}
            /******/ 
        };
        /******/
        /******/ // Execute the module function
        /******/ __webpack_modules__[moduleId](module, module.exports, __webpack_require__);
        /******/
        /******/ // Return the exports of the module
        /******/ return module.exports;
        /******/ 
    }
    /******/
    /************************************************************************/
    /******/ /* webpack/runtime/compat get default export */
    /******/ (() => {
        /******/ // getDefaultExport function for compatibility with non-harmony modules
        /******/ __webpack_require__.n = (module) => {
            /******/ var getter = module && module.__esModule ?
                /******/ () => (module['default']) :
                /******/ () => (module);
            /******/ __webpack_require__.d(getter, { a: getter });
            /******/ return getter;
            /******/ 
        };
        /******/ 
    })();
    /******/
    /******/ /* webpack/runtime/define property getters */
    /******/ (() => {
        /******/ // define getter functions for harmony exports
        /******/ __webpack_require__.d = (exports, definition) => {
            /******/ for (var key in definition) {
                /******/ if (__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
                    /******/ Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
                    /******/ }
                /******/ }
            /******/ 
        };
        /******/ 
    })();
    /******/
    /******/ /* webpack/runtime/hasOwnProperty shorthand */
    /******/ (() => {
        /******/ __webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop));
        /******/ 
    })();
    /******/
    /******/ /* webpack/runtime/make namespace object */
    /******/ (() => {
        /******/ // define __esModule on exports
        /******/ __webpack_require__.r = (exports) => {
            /******/ if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
                /******/ Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
                /******/ }
            /******/ Object.defineProperty(exports, '__esModule', { value: true });
            /******/ 
        };
        /******/ 
    })();
    /******/
    /************************************************************************/
    var __webpack_exports__ = {};
    // This entry needs to be wrapped in an IIFE because it needs to be in strict mode.
    (() => {
        "use strict";
        /*!******************************************!*\
          !*** ./blocks/advanced-button/index.tsx ***!
          \******************************************/
        __webpack_require__.r(__webpack_exports__);
        /* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
        /* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
        /* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/button.js");
        /* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
        /* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/ __webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_2__);
        /* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./edit */ "./blocks/advanced-button/edit.tsx");
        /* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/ __webpack_require__.n(_edit__WEBPACK_IMPORTED_MODULE_3__);
        /* harmony import */ var _save__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./save */ "./blocks/advanced-button/save.tsx");
        /* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./block.json */ "./blocks/advanced-button/block.json");
        /**
         * WordPress dependencies
         */
        /**
         * Internal dependencies
         */
        const settings = {
            ..._block_json__WEBPACK_IMPORTED_MODULE_5__,
            icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_1__["default"],
            example: {
                attributes: {
                    text: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Advanced Button', 'jankx'),
                    backgroundColor: '#007cba',
                    textColor: '#ffffff',
                    style: {
                        border: {
                            radius: '4px'
                        },
                        spacing: {
                            padding: {
                                top: '12px',
                                right: '24px',
                                bottom: '12px',
                                left: '24px'
                            }
                        }
                    }
                }
            },
            edit: (_edit__WEBPACK_IMPORTED_MODULE_3___default()),
            save: _save__WEBPACK_IMPORTED_MODULE_4__["default"]
        };
        /**
         * Register the Advanced Button Block.
         */
        (0, _wordpress_blocks__WEBPACK_IMPORTED_MODULE_2__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_5__.name, settings);
    })();
    /******/ 
})();
//# sourceMappingURL=index.js.map
