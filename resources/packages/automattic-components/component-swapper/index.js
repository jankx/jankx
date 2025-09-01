import { jsxs as _jsxs } from "react/jsx-runtime";
import { useBreakpoint } from '@automattic/viewport-react';
import { useEffect } from 'react';
const ComponentSwapper = ({ className, breakpoint = '<660px', // breakpoints from mediaQueryLists from '@automattic/viewport'
breakpointActiveComponent, breakpointInactiveComponent, onSwap, children, }) => {
    const isActive = useBreakpoint(breakpoint);
    useEffect(() => {
        onSwap?.();
    }, [isActive, onSwap]);
    return (_jsxs("div", { className: className, children: [isActive ? breakpointActiveComponent : breakpointInactiveComponent, children] }));
};
export default ComponentSwapper;
//# sourceMappingURL=index.js.map