"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Edit;
var i18n_1 = require("@wordpress/i18n");
var block_editor_1 = require("@wordpress/block-editor");
var components_1 = require("@wordpress/components");
var BANNER_TEMPLATE = [
    ['core/heading', { level: 2, placeholder: (0, i18n_1.__)('Tiêu đề slide...', 'jankx'), textAlign: 'center' }],
    ['core/paragraph', { placeholder: (0, i18n_1.__)('Mô tả ngắn cho slide này...', 'jankx'), align: 'center' }],
];
function Edit(_a) {
    var attributes = _a.attributes, setAttributes = _a.setAttributes;
    var imageId = attributes.imageId, imageUrl = attributes.imageUrl, imageAlt = attributes.imageAlt, imageCaption = attributes.imageCaption, linkUrl = attributes.linkUrl, linkTarget = attributes.linkTarget, bannerStyle = attributes.bannerStyle, overlayOpacity = attributes.overlayOpacity, overlayColor = attributes.overlayColor, textAlign = attributes.textAlign, textPosition = attributes.textPosition, showCaption = attributes.showCaption, _b = attributes.height, height = _b === void 0 ? 0 : _b, _c = attributes.imageSize, imageSize = _c === void 0 ? 'cover' : _c;
    var blockProps = (0, block_editor_1.useBlockProps)({
        className: "embla__slide embla-banner embla-banner--".concat(bannerStyle, " text-").concat(textAlign, " text-position-").concat(textPosition, " image-size-").concat(imageSize)
    });
    var innerBlocksProps = (0, block_editor_1.useInnerBlocksProps)({ className: 'embla-banner__overlay-content' }, {
        template: BANNER_TEMPLATE,
        templateLock: false,
        renderAppender: block_editor_1.InnerBlocks.ButtonBlockAppender,
    });
    var onSelectImage = function (media) {
        setAttributes({
            imageId: media.id,
            imageUrl: media.url,
            imageAlt: media.alt || '',
            imageCaption: media.caption || ''
        });
    };
    var removeImage = function () {
        setAttributes({
            imageId: 0,
            imageUrl: '',
            imageAlt: '',
            imageCaption: ''
        });
    };
    var imageStyles = imageUrl ? __assign({ backgroundImage: "url(".concat(imageUrl, ")"), '--overlay-color': overlayColor, '--overlay-opacity': overlayOpacity }, (imageSize === 'fullwidth'
        ? { backgroundSize: '100% 100%', backgroundPosition: 'center' }
        : imageSize === 'contain'
            ? { backgroundSize: 'contain' }
            : { backgroundSize: 'cover' })) : {};
    return (<div {...blockProps}>
      <block_editor_1.InspectorControls>
        <components_1.PanelBody title={(0, i18n_1.__)('Image Settings', 'jankx')} initialOpen={true}>
          <block_editor_1.MediaUploadCheck>
            <block_editor_1.MediaUpload onSelect={onSelectImage} allowedTypes={['image']} value={imageId} render={function (_a) {
            var open = _a.open;
            return (<components_1.Button variant="secondary" onClick={open} style={{ width: '100%', marginBottom: '10px' }}>
                  {imageUrl ? (0, i18n_1.__)('Change Image', 'jankx') : (0, i18n_1.__)('Select Image', 'jankx')}
                </components_1.Button>);
        }}/>
          </block_editor_1.MediaUploadCheck>

          {imageUrl && (<components_1.Button variant="link" isDestructive onClick={removeImage} style={{ width: '100%' }}>
              {(0, i18n_1.__)('Remove Image', 'jankx')}
            </components_1.Button>)}

          {imageUrl && (<>
              <components_1.SelectControl label={(0, i18n_1.__)('Image Size', 'jankx')} value={imageSize} options={[
                { label: (0, i18n_1.__)('Cover', 'jankx'), value: 'cover' },
                { label: (0, i18n_1.__)('Contain', 'jankx'), value: 'contain' },
                { label: (0, i18n_1.__)('Fullwidth', 'jankx'), value: 'fullwidth' }
            ]} onChange={function (val) { return setAttributes({ imageSize: val }); }} help={(0, i18n_1.__)('Cover: Fill entire area, Contain: Fit entire image, Fullwidth: Stretch to 100% width and height', 'jankx')}/>

              <components_1.TextControl label={(0, i18n_1.__)('Alt Text', 'jankx')} value={imageAlt} onChange={function (val) { return setAttributes({ imageAlt: val }); }} help={(0, i18n_1.__)('Describe the image for accessibility', 'jankx')}/>
            </>)}
        </components_1.PanelBody>

        <components_1.PanelBody title={(0, i18n_1.__)('Link Settings', 'jankx')} initialOpen={false}>
          <components_1.TextControl label={(0, i18n_1.__)('Link URL', 'jankx')} value={linkUrl} onChange={function (val) { return setAttributes({ linkUrl: val }); }} placeholder={(0, i18n_1.__)('https://example.com', 'jankx')} help={(0, i18n_1.__)('Optional link for the banner', 'jankx')}/>

          <components_1.SelectControl label={(0, i18n_1.__)('Link Target', 'jankx')} value={linkTarget} options={[
            { label: (0, i18n_1.__)('Same Window', 'jankx'), value: '_self' },
            { label: (0, i18n_1.__)('New Window', 'jankx'), value: '_blank' }
        ]} onChange={function (val) { return setAttributes({ linkTarget: val }); }}/>
        </components_1.PanelBody>

        <components_1.PanelBody title={(0, i18n_1.__)('Style Settings', 'jankx')} initialOpen={false}>
          <components_1.SelectControl label={(0, i18n_1.__)('Banner Style', 'jankx')} value={bannerStyle} options={[
            { label: (0, i18n_1.__)('Banner', 'jankx'), value: 'banner' },
            { label: (0, i18n_1.__)('Circles', 'jankx'), value: 'circles' },
            { label: (0, i18n_1.__)('Square', 'jankx'), value: 'square' }
        ]} onChange={function (val) { return setAttributes({ bannerStyle: val }); }}/>

          {bannerStyle === 'circles' && (<components_1.RangeControl label={(0, i18n_1.__)('Height (px)', 'jankx')} value={height || 0} onChange={function (val) { return setAttributes({ height: val || 0 }); }} min={50} max={1000} step={10} help={(0, i18n_1.__)('Set height for circle banner. Width will automatically match height.', 'jankx')}/>)}

          <components_1.SelectControl label={(0, i18n_1.__)('Content Alignment', 'jankx')} value={textAlign} options={[
            { label: (0, i18n_1.__)('Left', 'jankx'), value: 'left' },
            { label: (0, i18n_1.__)('Center', 'jankx'), value: 'center' },
            { label: (0, i18n_1.__)('Right', 'jankx'), value: 'right' }
        ]} onChange={function (val) { return setAttributes({ textAlign: val }); }}/>

          <components_1.SelectControl label={(0, i18n_1.__)('Content Position', 'jankx')} value={textPosition} options={[
            { label: (0, i18n_1.__)('Top', 'jankx'), value: 'top' },
            { label: (0, i18n_1.__)('Middle', 'jankx'), value: 'middle' },
            { label: (0, i18n_1.__)('Bottom', 'jankx'), value: 'bottom' }
        ]} onChange={function (val) { return setAttributes({ textPosition: val }); }}/>

          <components_1.RangeControl label={(0, i18n_1.__)('Overlay Opacity', 'jankx')} value={overlayOpacity} onChange={function (val) { return setAttributes({ overlayOpacity: val }); }} min={0} max={1} step={0.1} help={(0, i18n_1.__)('Darkness of overlay over image (0 = none, 1 = fully dark)', 'jankx')}/>

          <div>
            <label>{(0, i18n_1.__)('Overlay Color', 'jankx')}</label>
            <components_1.ColorPicker color={overlayColor} onChange={function (val) { return setAttributes({ overlayColor: val }); }} disableAlpha={false}/>
          </div>
        </components_1.PanelBody>
      </block_editor_1.InspectorControls>

      {/* Background image layer */}
      {imageUrl ? (<div className={"embla-banner__image image-size-".concat(imageSize)} style={imageStyles} aria-hidden="true"/>) : (<components_1.Placeholder icon="format-image" label={(0, i18n_1.__)('Carousel Banner', 'jankx')} instructions={(0, i18n_1.__)('Select a background image using the settings panel →', 'jankx')} className="embla-banner__placeholder">
          <block_editor_1.MediaUploadCheck>
            <block_editor_1.MediaUpload onSelect={onSelectImage} allowedTypes={['image']} value={imageId} render={function (_a) {
                var open = _a.open;
                return (<components_1.Button variant="primary" onClick={open}>
                  {(0, i18n_1.__)('Select Image', 'jankx')}
                </components_1.Button>);
            }}/>
          </block_editor_1.MediaUploadCheck>
        </components_1.Placeholder>)}

      {/* Dark overlay */}
      {imageUrl && overlayOpacity > 0 && (<div className="embla-banner__overlay" style={{
                backgroundColor: overlayColor,
                opacity: overlayOpacity
            }} aria-hidden="true"/>)}

      {/* Inner blocks: heading, paragraph, search, buttons, etc. */}
      <div {...innerBlocksProps}/>
    </div>);
}
