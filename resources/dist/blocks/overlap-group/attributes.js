export const NUDGE_STEPS = [1, 5, 10, 20, 50];
export const MAX_PULL_UP = 400;
export const OFFSET_SIDES = ['top', 'right', 'bottom', 'left'];
export const OFFSET_UNITS = ['px', '%', 'rem', 'vw', 'vh'];
export function buildInlineStyle(attributes) {
    const style = {};
    const { positionType = 'relative', offsetUnit = 'px' } = attributes;
    if (positionType !== 'static') {
        style.position = positionType;
    }
    for (const side of OFFSET_SIDES) {
        const value = attributes[side];
        if (value !== undefined && value !== null && value !== '') {
            style[side] = `${value}${offsetUnit}`;
        }
    }
    if (attributes.zIndex !== undefined && attributes.zIndex !== null && attributes.zIndex !== '') {
        style.zIndex = attributes.zIndex;
    }
    if (attributes.width) {
        style.width = attributes.width;
    }
    if (attributes.maxWidth) {
        style.maxWidth = attributes.maxWidth;
    }
    if (attributes.pullUp) {
        style.marginTop = `-${attributes.pullUp}px`;
    }
    return style;
}
export function buildClassName(attributes) {
    const classes = ['jankx-overlap-group'];
    const positionType = attributes.positionType || 'relative';
    if (positionType !== 'static') {
        classes.push(`jankx-overlap-group--${positionType}`);
    }
    return classes.join(' ');
}
/**
 * Compute the new attributes after moving the block by a delta.
 *
 * - absolute: the block is positioned freely via `top` / `left` offsets
 *   (conflicting `right` / `bottom` anchors are cleared).
 * - relative (default): dragging up increases `pullUp` (negative top margin),
 *   dragging down decreases it back to `0`, and horizontal movement shifts
 *   the block with a `left` offset.
 * - static: any movement automatically enables `relative` positioning.
 */
export function applyMove(start, dx, dy) {
    if (start.positionType === 'absolute') {
        return {
            top: (start.top ?? 0) + dy,
            left: (start.left ?? 0) + dx,
            right: undefined,
            bottom: undefined,
            offsetUnit: 'px',
        };
    }
    const next = {
        positionType: 'relative',
        offsetUnit: 'px',
    };
    if (dy !== 0) {
        next.pullUp = Math.max(0, Math.min(MAX_PULL_UP, (start.pullUp ?? 0) - dy));
    }
    if (dx !== 0) {
        next.left = (start.left ?? 0) + dx;
    }
    return next;
}
