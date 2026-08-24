"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Save;
var block_editor_1 = require("@wordpress/block-editor");
function Save() {
    var blockProps = block_editor_1.useBlockProps.save({
        className: 'carousel-inner-blocks-overlay',
    });
    return (<div {...blockProps}>
      <block_editor_1.InnerBlocks.Content />
    </div>);
}
