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
var blocks_1 = require("@wordpress/blocks");
var block_editor_1 = require("@wordpress/block-editor");
var edit_1 = require("./edit");
var save_1 = require("./save");
var block_json_1 = require("./block.json");
require("./style.scss");
require("./editor.scss");
(0, blocks_1.registerBlockType)(block_json_1.default.name, __assign(__assign({}, block_json_1.default), { edit: edit_1.default, save: save_1.default, deprecated: [
        // v2 → v3: Added full InnerBlocks support with separated overlay layer
        {
            attributes: block_json_1.default.attributes,
            save: function (_a) {
                var attributes = _a.attributes;
                var imageUrl = attributes.imageUrl, imageAlt = attributes.imageAlt, linkUrl = attributes.linkUrl, linkTarget = attributes.linkTarget, bannerStyle = attributes.bannerStyle, overlayOpacity = attributes.overlayOpacity, overlayColor = attributes.overlayColor, textAlign = attributes.textAlign, textPosition = attributes.textPosition, _b = attributes.imageSize, imageSize = _b === void 0 ? 'cover' : _b;
                var blockProps = block_editor_1.useBlockProps.save({
                    className: "embla__slide embla-banner embla-banner--".concat(bannerStyle, " text-").concat(textAlign, " text-position-").concat(textPosition, " image-size-").concat(imageSize),
                    'data-image-size': imageSize
                });
                var imageStyles = __assign({ backgroundImage: imageUrl ? "url(".concat(imageUrl, ")") : undefined }, (imageSize === 'fullwidth'
                    ? { backgroundSize: '100% 100%', backgroundPosition: 'center' }
                    : imageSize === 'contain'
                        ? { backgroundSize: 'contain' }
                        : { backgroundSize: 'cover' }));
                // v2 save: had overlay-content wrapper but no separate overlay div
                var slideContent = (<>
            {imageUrl && (<div className={"embla-banner__image image-size-".concat(imageSize)} style={imageStyles} role="img" aria-label={imageAlt || undefined}/>)}
            <div className="embla-banner__overlay-content">
              <block_editor_1.InnerBlocks.Content />
            </div>
          </>);
                if (linkUrl) {
                    return (<div {...blockProps}>
              <a href={linkUrl} target={linkTarget} rel={linkTarget === '_blank' ? 'noopener noreferrer' : undefined} className="embla-banner__link">
                {slideContent}
              </a>
            </div>);
                }
                return <div {...blockProps}>{slideContent}</div>;
            },
            migrate: function (attributes, innerBlocks) {
                return [attributes, innerBlocks];
            }
        },
        // v1: Old format — image only, caption as text attribute, no innerBlocks
        {
            attributes: block_json_1.default.attributes,
            save: function (_a) {
                var attributes = _a.attributes;
                var imageUrl = attributes.imageUrl, imageAlt = attributes.imageAlt, imageCaption = attributes.imageCaption, linkUrl = attributes.linkUrl, linkTarget = attributes.linkTarget, bannerStyle = attributes.bannerStyle, overlayOpacity = attributes.overlayOpacity, overlayColor = attributes.overlayColor, textAlign = attributes.textAlign, textPosition = attributes.textPosition, showCaption = attributes.showCaption, _b = attributes.imageSize, imageSize = _b === void 0 ? 'cover' : _b;
                var blockProps = block_editor_1.useBlockProps.save({
                    className: "embla__slide embla-banner embla-banner--".concat(bannerStyle, " text-").concat(textAlign, " text-position-").concat(textPosition, " image-size-").concat(imageSize)
                });
                var imageStyles = {
                    backgroundImage: "url(".concat(imageUrl, ")"),
                    '--overlay-color': overlayColor,
                    '--overlay-opacity': overlayOpacity
                };
                if (imageSize === 'fullwidth') {
                    imageStyles.backgroundSize = '100% 100%';
                    imageStyles.backgroundPosition = 'center';
                }
                else if (imageSize === 'contain') {
                    imageStyles.backgroundSize = 'contain';
                }
                else {
                    imageStyles.backgroundSize = 'cover';
                }
                var content = (<div className={"embla-banner__image image-size-".concat(imageSize)} style={imageStyles}>
            {showCaption && imageCaption && (<div className="embla-banner__caption">
                <div className="embla-banner__caption-content">
                  {imageCaption}
                </div>
              </div>)}
          </div>);
                if (linkUrl) {
                    return (<div {...blockProps}>
              <a href={linkUrl} target={linkTarget} rel={linkTarget === '_blank' ? 'noopener noreferrer' : undefined} className="embla-banner__link">
                {content}
              </a>
            </div>);
                }
                return <div {...blockProps}>{content}</div>;
            },
            migrate: function (attributes) {
                return [attributes, []];
            }
        },
        // v0: Oldest format — with .carousel-banner__content wrapper
        {
            attributes: block_json_1.default.attributes,
            save: function (_a) {
                var attributes = _a.attributes;
                var imageUrl = attributes.imageUrl, imageCaption = attributes.imageCaption, linkUrl = attributes.linkUrl, linkTarget = attributes.linkTarget, bannerStyle = attributes.bannerStyle, overlayOpacity = attributes.overlayOpacity, overlayColor = attributes.overlayColor, textAlign = attributes.textAlign, textPosition = attributes.textPosition, showCaption = attributes.showCaption, _b = attributes.imageSize, imageSize = _b === void 0 ? 'cover' : _b;
                var blockProps = block_editor_1.useBlockProps.save({
                    className: "embla__slide embla-banner embla-banner--".concat(bannerStyle, " text-").concat(textAlign, " text-position-").concat(textPosition, " image-size-").concat(imageSize)
                });
                var imageStyles = {
                    backgroundImage: "url(".concat(imageUrl, ")"),
                    '--overlay-color': overlayColor,
                    '--overlay-opacity': overlayOpacity
                };
                if (imageSize === 'fullwidth') {
                    imageStyles.backgroundSize = '100% 100%';
                    imageStyles.backgroundPosition = 'center';
                }
                else if (imageSize === 'contain') {
                    imageStyles.backgroundSize = 'contain';
                }
                else {
                    imageStyles.backgroundSize = 'cover';
                }
                var imageContent = (<div className={"embla-banner__image image-size-".concat(imageSize)} style={imageStyles}>
            <div className="embla-banner__overlay"></div>
            {showCaption && imageCaption && (<div className="embla-banner__caption">
                <div className="embla-banner__caption-content">
                  {imageCaption}
                </div>
              </div>)}
          </div>);
                var content = (<div className="embla-banner__content">
            {imageContent}
          </div>);
                if (linkUrl) {
                    return (<div {...blockProps}>
              <a href={linkUrl} target={linkTarget} rel={linkTarget === '_blank' ? 'noopener noreferrer' : undefined} className="embla-banner__link">
                {content}
              </a>
            </div>);
                }
                return <div {...blockProps}>{content}</div>;
            },
            migrate: function (attributes) {
                return [attributes, []];
            }
        }
    ] }));
