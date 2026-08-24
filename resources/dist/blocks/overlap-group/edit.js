import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useBlockProps, InnerBlocks, InspectorControls } from '@wordpress/block-editor';
import { __experimentalUnitControl as UnitControl, BaseControl, Button, PanelBody, RangeControl, SelectControl, TextControl, ToggleControl, } from '@wordpress/components';
import { useDispatch } from '@wordpress/data';
import { useRef, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { arrowDown, arrowLeft, arrowRight, arrowUp, dragHandle, Icon } from '@wordpress/icons';
import { applyMove, buildClassName, buildInlineStyle, MAX_PULL_UP, NUDGE_STEPS, OFFSET_SIDES, OFFSET_UNITS, } from './attributes';
const SIDE_LABELS = {
    top: __('Top', 'jankx'),
    right: __('Right', 'jankx'),
    bottom: __('Bottom', 'jankx'),
    left: __('Left', 'jankx'),
};
function OffsetControl({ side, attributes, setAttributes, }) {
    const value = attributes[side];
    const unit = attributes.offsetUnit || 'px';
    const onChange = (next) => {
        if (next === undefined || next === '') {
            setAttributes({ [side]: undefined });
            return;
        }
        const match = String(next).match(/^([+-]?\d+(?:\.\d+)?)([a-z%]*)$/i);
        if (match) {
            const num = parseFloat(match[1]);
            const nextUnit = match[2] || 'px';
            setAttributes({
                [side]: num,
                offsetUnit: OFFSET_UNITS.includes(nextUnit) ? nextUnit : unit,
            });
            return;
        }
        setAttributes({ [side]: parseFloat(next) || undefined });
    };
    return (_jsx(UnitControl, { label: SIDE_LABELS[side], value: value !== undefined ? `${value}${unit}` : '', onChange: onChange, units: OFFSET_UNITS.map((u) => ({ value: u, label: u })), allowReset: true, __next40pxDefaultSize: true, min: -1000, max: 1000 }));
}
function NudgePad({ attributes, setAttributes, }) {
    const step = attributes.dragStep ?? 10;
    const handleMove = (dx, dy) => {
        setAttributes(applyMove(attributes, dx, dy));
    };
    return (_jsxs(BaseControl, { label: __('Move', 'jankx'), children: [_jsxs("div", { className: "jankx-overlap-group__nudge-grid", children: [_jsx("span", {}), _jsx(Button, { icon: arrowUp, label: __('Move up', 'jankx'), onClick: () => handleMove(0, -step) }), _jsx("span", {}), _jsx(Button, { icon: arrowLeft, label: __('Move left', 'jankx'), onClick: () => handleMove(-step, 0) }), _jsx("span", {}), _jsx(Button, { icon: arrowRight, label: __('Move right', 'jankx'), onClick: () => handleMove(step, 0) }), _jsx("span", {}), _jsx(Button, { icon: arrowDown, label: __('Move down', 'jankx'), onClick: () => handleMove(0, step) }), _jsx("span", {})] }), _jsx(SelectControl, { label: __('Nudge step', 'jankx'), value: String(step), options: NUDGE_STEPS.map((n) => ({ value: String(n), label: `${n}px` })), onChange: (next) => setAttributes({ dragStep: parseInt(next, 10) }), __nextHasNoMarginBottom: true })] }));
}
export default function Edit({ attributes, setAttributes, clientId }) {
    const { positionType = 'relative', tagName = 'div' } = attributes;
    const { selectBlock } = useDispatch('core/block-editor');
    const dragStart = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const blockProps = useBlockProps({
        className: buildClassName(attributes),
        style: buildInlineStyle(attributes),
    });
    const onDragStart = (event) => {
        if (event.button !== 0) {
            return;
        }
        event.preventDefault();
        selectBlock(clientId);
        dragStart.current = { x: event.clientX, y: event.clientY, attrs: { ...attributes } };
        event.currentTarget.setPointerCapture(event.pointerId);
        setIsDragging(true);
    };
    const onDragMove = (event) => {
        if (!dragStart.current) {
            return;
        }
        const dx = event.clientX - dragStart.current.x;
        const dy = event.clientY - dragStart.current.y;
        setAttributes(applyMove(dragStart.current.attrs, dx, dy));
    };
    const onDragEnd = (event) => {
        if (!dragStart.current) {
            return;
        }
        dragStart.current = null;
        setIsDragging(false);
        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
        }
    };
    return (_jsxs(_Fragment, { children: [_jsxs("div", { ...blockProps, children: [positionType !== 'static' && (_jsx("div", { className: 'jankx-overlap-group__drag-handle' + (isDragging ? ' is-dragging' : ''), role: "button", tabIndex: -1, "aria-label": __('Drag to position the overlap group', 'jankx'), onPointerDown: onDragStart, onPointerMove: onDragMove, onPointerUp: onDragEnd, onPointerCancel: onDragEnd, children: _jsx(Icon, { icon: dragHandle, size: 18 }) })), _jsx(InnerBlocks, {})] }), _jsxs(InspectorControls, { children: [_jsxs(PanelBody, { title: __('Overlap Settings', 'jankx'), initialOpen: true, children: [_jsx("p", { className: "components-base-control__help", children: __('Kéo thanh di chuyển trên block hoặc dùng các nút bên dưới để đẩy block đè lên các section khác.', 'jankx') }), _jsx(SelectControl, { label: __('Position type', 'jankx'), value: positionType, options: [
                                    { label: __('Static (in flow)', 'jankx'), value: 'static' },
                                    { label: __('Relative', 'jankx'), value: 'relative' },
                                    { label: __('Absolute (overlap)', 'jankx'), value: 'absolute' },
                                ], onChange: (next) => setAttributes({ positionType: next }), help: positionType === 'absolute'
                                    ? __('Positioned relative to the nearest positioned ancestor. The parent section needs a position (e.g. relative) for the offsets to apply to it.', 'jankx')
                                    : positionType === 'relative'
                                        ? __('Relative keeps the group in the document flow but lets you shift it. Use a negative pull-up or offsets to overlap the section above.', 'jankx')
                                        : undefined }), positionType !== 'static' && (_jsxs(_Fragment, { children: [_jsx(NudgePad, { attributes: attributes, setAttributes: setAttributes }), _jsx("hr", { className: "components-divider", style: { border: 0, borderTop: '1px solid #ccc', margin: '8px 0' } }), _jsx("p", { className: "components-base-control__help", children: __('Offsets', 'jankx') }), OFFSET_SIDES.map((side) => (_jsx(OffsetControl, { side: side, attributes: attributes, setAttributes: setAttributes }, side))), _jsx(RangeControl, { label: __('Z-index', 'jankx'), value: attributes.zIndex ?? 0, onChange: (zIndex) => setAttributes({ zIndex }), min: 0, max: 1000 })] })), _jsx("hr", { className: "components-divider", style: { border: 0, borderTop: '1px solid #ccc', margin: '8px 0' } }), _jsx(RangeControl, { label: __('Pull up to overlap section above', 'jankx'), value: attributes.pullUp ?? 0, onChange: (pullUp) => setAttributes({ pullUp }), min: 0, max: MAX_PULL_UP, help: __('Applies a negative top margin (px) so this group climbs over the section above it.', 'jankx') })] }), _jsxs(PanelBody, { title: __('Size', 'jankx'), initialOpen: false, children: [_jsx(TextControl, { label: __('Width', 'jankx'), value: attributes.width || '', placeholder: __('e.g. 400px, 60%, 80rem', 'jankx'), onChange: (width) => setAttributes({ width: width || undefined }) }), _jsx(TextControl, { label: __('Max width', 'jankx'), value: attributes.maxWidth || '', placeholder: __('e.g. 1200px, 80rem, 100%', 'jankx'), onChange: (maxWidth) => setAttributes({ maxWidth: maxWidth || undefined }) })] }), _jsxs(PanelBody, { title: __('Container', 'jankx'), initialOpen: false, children: [_jsx(SelectControl, { label: __('HTML tag', 'jankx'), value: tagName, options: [
                                    { label: 'div', value: 'div' },
                                    { label: 'section', value: 'section' },
                                    { label: 'article', value: 'article' },
                                    { label: 'aside', value: 'aside' },
                                    { label: 'main', value: 'main' },
                                ], onChange: (tagName) => setAttributes({ tagName }) }), _jsx(ToggleControl, { label: __('Lock inner blocks', 'jankx'), checked: attributes.templateLock === 'all', onChange: (locked) => setAttributes({ templateLock: locked ? 'all' : false }) })] })] })] }));
}
