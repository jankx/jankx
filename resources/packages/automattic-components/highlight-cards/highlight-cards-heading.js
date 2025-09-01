import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useTranslate } from 'i18n-calypso';
export default function HighlightCardsHeading({ children }) {
    const translate = useTranslate();
    return (_jsxs("div", { className: "highlight-cards-heading__wrapper", children: [_jsx("h3", { className: "highlight-cards-heading", children: children }), _jsx("div", { className: "highlight-cards-heading__update-frequency", children: _jsx("span", { children: translate('Updates every 30 minutes') }) })] }));
}
//# sourceMappingURL=highlight-cards-heading.js.map