import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import BadgeNew from './sideElements/badge-new';
const TitleExtras = ({ isNew, prefixNodes, children }) => {
    return (_jsxs(_Fragment, { children: [prefixNodes, isNew && _jsx(BadgeNew, {}), children] }));
};
export default TitleExtras;
//# sourceMappingURL=title-extras.js.map