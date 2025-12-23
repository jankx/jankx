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
 * Add render mode control to all blocks
 */
function addRenderModeControl(BlockEdit) {
  return function (props) {
    var _attributes$jankxRend;
    const {
      name,
      attributes,
      setAttributes,
      isSelected
    } = props;

    // Don't show for excluded blocks
    if (EXCLUDED_BLOCKS.some(excluded => name.startsWith(excluded))) {
      return wp.element.createElement(BlockEdit, props);
    }
    const renderMode = (_attributes$jankxRend = attributes.jankxRenderMode) !== null && _attributes$jankxRend !== void 0 ? _attributes$jankxRend : 'ssr';

    // Create the enhanced block edit component
    const blockEdit = wp.element.createElement(BlockEdit, props);

    // Only show the panel when block is selected
    if (!isSelected) {
      return blockEdit;
    }

    // Add the render mode control to inspector
    const renderModeControl = wp.element.createElement(wp.components.InspectorControls, {}, wp.element.createElement(wp.components.PanelBody, {
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
    })));
    return [blockEdit, renderModeControl];
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
}

// Initialize when DOM is ready
wp.dom.ready(initializeBlocksExtraEditor);

// Export types for external use

/**
 * Responsive Dimensions: Attributes
 */
function addResponsiveDimensionsAttributes(settings, name) {
  const spacingSupport = wp.blocks.getBlockSupport ? wp.blocks.getBlockSupport(name, 'spacing') : settings?.supports?.spacing;
  if (!spacingSupport) {
    return settings;
  }
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
    }
  };
  return {
    ...settings,
    attributes
  };
}

/**
 * Responsive Dimensions: Controls
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
    const blockEdit = wp.element.createElement(BlockEdit, props);
    if (!isSelected) {
      return blockEdit;
    }
    const DeviceToggle = () => {
      const [current, setCurrent] = wp.element.useState('desktop');
      deviceState.value = current;
      return wp.element.createElement(wp.components.ButtonGroup, {}, wp.element.createElement(wp.components.Button, {
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
      }, '📱'));
    };
    const deviceState = {
      value: 'desktop'
    };
    const currentDevice = () => deviceState.value;
    const getVal = type => {
      const d = currentDevice();
      if (type === 'padding') return d === 'desktop' ? attributes.jankxPaddingDesktop : d === 'tablet' ? attributes.jankxPaddingTablet : attributes.jankxPaddingMobile;
      if (type === 'margin') return d === 'desktop' ? attributes.jankxMarginDesktop : d === 'tablet' ? attributes.jankxMarginTablet : attributes.jankxMarginMobile;
      return d === 'desktop' ? attributes.jankxGapDesktop : d === 'tablet' ? attributes.jankxGapTablet : attributes.jankxGapMobile;
    };
    const setVal = (type, value) => {
      const d = currentDevice();
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
    const spacingPanel = wp.element.createElement(wp.blockEditor.InspectorControls, {
      group: 'spacing'
    }, wp.element.createElement(wp.components.PanelBody, {
      title: 'Jankx Responsive Dimensions',
      initialOpen: false
    }, wp.element.createElement(DeviceToggle, {}), wp.element.createElement(wp.components.RangeControl, {
      label: `Padding (${currentDevice()})`,
      value: getVal('padding'),
      min: 0,
      max: 128,
      allowReset: true,
      onChange: v => setVal('padding', typeof v === 'number' ? v : undefined),
      help: 'Khoảng cách bên trong khối; áp dụng cho tất cả các cạnh'
    }), wp.element.createElement(wp.components.RangeControl, {
      label: `Margin (${currentDevice()})`,
      value: getVal('margin'),
      min: 0,
      max: 128,
      allowReset: true,
      onChange: v => setVal('margin', typeof v === 'number' ? v : undefined),
      help: 'Khoảng cách bên ngoài khối; áp dụng cho tất cả các cạnh'
    }), wp.element.createElement(wp.components.RangeControl, {
      label: `Gap (${currentDevice()})`,
      value: getVal('gap'),
      min: 0,
      max: 64,
      allowReset: true,
      onChange: v => setVal('gap', typeof v === 'number' ? v : undefined),
      help: 'Khoảng cách giữa các phần tử con (block gap)'
    })));
    return [blockEdit, spacingPanel];
  };
}

/**
 * Responsive Dimensions: Save props
 */
function addResponsiveDimensionsToSave(props, _blockType, attributes) {
  const hasPadding = [attributes.jankxPaddingDesktop, attributes.jankxPaddingTablet, attributes.jankxPaddingMobile].some(v => typeof v === 'number');
  const hasMargin = [attributes.jankxMarginDesktop, attributes.jankxMarginTablet, attributes.jankxMarginMobile].some(v => typeof v === 'number');
  const hasGap = [attributes.jankxGapDesktop, attributes.jankxGapTablet, attributes.jankxGapMobile].some(v => typeof v === 'number');
  if (hasPadding || hasMargin || hasGap) {
    const className = (props.className || '') + (/\bhas-jankx-responsive-dimensions\b/.test(props.className || '') ? '' : (props.className ? ' ' : '') + 'has-jankx-responsive-dimensions') + (hasPadding && !/\bhas-jankx-padding\b/.test(props.className || '') ? ' has-jankx-padding' : '') + (hasMargin && !/\bhas-jankx-margin\b/.test(props.className || '') ? ' has-jankx-margin' : '') + (hasGap && !/\bhas-jankx-gap\b/.test(props.className || '') ? ' has-jankx-gap' : '');
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
        @media (max-width: 1024px) {
            .has-jankx-responsive-dimensions.has-jankx-padding { padding: var(--jankx-padding-tablet, var(--jankx-padding-desktop, initial)); }
            .has-jankx-responsive-dimensions.has-jankx-margin { margin: var(--jankx-margin-tablet, var(--jankx-margin-desktop, initial)); }
            .has-jankx-responsive-dimensions.has-jankx-gap {
                gap: var(--jankx-gap-tablet, var(--jankx-gap-desktop, var(--wp--style--block-gap, initial)));
                --wp--style--block-gap: var(--jankx-gap-tablet, var(--jankx-gap-desktop, var(--wp--style--block-gap, initial)));
            }
        }
        @media (max-width: 768px) {
            .has-jankx-responsive-dimensions.has-jankx-padding { padding: var(--jankx-padding-mobile, var(--jankx-padding-tablet, var(--jankx-padding-desktop, initial))); }
            .has-jankx-responsive-dimensions.has-jankx-margin { margin: var(--jankx-margin-mobile, var(--jankx-margin-tablet, var(--jankx-margin-desktop, initial))); }
            .has-jankx-responsive-dimensions.has-jankx-gap {
                gap: var(--jankx-gap-mobile, var(--jankx-gap-tablet, var(--jankx-gap-desktop, var(--wp--style--block-gap, initial))));
                --wp--style--block-gap: var(--jankx-gap-mobile, var(--jankx-gap-tablet, var(--jankx-gap-desktop, var(--wp--style--block-gap, initial))));
            }
        }
    `;
  document.head.appendChild(style);
}

/******/ })()
;
//# sourceMappingURL=editor.js.map