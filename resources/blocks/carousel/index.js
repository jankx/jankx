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
var block_json_1 = require("./block.json");
require("./style.scss");
require("./editor.scss");
(0, blocks_1.registerBlockType)(block_json_1.default.name, __assign(__assign({}, block_json_1.default), { edit: edit_1.default, save: function () { return <block_editor_1.InnerBlocks.Content />; } }));
