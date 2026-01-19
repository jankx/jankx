/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
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
/*!***********************************!*\
  !*** ./blocks-extra/ts/editor.ts ***!
  \***********************************/
__webpack_require__.r(__webpack_exports__);
/**
 * Blocks Extra Editor TypeScript
 * 
 * Adds render mode selection dropdown to all Gutenberg blocks
 * for enhanced responsive control and SSR/CSR rendering options.
 */



// Import WordPress types
/// <reference path="./wp-types.d.ts" />

// Type definitions
// Constants
const RENDER_MODES = [{
  label: 'SSR (Server-Side Rendering)',
  value: 'ssr'
}, {
  label: 'CSR (Client-Side Rendering)',
  value: 'csr'
}];
const EXCLUDED_BLOCKS = ['core/block', 'core/template-part', 'core/template'];

/**
 * Render Mode Control Panel
 */
const RenderModeControl = ({
  attributes,
  setAttributes
}) => {
  var _attributes$jankxRend;
  const renderMode = (_attributes$jankxRend = attributes.jankxRenderMode) !== null && _attributes$jankxRend !== void 0 ? _attributes$jankxRend : 'ssr';
  return wp.element.createElement(wp.components.PanelBody, {
    title: 'Jankx Advanced Settings',
    initialOpen: false
  }, wp.element.createElement(wp.components.SelectControl, {
    label: 'Render Mode',
    value: renderMode,
    options: RENDER_MODES,
    onChange: value => {
      setAttributes({
        jankxRenderMode: value
      });
    },
    help: 'SSR renders on server for better SEO and performance. CSR renders on client for interactive content.'
  }));
};

/**
 * Add render mode control to all blocks
 */
function addRenderModeControl(BlockEdit) {
  return function (props) {
    const {
      name,
      isSelected,
      setAttributes,
      attributes
    } = props;

    // Don't show for excluded blocks
    if (EXCLUDED_BLOCKS.some(excluded => name.startsWith(excluded))) {
      return wp.element.createElement(BlockEdit, props);
    }
    const elements = [wp.element.createElement(BlockEdit, props)];
    if (isSelected) {
      elements.push(wp.element.createElement(wp.blockEditor.InspectorControls, {
        key: 'jankx-render-mode-controls'
      }, wp.element.createElement(RenderModeControl, {
        attributes,
        setAttributes
      })));
    }
    return elements;
  };
}

/**
 * Add render mode attribute to block's save function
 */
function addRenderModeToSave(props, blockType, attributes) {
  if (attributes.jankxRenderMode) {
    const className = props.className ? `${props.className} jankx-render-mode-${attributes.jankxRenderMode}` : `jankx-render-mode-${attributes.jankxRenderMode}`;
    return {
      ...props,
      className
    };
  }
  return props;
}

/**
 * Filter block registration to add our attribute
 */
function addRenderModeAttribute(settings) {
  return {
    ...settings,
    attributes: {
      ...settings.attributes,
      jankxRenderMode: {
        type: 'string',
        default: 'ssr'
      }
    }
  };
}

/**
 * Initialize the blocks extra editor system
 */
function initializeBlocksExtraEditor() {
  // Apply filters
  wp.hooks.addFilter('blocks.registerBlockType', 'jankx/blocks-extra/add-render-mode-attribute', addRenderModeAttribute);
  wp.hooks.addFilter('editor.BlockEdit', 'jankx/blocks-extra/add-render-mode-control', addRenderModeControl);
  wp.hooks.addFilter('blocks.getSaveContent.extraProps', 'jankx/blocks-extra/add-render-mode-to-save', addRenderModeToSave);

  // Add Responsive Dimensions support
  wp.hooks.addFilter('blocks.registerBlockType', 'jankx/blocks-extra/add-responsive-dimensions-attributes', addResponsiveDimensionsAttributes);
  wp.hooks.addFilter('editor.BlockEdit', 'jankx/blocks-extra/add-responsive-dimensions-controls', addResponsiveDimensionsControls);
  wp.hooks.addFilter('blocks.getSaveContent.extraProps', 'jankx/blocks-extra/add-responsive-dimensions-to-save', addResponsiveDimensionsToSave);

  // Add CSS class to body for styling
  document.body.classList.add('jankx-blocks-extra-enabled');
  injectResponsiveDimensionsCSS();

  // Add Line Clamp support
  wp.hooks.addFilter('blocks.registerBlockType', 'jankx/blocks-extra/add-line-clamp-attributes', addLineClampAttributes);
  wp.hooks.addFilter('editor.BlockEdit', 'jankx/blocks-extra/add-line-clamp-control', addLineClampControl);
  injectLineClampCSS();
}

