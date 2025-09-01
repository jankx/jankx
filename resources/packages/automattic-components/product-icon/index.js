import { jsx as _jsx } from "react/jsx-runtime";
import clsx from 'clsx';
import { findKey, includes } from 'lodash';
import { iconToProductSlugMap, paths } from './config';
import './style.scss';
const ProductIcon = ({ className, slug }) => {
    if (!slug) {
        return null;
    }
    const iconSlug = findKey(iconToProductSlugMap, (products) => includes(products, slug));
    const iconPath = paths[iconSlug];
    if (!iconPath) {
        return null;
    }
    return (_jsx("img", { src: iconPath, className: clsx('product-icon', `is-${iconSlug}`, className), role: "presentation", alt: "" }));
};
export default ProductIcon;
//# sourceMappingURL=index.js.map