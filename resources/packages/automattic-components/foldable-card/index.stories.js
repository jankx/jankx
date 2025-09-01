import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/* eslint-disable no-console */
import { Button, FoldableCard } from '..';
export default { title: 'Unaudited/FoldableCard' };
export const Default = () => (_jsx(FoldableCard, { header: "This is a foldable card", screenReaderText: "More", children: "These are its contents" }));
export const Smooth = () => (_jsx(FoldableCard, { header: "This is a foldable card with smooth animation", screenReaderText: "More", smooth: true, contentExpandedStyle: { maxHeight: '112px' }, children: _jsxs("div", { style: { padding: '16px 16px 0' }, children: [_jsx("p", { children: "These are its contents" }), _jsx("p", { children: "And some more" })] }) }));
export const WithLongHeader = () => (_jsx(FoldableCard, { header: "This is a foldable card with a really long header content area that might wrap depending on the page width of the browser being used to view this page when the summary area is not hidden.", screenReaderText: "More", children: "These are the card's contents." }));
export const WithLongHeaderAndHiddenSummary = () => (_jsx(FoldableCard, { header: "This is a foldable card with a really long header content area that might wrap depending on the page width of the browser being used to view this page when the summary area is hidden.", hideSummary: true, screenReaderText: "More", children: "These are the card's contents." }));
export const Compact = () => (_jsx(FoldableCard, { header: "This is a compact card", compact: true, screenReaderText: "More", children: "I'm tiny! :D" }));
export const Disabled = () => (_jsx("div", { children: _jsx(FoldableCard, { header: "This is a disabled card", disabled: true, screenReaderText: "More", children: "You can't see me!" }) }));
export const Highlighted = () => (_jsx(FoldableCard, { header: "This is a highlighted card", highlight: "info", screenReaderText: "More", children: "I'm highlighted!" }));
export const WithCustomActionIcon = () => (_jsx(FoldableCard, { header: "This is a foldable card with a custom action icon", icon: "arrow-down", screenReaderText: "More", children: "These are its contents" }));
export const WithCustomSummary = () => (_jsx(FoldableCard, { header: "This is a compact box with summary", summary: "Unexpanded Summary", expandedSummary: "Expanded Summary", screenReaderText: "More", children: "This is the main content of the card." }));
export const WithMultilineHeader = () => (_jsx(FoldableCard, { header: _jsxs("div", { children: [_jsx("div", { children: "This is a multiline foldable card" }), _jsx("div", { children: _jsx("small", { children: " with a summary component & a expanded summary component" }) })] }), summary: _jsx(Button, { compact: true, scary: true, children: "Update" }), expandedSummary: _jsx(Button, { compact: true, scary: true, children: "Update" }), children: "Nothing to see here. Keep walking!" }));
export const WithClickOpenCloseActions = () => (_jsx(FoldableCard, { header: "This card includes click, open and close actions. Check your console!", onClick: function () {
        console.log('Clicked!');
    }, onClose: function () {
        console.log('Closed!');
    }, onOpen: function () {
        console.log('Opened!');
    }, children: "Nothing to see here. Keep walking!" }));
//# sourceMappingURL=index.stories.js.map