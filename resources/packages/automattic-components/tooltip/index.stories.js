import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef } from 'react';
import { Button } from '../button';
import Tooltip from './';
const TooltipWrapper = ({ placement }) => {
    const [show, setShow] = useState(false);
    const handleOpen = () => setShow(true);
    const handleClose = () => setShow(false);
    const tooltipRef = useRef();
    const placements = {
        top: 'top',
        tl: 'top left',
        tr: 'top right',
        left: 'left',
        right: 'right',
        bottom: 'bottom',
        bl: 'bottom left',
        br: 'bottom right',
    };
    const buttonWidth = 80;
    return (_jsxs(_Fragment, { children: [_jsx(Button, { onMouseEnter: handleOpen, onMouseLeave: handleClose, onClick: handleClose, ref: tooltipRef, style: { width: buttonWidth, margin: 4, borderRadius: '6px' }, children: placement }), _jsx(Tooltip, { position: placements[placement.toLowerCase()], isVisible: show, onClose: handleClose, context: tooltipRef.current, children: _jsx("div", { children: "Prompt" }) })] }));
};
export const Default = () => {
    const buttonWidth = 80;
    return (_jsx("div", { style: { padding: '80px' }, children: _jsxs("div", { className: "demo", children: [_jsxs("div", { style: { marginInlineStart: buttonWidth + 4, whiteSpace: 'nowrap' }, children: [_jsx(TooltipWrapper, { placement: "TL" }), _jsx(TooltipWrapper, { placement: "Top" }), _jsx(TooltipWrapper, { placement: "TR" })] }), _jsx("div", { style: { width: buttonWidth, float: 'inline-start' }, children: _jsx(TooltipWrapper, { placement: "Left" }) }), _jsx("div", { style: { width: buttonWidth, marginInlineStart: buttonWidth * 4 + 24 }, children: _jsx(TooltipWrapper, { placement: "Right" }) }), _jsxs("div", { style: { marginInlineStart: buttonWidth, clear: 'both', whiteSpace: 'nowrap' }, children: [_jsx(TooltipWrapper, { placement: "BL" }), _jsx(TooltipWrapper, { placement: "Bottom" }), _jsx(TooltipWrapper, { placement: "BR" })] })] }) }));
};
export default {
    title: 'Unaudited/Tooltip',
    component: Tooltip,
};
//# sourceMappingURL=index.stories.js.map