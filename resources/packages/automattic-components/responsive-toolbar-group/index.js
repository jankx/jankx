import { jsx as _jsx } from "react/jsx-runtime";
import { useBreakpoint } from '@automattic/viewport-react';
import clsx from 'clsx';
import DropdownGroup from './dropdown-group';
import SwipeGroup from './swipe-group';
import './style.scss';
const ResponsiveToolbarGroup = ({ children, className = '', hideRatio = 0.99, showRatio = 1, rootMargin = '0px', onClick = () => null, initialActiveIndex = -1, initialActiveIndexes, swipeBreakpoint = '<660px', hrefList = [], forceSwipe = false, swipeEnabled = true, isMultiSelection = false, }) => {
    const classes = clsx('responsive-toolbar-group', className);
    const isWithinBreakpoint = useBreakpoint(swipeBreakpoint);
    if (forceSwipe || (swipeEnabled && isWithinBreakpoint)) {
        return (_jsx(SwipeGroup, { className: classes, initialActiveIndex: initialActiveIndex, initialActiveIndexes: initialActiveIndexes, onClick: onClick, hrefList: hrefList, isMultiSelection: isMultiSelection, children: children }));
    }
    return (_jsx(DropdownGroup, { className: classes, initialActiveIndex: initialActiveIndex, initialActiveIndexes: initialActiveIndexes, onClick: onClick, hideRatio: hideRatio, showRatio: showRatio, rootMargin: rootMargin, isMultiSelection: isMultiSelection, children: children }));
};
export default ResponsiveToolbarGroup;
//# sourceMappingURL=index.js.map