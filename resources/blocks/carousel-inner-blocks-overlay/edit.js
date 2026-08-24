"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Edit;
var block_editor_1 = require("@wordpress/block-editor");
function Edit() {
    var blockProps = (0, block_editor_1.useBlockProps)({
        className: 'carousel-inner-blocks-overlay',
    });
    return (<div {...blockProps}>
      <block_editor_1.InnerBlocks />
    </div>);
}
