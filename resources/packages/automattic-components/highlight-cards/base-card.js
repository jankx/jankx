import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card } from '../';
import './style.scss';
export default function BaseCard({ heading, children }) {
    return (_jsxs(Card, { className: "highlight-card", children: [heading ? _jsx("div", { className: "highlight-card-heading", children: heading }) : null, children ? _jsx("div", { className: "highlight-card-body", children: children }) : null] }));
}
//# sourceMappingURL=base-card.js.map