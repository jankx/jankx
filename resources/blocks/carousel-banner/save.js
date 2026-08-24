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
exports.default = Save;
var block_editor_1 = require("@wordpress/block-editor");
function Save(_a) {
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
    var slideContent = (<>
      {/* Background image layer */}
      {imageUrl && (<div className={"embla-banner__image image-size-".concat(imageSize)} style={imageStyles} role="img" aria-label={imageAlt || undefined}/>)}

      {/* Dark color overlay */}
      {imageUrl && overlayOpacity > 0 && (<div className="embla-banner__overlay" style={{
                backgroundColor: overlayColor,
                opacity: overlayOpacity
            }} aria-hidden="true"/>)}

      {/* Inner blocks content (headings, paragraphs, search, etc.) */}
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
    return (<div {...blockProps}>
      {slideContent}
    </div>);
}
