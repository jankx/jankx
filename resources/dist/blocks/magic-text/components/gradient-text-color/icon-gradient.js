import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Icon } from '@wordpress/icons';
const IconGradient = () => (_jsx(Icon, { icon: _jsxs("svg", { width: "20", height: "20", viewBox: "0 0 24 24", children: [_jsx("defs", { children: _jsxs("linearGradient", { id: "grad1", x1: "0%", y1: "0%", x2: "100%", y2: "0%", children: [_jsx("stop", { offset: "0%", style: { stopColor: '#800080', stopOpacity: 1 } }), " ", _jsx("stop", { offset: "100%", style: { stopColor: '#ff69b4', stopOpacity: 1 } }), " "] }) }), _jsx("text", { x: "4", y: "17", fontSize: "16", fontFamily: "Arial", fill: "url(#grad1)", children: "A" })] }) }));
export default IconGradient;
