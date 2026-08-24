"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Edit;
var i18n_1 = require("@wordpress/i18n");
var block_editor_1 = require("@wordpress/block-editor");
var components_1 = require("@wordpress/components");
function Edit(_a) {
    var attributes = _a.attributes, setAttributes = _a.setAttributes, clientId = _a.clientId;
    var _b = attributes.imageSize, imageSize = _b === void 0 ? 'cover' : _b, _c = attributes.overlayColor, overlayColor = _c === void 0 ? 'rgba(0,0,0,0.4)' : _c, _d = attributes.overlayOpacity, overlayOpacity = _d === void 0 ? 40 : _d;
    var blockProps = (0, block_editor_1.useBlockProps)({
        className: "carousel-slide embla__slide image-size-".concat(imageSize),
        'data-image-size': imageSize
    });
    var innerBlocksProps = (0, block_editor_1.useInnerBlocksProps)({
        className: 'carousel-slide__content'
    }, {
        templateLock: false
    });
    var opacity = overlayOpacity / 100;
    var overlayStyle = {
        backgroundColor: overlayColor,
        opacity: opacity,
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 1
    };
    return (<>
      <block_editor_1.InspectorControls>
        <components_1.PanelBody title={(0, i18n_1.__)('Image Settings', 'jankx')} initialOpen={false}>
          <components_1.SelectControl label={(0, i18n_1.__)('Background Image Size', 'jankx')} value={imageSize} options={[
            { label: (0, i18n_1.__)('Cover', 'jankx'), value: 'cover' },
            { label: (0, i18n_1.__)('Contain', 'jankx'), value: 'contain' },
            { label: (0, i18n_1.__)('Fullwidth', 'jankx'), value: 'fullwidth' }
        ]} onChange={function (val) { return setAttributes({ imageSize: val }); }} help={(0, i18n_1.__)('Cover: Fill entire area, Contain: Fit entire image, Fullwidth: Stretch to 100% width and height', 'jankx')}/>
        </components_1.PanelBody>
        <components_1.PanelBody title={(0, i18n_1.__)('Overlay Settings', 'jankx')} initialOpen={false}>
          <p>{(0, i18n_1.__)('Overlay Color', 'jankx')}</p>
          <block_editor_1.ColorPalette value={overlayColor} onChange={function (val) { return setAttributes({ overlayColor: val || '' }); }}/>
          <components_1.RangeControl label={(0, i18n_1.__)('Overlay Opacity', 'jankx')} value={overlayOpacity} onChange={function (val) { return setAttributes({ overlayOpacity: val !== null && val !== void 0 ? val : 40 }); }} min={0} max={100}/>
        </components_1.PanelBody>
      </block_editor_1.InspectorControls>
      <div {...blockProps}>
        <div className="carousel-slide__overlay" style={overlayStyle}></div>
        <div {...innerBlocksProps}/>
      </div>
    </>);
}
