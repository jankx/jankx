import { jsx as _jsx } from "react/jsx-runtime";
import spritePath from '@automattic/material-design-icons/svg-sprite/material-icons.svg';
import clsx from 'clsx';
import * as React from 'react';
function MaterialIcon(props) {
    const { size = 24, style = 'outline', icon, onClick, className, ...otherProps } = props;
    // Using a missing icon doesn't produce any errors, just a blank icon, which is the exact intended behaviour.
    // This means we don't need to perform any checks on the icon name.
    const iconName = `material-icon-${icon}`;
    const iconClass = clsx('material-icon', iconName, className);
    const svgId = `icon-${style}-${icon}-${size}px`;
    return (_jsx("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", className: iconClass, height: size, width: size, onClick: onClick, ...otherProps, children: _jsx("use", { xlinkHref: `${spritePath}#${svgId}` }) }));
}
export default React.memo(MaterialIcon);
//# sourceMappingURL=index.js.map