// Initialize when DOM is ready
if (typeof wp !== 'undefined' && wp.domReady) {
  wp.domReady(initializeBlocksExtraEditor);
} else {
  // Fallback for environments where wp.domReady is unavailable
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initializeBlocksExtraEditor());
  } else {
    initializeBlocksExtraEditor();
  }
}

/**
 * Line Clamp Support
 * Adds line-clamp control to specific blocks (core/post-title, woocommerce/product-title, core/heading)
 */

const LINE_CLAMP_SUPPORTED_BLOCKS = ['core/post-title', 'woocommerce/product-title', 'core/heading'];

/**
 * Add line-clamp attributes to supported blocks
 */
function addLineClampAttributes(settings, name) {
  if (!LINE_CLAMP_SUPPORTED_BLOCKS.includes(name)) {
    return settings;
  }
  return {
    ...settings,
    attributes: {
      ...settings.attributes,
      jankxLineClamp: {
        type: 'number',
        default: undefined
      },
      jankxLineClampTablet: {
        type: 'number',
        default: undefined
      },
      jankxLineClampMobile: {
        type: 'number',
        default: undefined
      }
    }
  };
}

/**
 * Line Clamp Control Component
 */
const LineClampControl = ({
  attributes,
  setAttributes
}) => {
  const [currentDevice, setCurrentDevice] = wp.element.useState('desktop');
  const getClampValue = () => {
    if (currentDevice === 'mobile') return attributes.jankxLineClampMobile;
    if (currentDevice === 'tablet') return attributes.jankxLineClampTablet;
    return attributes.jankxLineClamp;
  };
  const setClampValue = value => {
    const patch = {};
    if (currentDevice === 'mobile') patch.jankxLineClampMobile = value;else if (currentDevice === 'tablet') patch.jankxLineClampTablet = value;else patch.jankxLineClamp = value;
    setAttributes(patch);
  };
  return wp.element.createElement(wp.components.PanelBody, {
    title: 'Line Clamp (Responsive)',
    initialOpen: true
  }, wp.element.createElement(wp.components.ButtonGroup, {
    style: {
      marginBottom: '12px'
    }
  }, wp.element.createElement(wp.components.Button, {
    isPressed: currentDevice === 'desktop',
    onClick: () => setCurrentDevice('desktop'),
    variant: currentDevice === 'desktop' ? 'primary' : 'secondary',
    size: 'small',
    title: 'Desktop'
  }, '🖥️'), wp.element.createElement(wp.components.Button, {
    isPressed: currentDevice === 'tablet',
    onClick: () => setCurrentDevice('tablet'),
    variant: currentDevice === 'tablet' ? 'primary' : 'secondary',
    size: 'small',
    title: 'Tablet'
  }, '📱'), wp.element.createElement(wp.components.Button, {
    isPressed: currentDevice === 'mobile',
    onClick: () => setCurrentDevice('mobile'),
    variant: currentDevice === 'mobile' ? 'primary' : 'secondary',
    size: 'small',
    title: 'Mobile'
  }, '📱')), wp.element.createElement(wp.components.RangeControl, {
    label: `Line Clamp (${currentDevice})`,
    value: getClampValue(),
    min: 1,
    max: 10,
    allowReset: true,
    onChange: value => setClampValue(typeof value === 'number' ? value : undefined),
    help: `Giới hạn số dòng hiển thị trên ${currentDevice}.`
  }));
};

/**
 * Add line-clamp control to block inspector
 */
function addLineClampControl(BlockEdit) {
  return function (props) {
    const {
      name,
      attributes,
      setAttributes,
      isSelected
    } = props;

    // Only apply to supported blocks
    if (!LINE_CLAMP_SUPPORTED_BLOCKS.includes(name)) {
      return wp.element.createElement(BlockEdit, props);
    }
    const elements = [wp.element.createElement(BlockEdit, props)];
    if (isSelected) {
      elements.push(wp.element.createElement(wp.blockEditor.InspectorControls, {
        key: 'jankx-line-clamp-controls',
        group: 'typography'
      }, wp.element.createElement(LineClampControl, {
        attributes,
        setAttributes
      })));
    }
    return elements;
  };
}

