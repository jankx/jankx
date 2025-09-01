import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import './index.stories.scss';
import { iconToProductSlugMap } from './config';
import ProductIcon from '.';
const supportedSlugs = Object.values(iconToProductSlugMap).flat();
export default { title: 'Unaudited/ProductIcon' };
export const Default = () => {
    return (_jsx(_Fragment, { children: supportedSlugs.map((slug) => (_jsxs("div", { className: "product-icon-stories__icon-tile", children: [_jsx(ProductIcon, { slug: slug, className: "product-icon-stories__icon-image" }), _jsx("pre", { className: "product-icon-stories__icon-slug", children: slug })] }))) }));
};
//# sourceMappingURL=index.stories.js.map