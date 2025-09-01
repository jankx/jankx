import { jsx as _jsx } from "react/jsx-runtime";
import clsx from 'clsx';
import { isValidElement, cloneElement } from 'react';
import { Button } from '../button';
const ButtonBar = ({ buttons, baseClassName, onButtonClick }) => {
    if (!buttons) {
        return null;
    }
    return (_jsx("div", { className: baseClassName + '__action-buttons', children: buttons.map((button, index) => {
            const key = index;
            if (isElement(button)) {
                return cloneElement(button, { key });
            }
            const classes = clsx(button.className, button.additionalClassNames, {
                'is-primary': button.isPrimary || (buttons.length === 1 && !button.scary),
            });
            return (_jsx(Button, { className: classes, "data-e2e-button": button.action, "data-tip-target": `dialog-base-action-${button.action}`, onClick: () => onButtonClick(button), disabled: !!button.disabled, busy: !!button.busy, href: button.href, target: button.target, scary: button.scary, children: _jsx("span", { className: baseClassName + '__button-label', children: button.label }) }, key));
        }) }));
};
// Note: a bug in TypeScript doesn't narrow ReactElement properly, but the wrapper
// helps it work. See https://github.com/microsoft/TypeScript/issues/53178#issuecomment-1659301034
function isElement(element) {
    return isValidElement(element);
}
export default ButtonBar;
//# sourceMappingURL=button-bar.js.map