/**
 * Inject CSS for line-clamp in editor
 */
function injectLineClampCSS() {
  const STYLE_ID = 'jankx-line-clamp-css';
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
        .has-jankx-line-clamp {
            display: -webkit-box;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-overflow: ellipsis;
            -webkit-line-clamp: var(--jankx-line-clamp, initial);
            line-clamp: var(--jankx-line-clamp, initial);
        }
        @media (max-width: 1024px) {
            .has-jankx-line-clamp {
                -webkit-line-clamp: var(--jankx-line-clamp-tablet, var(--jankx-line-clamp, initial));
                line-clamp: var(--jankx-line-clamp-tablet, var(--jankx-line-clamp, initial));
            }
        }
        @media (max-width: 768px) {
            .has-jankx-line-clamp {
                -webkit-line-clamp: var(--jankx-line-clamp-mobile, var(--jankx-line-clamp-tablet, var(--jankx-line-clamp, initial)));
                line-clamp: var(--jankx-line-clamp-mobile, var(--jankx-line-clamp-tablet, var(--jankx-line-clamp, initial)));
            }
        }
    `;
  document.head.appendChild(style);
}

// Export types for external use

/**
 * Responsive Dimensions: Attributes
 */
function addResponsiveDimensionsAttributes(settings, name) {
  const spacingSupport = wp.blocks.getBlockSupport ? wp.blocks.getBlockSupport(name, 'spacing') : settings?.supports?.spacing;
  if (!spacingSupport) {
    return settings;
  }
  // Disable core padding/margin controls so we can replace them
  const supports = {
    ...(settings.supports || {})
  };
  const spacing = {
    ...(supports.spacing || {})
  };
  spacing.padding = false;
  spacing.margin = false;
  supports.spacing = spacing;
  settings.supports = supports;
  const attributes = {
    ...(settings.attributes || {}),
    jankxPaddingDesktop: {
      type: 'number'
    },
    jankxPaddingTablet: {
      type: 'number'
    },
    jankxPaddingMobile: {
      type: 'number'
    },
    jankxMarginDesktop: {
      type: 'number'
    },
    jankxMarginTablet: {
      type: 'number'
    },
    jankxMarginMobile: {
      type: 'number'
    },
    jankxGapDesktop: {
      type: 'number'
    },
    jankxGapTablet: {
      type: 'number'
    },
    jankxGapMobile: {
      type: 'number'
    },
    jankxFlexOrderDesktop: {
      type: 'number'
    },
    jankxFlexOrderTablet: {
      type: 'number'
    },
    jankxFlexOrderMobile: {
      type: 'number'
    }
  };
  return {
    ...settings,
    attributes
  };
}

/**
 * Responsive Dimensions Control Component
 */
const ResponsiveDimensionsControl = ({
  attributes,
  setAttributes
}) => {
  const [current, setCurrent] = wp.element.useState('desktop');
  const ToolsPanelItem = wp.components.__experimentalToolsPanelItem;
  const getVal = type => {
    const d = current;
    if (type === 'padding') return d === 'desktop' ? attributes.jankxPaddingDesktop : d === 'tablet' ? attributes.jankxPaddingTablet : attributes.jankxPaddingMobile;
    if (type === 'margin') return d === 'desktop' ? attributes.jankxMarginDesktop : d === 'tablet' ? attributes.jankxMarginTablet : attributes.jankxMarginMobile;
    return d === 'desktop' ? attributes.jankxGapDesktop : d === 'tablet' ? attributes.jankxGapTablet : attributes.jankxGapMobile;
  };
  const setVal = (type, value) => {
    const d = current;
    const patch = {};
    if (type === 'padding') {
      if (d === 'desktop') patch.jankxPaddingDesktop = value;else if (d === 'tablet') patch.jankxPaddingTablet = value;else patch.jankxPaddingMobile = value;
    } else if (type === 'margin') {
      if (d === 'desktop') patch.jankxMarginDesktop = value;else if (d === 'tablet') patch.jankxMarginTablet = value;else patch.jankxMarginMobile = value;
    } else {
      if (d === 'desktop') patch.jankxGapDesktop = value;else if (d === 'tablet') patch.jankxGapTablet = value;else patch.jankxGapMobile = value;
    }
    setAttributes(patch);
  };
  return [wp.element.createElement(ToolsPanelItem, {
    key: 'padding-control',
    label: 'Padding (Responsive)',
    isShownByDefault: true,
    hasValue: () => [attributes.jankxPaddingDesktop, attributes.jankxPaddingTablet, attributes.jankxPaddingMobile].some(x => typeof x === 'number'),
    onDeselect: () => setAttributes({
      jankxPaddingDesktop: undefined,
      jankxPaddingTablet: undefined,
      jankxPaddingMobile: undefined
    })
  }, wp.element.createElement(wp.components.ButtonGroup, {
    style: {
      marginBottom: '12px'
    }
  }, wp.element.createElement(wp.components.Button, {
    isPressed: current === 'desktop',
    onClick: () => setCurrent('desktop'),
    variant: current === 'desktop' ? 'primary' : 'secondary',
    size: 'small',
    title: 'Desktop'
  }, '🖥️'), wp.element.createElement(wp.components.Button, {
    isPressed: current === 'tablet',
    onClick: () => setCurrent('tablet'),
    variant: current === 'tablet' ? 'primary' : 'secondary',
    size: 'small',
    title: 'Tablet'
  }, '📱'), wp.element.createElement(wp.components.Button, {
    isPressed: current === 'mobile',
    onClick: () => setCurrent('mobile'),
    variant: current === 'mobile' ? 'primary' : 'secondary',
    size: 'small',
    title: 'Mobile'
  }, '📱')), wp.element.createElement(wp.components.RangeControl, {
    label: `Padding`,
    value: getVal('padding'),
    min: 0,
    max: 128,
    allowReset: true,
    onChange: v => setVal('padding', typeof v === 'number' ? v : undefined),
    help: 'Khoảng cách bên trong khối; áp dụng cho tất cả các cạnh'
  })), wp.element.createElement(ToolsPanelItem, {
    key: 'margin-control',
    label: 'Margin (Responsive)',
    isShownByDefault: true,
    hasValue: () => [attributes.jankxMarginDesktop, attributes.jankxMarginTablet, attributes.jankxMarginMobile].some(x => typeof x === 'number'),
    onDeselect: () => setAttributes({
      jankxMarginDesktop: undefined,
      jankxMarginTablet: undefined,
      jankxMarginMobile: undefined
    })
  }, wp.element.createElement(wp.components.ButtonGroup, {
    style: {
      marginBottom: '12px'
    }
  }, wp.element.createElement(wp.components.Button, {
    isPressed: current === 'desktop',
    onClick: () => setCurrent('desktop'),
    variant: current === 'desktop' ? 'primary' : 'secondary',
    size: 'small',
    title: 'Desktop'
  }, '🖥️'), wp.element.createElement(wp.components.Button, {
    isPressed: current === 'tablet',
    onClick: () => setCurrent('tablet'),
    variant: current === 'tablet' ? 'primary' : 'secondary',
    size: 'small',
    title: 'Tablet'
  }, '📱'), wp.element.createElement(wp.components.Button, {
    isPressed: current === 'mobile',
    onClick: () => setCurrent('mobile'),
    variant: current === 'mobile' ? 'primary' : 'secondary',
    size: 'small',
    title: 'Mobile'
  }, '📱')), wp.element.createElement(wp.components.RangeControl, {
    label: `Margin`,
    value: getVal('margin'),
    min: 0,
    max: 128,
    allowReset: true,
    onChange: v => setVal('margin', typeof v === 'number' ? v : undefined),
    help: 'Khoảng cách bên ngoài khối; áp dụng cho tất cả các cạnh'
  })), wp.element.createElement(ToolsPanelItem, {
    key: 'flex-order-control',
    label: 'Flex Order (Responsive)',
    isShownByDefault: false,
    hasValue: () => [attributes.jankxFlexOrderDesktop, attributes.jankxFlexOrderTablet, attributes.jankxFlexOrderMobile].some(x => typeof x === 'number'),
    onDeselect: () => setAttributes({
      jankxFlexOrderDesktop: undefined,
      jankxFlexOrderTablet: undefined,
      jankxFlexOrderMobile: undefined
    })
  }, wp.element.createElement(wp.components.ButtonGroup, {
    style: {
      marginBottom: '12px'
    }
  }, wp.element.createElement(wp.components.Button, {
    isPressed: current === 'desktop',
    onClick: () => setCurrent('desktop'),
    variant: current === 'desktop' ? 'primary' : 'secondary',
    size: 'small',
    title: 'Desktop'
  }, '🖥️'), wp.element.createElement(wp.components.Button, {
    isPressed: current === 'tablet',
    onClick: () => setCurrent('tablet'),
    variant: current === 'tablet' ? 'primary' : 'secondary',
    size: 'small',
    title: 'Tablet'
  }, '📱'), wp.element.createElement(wp.components.Button, {
    isPressed: current === 'mobile',
    onClick: () => setCurrent('mobile'),
    variant: current === 'mobile' ? 'primary' : 'secondary',
    size: 'small',
    title: 'Mobile'
  }, '📱')), wp.element.createElement(wp.components.RangeControl, {
    label: `Flex Order`,
    value: current === 'desktop' ? attributes.jankxFlexOrderDesktop : current === 'tablet' ? attributes.jankxFlexOrderTablet : attributes.jankxFlexOrderMobile,
    min: -10,
    max: 20,
    allowReset: true,
    onChange: v => {
      const patch = {};
      if (current === 'desktop') patch.jankxFlexOrderDesktop = v;else if (current === 'tablet') patch.jankxFlexOrderTablet = v;else patch.jankxFlexOrderMobile = v;
      setAttributes(patch);
    },
    help: 'Thứ tự hiển thị của block trong flex/grid container'
  }))];
};

/**
 * Add responsive dimensions control to block inspector
 */
function addResponsiveDimensionsControls(BlockEdit) {
  return function (props) {
    const {
      name,
      attributes,
      setAttributes,
      isSelected
    } = props;
    const spacingSupport = wp.blocks.getBlockSupport ? wp.blocks.getBlockSupport(name, 'spacing') : true;
    if (!spacingSupport) {
      return wp.element.createElement(BlockEdit, props);
    }
    const elements = [wp.element.createElement(BlockEdit, props)];
    if (isSelected) {
      elements.push(wp.element.createElement(wp.blockEditor.InspectorControls, {
        key: 'jankx-responsive-dimensions-controls',
        group: 'dimensions'
      }, wp.element.createElement(ResponsiveDimensionsControl, {
        attributes,
        setAttributes
      })));
    }
    return elements;
  };
}

/**
 * Responsive Dimensions: Save props
 */
function addResponsiveDimensionsToSave(props, _blockType, attributes) {
  const hasPadding = [attributes.jankxPaddingDesktop, attributes.jankxPaddingTablet, attributes.jankxPaddingMobile].some(v => typeof v === 'number');
  const hasMargin = [attributes.jankxMarginDesktop, attributes.jankxMarginTablet, attributes.jankxMarginMobile].some(v => typeof v === 'number');
  const hasGap = [attributes.jankxGapDesktop, attributes.jankxGapTablet, attributes.jankxGapMobile].some(v => typeof v === 'number');
  const hasFlexOrder = [attributes.jankxFlexOrderDesktop, attributes.jankxFlexOrderTablet, attributes.jankxFlexOrderMobile].some(v => typeof v === 'number');
  if (hasPadding || hasMargin || hasGap || hasFlexOrder) {
    const className = (props.className || '') + (/\bhas-jankx-responsive-dimensions\b/.test(props.className || '') ? '' : (props.className ? ' ' : '') + 'has-jankx-responsive-dimensions') + (hasPadding && !/\bhas-jankx-padding\b/.test(props.className || '') ? ' has-jankx-padding' : '') + (hasMargin && !/\bhas-jankx-margin\b/.test(props.className || '') ? ' has-jankx-margin' : '') + (hasGap && !/\bhas-jankx-gap\b/.test(props.className || '') ? ' has-jankx-gap' : '') + (hasFlexOrder && !/\bhas-jankx-flex-order\b/.test(props.className || '') ? ' has-jankx-flex-order' : '');
    const style = {
      ...(props.style || {})
    };
    if (typeof attributes.jankxPaddingDesktop === 'number') style['--jankx-padding-desktop'] = attributes.jankxPaddingDesktop + 'px';
    if (typeof attributes.jankxPaddingTablet === 'number') style['--jankx-padding-tablet'] = attributes.jankxPaddingTablet + 'px';
    if (typeof attributes.jankxPaddingMobile === 'number') style['--jankx-padding-mobile'] = attributes.jankxPaddingMobile + 'px';
    if (typeof attributes.jankxMarginDesktop === 'number') style['--jankx-margin-desktop'] = attributes.jankxMarginDesktop + 'px';
    if (typeof attributes.jankxMarginTablet === 'number') style['--jankx-margin-tablet'] = attributes.jankxMarginTablet + 'px';
    if (typeof attributes.jankxMarginMobile === 'number') style['--jankx-margin-mobile'] = attributes.jankxMarginMobile + 'px';
    if (typeof attributes.jankxGapDesktop === 'number') style['--jankx-gap-desktop'] = attributes.jankxGapDesktop + 'px';
    if (typeof attributes.jankxGapTablet === 'number') style['--jankx-gap-tablet'] = attributes.jankxGapTablet + 'px';
    if (typeof attributes.jankxGapMobile === 'number') style['--jankx-gap-mobile'] = attributes.jankxGapMobile + 'px';
    if (typeof attributes.jankxFlexOrderDesktop === 'number') style['--jankx-flex-order-desktop'] = attributes.jankxFlexOrderDesktop;
    if (typeof attributes.jankxFlexOrderTablet === 'number') style['--jankx-flex-order-tablet'] = attributes.jankxFlexOrderTablet;
    if (typeof attributes.jankxFlexOrderMobile === 'number') style['--jankx-flex-order-mobile'] = attributes.jankxFlexOrderMobile;
    return {
      ...props,
      className,
      style
    };
  }
  return props;
}

/**
 * Inject CSS for responsive dimensions
 */
function injectResponsiveDimensionsCSS() {
  const STYLE_ID = 'jankx-responsive-dimensions-css';
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
        .has-jankx-responsive-dimensions.has-jankx-padding { padding: var(--jankx-padding-desktop, initial); }
        .has-jankx-responsive-dimensions.has-jankx-margin { margin: var(--jankx-margin-desktop, initial); }
        .has-jankx-responsive-dimensions.has-jankx-gap {
            gap: var(--jankx-gap-desktop, var(--wp--style--block-gap, initial));
            --wp--style--block-gap: var(--jankx-gap-desktop, var(--wp--style--block-gap, initial));
        }
        .has-jankx-responsive-dimensions.has-jankx-flex-order {
            order: var(--jankx-flex-order-desktop, initial);
        }
        @media (max-width: 1024px) {
            .has-jankx-responsive-dimensions.has-jankx-padding { padding: var(--jankx-padding-tablet, var(--jankx-padding-desktop, initial)); }
            .has-jankx-responsive-dimensions.has-jankx-margin { margin: var(--jankx-margin-tablet, var(--jankx-margin-desktop, initial)); }
            .has-jankx-responsive-dimensions.has-jankx-gap {
                gap: var(--jankx-gap-tablet, var(--jankx-gap-desktop, var(--wp--style--block-gap, initial)));
                --wp--style--block-gap: var(--jankx-gap-tablet, var(--jankx-gap-desktop, var(--wp--style--block-gap, initial)));
            }
            .has-jankx-responsive-dimensions.has-jankx-flex-order {
                order: var(--jankx-flex-order-tablet, var(--jankx-flex-order-desktop, initial));
            }
        }
        @media (max-width: 768px) {
            .has-jankx-responsive-dimensions.has-jankx-padding { padding: var(--jankx-padding-mobile, var(--jankx-padding-tablet, var(--jankx-padding-desktop, initial))); }
            .has-jankx-responsive-dimensions.has-jankx-margin { margin: var(--jankx-margin-mobile, var(--jankx-margin-tablet, var(--jankx-margin-desktop, initial))); }
            .has-jankx-responsive-dimensions.has-jankx-gap {
                gap: var(--jankx-gap-mobile, var(--jankx-gap-tablet, var(--jankx-gap-desktop, var(--wp--style--block-gap, initial))));
                --wp--style--block-gap: var(--jankx-gap-mobile, var(--jankx-gap-tablet, var(--jankx-gap-desktop, var(--wp--style--block-gap, initial))));
            }
            .has-jankx-responsive-dimensions.has-jankx-flex-order {
                order: var(--jankx-flex-order-mobile, var(--jankx-flex-order-tablet, var(--jankx-flex-order-desktop, initial)));
            }
        }
    `;
  document.head.appendChild(style);
}

/******/ })()
;
//# sourceMappingURL=editor.js.map