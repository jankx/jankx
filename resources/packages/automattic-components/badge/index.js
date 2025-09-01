import { jsx as _jsx } from "react/jsx-runtime";
import clsx from 'clsx';
import { memo, forwardRef } from 'react';
import './style.scss';
const Badge = memo(forwardRef(({ className, children, type = 'warning', ...props }, ref) => {
    return (_jsx("div", { ref: ref, className: clsx(`badge badge--${type}`, className), ...props, children: children }));
}));
export default Badge;
//# sourceMappingURL=index.js.map