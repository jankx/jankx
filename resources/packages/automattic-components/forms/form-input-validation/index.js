import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Icon, info, check } from '@wordpress/icons';
import clsx from 'clsx';
import { Gridicon } from '../..';
import './style.scss';
const FormInputValidation = ({ isError = false, isWarning, isHidden, isMuted, className, ariaLabel = '', text, hasIcon = true, icon, id, children, }) => {
    const classes = clsx(className, {
        'form-input-validation': true,
        'is-warning': isWarning,
        'is-error': isError,
        'is-hidden': isHidden,
        'is-muted': isMuted,
        'has-icon': hasIcon,
    });
    const defaultIcon = isError || isWarning ? info : check;
    return (
    /* eslint-disable wpcalypso/jsx-gridicon-size */
    _jsx("div", { "aria-label": ariaLabel, className: classes, role: "alert", children: _jsxs("span", { id: id, children: [hasIcon &&
                    (icon ? (_jsx(Gridicon, { size: 20, icon: icon })) : (_jsx(Icon, { size: 20, icon: defaultIcon }))), text, children] }) }));
};
export default FormInputValidation;
//# sourceMappingURL=index.js.map