import { jsx as _jsx } from "react/jsx-runtime";
import { FormLabel } from '../forms';
// Prevents the event from bubbling up the DOM tree
const stopPropagation = (event) => event.stopPropagation();
export default function SelectDropdownLabel({ children }) {
    return (_jsx("li", { onClick: stopPropagation, role: "presentation", className: "select-dropdown__label", children: _jsx(FormLabel, { children: children }) }));
}
//# sourceMappingURL=label.js.map