import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import clsx from 'clsx';
import { useTranslate } from 'i18n-calypso';
import { Children, forwardRef } from 'react';
import './style.scss';
const FormLabel = forwardRef(({ children, required, optional, className, ...labelProps }, ref) => {
    const translate = useTranslate();
    const hasChildren = Children.count(children) > 0;
    return (_jsxs("label", { ...labelProps, className: clsx(className, 'form-label'), ref: ref, children: [children, hasChildren && required && (_jsx("small", { className: "form-label__required", children: translate('Required') })), hasChildren && optional && (_jsx("small", { className: "form-label__optional", children: translate('Optional') }))] }));
});
export default FormLabel;
//# sourceMappingURL=index.js.map