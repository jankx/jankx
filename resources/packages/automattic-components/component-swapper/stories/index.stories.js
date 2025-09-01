import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import ComponentSwapper from '../.';
import { Button } from '../../.';
export default { title: 'Unaudited/Component swapper' };
const ComponentSwapperVariations = () => {
    return (_jsxs("div", { children: [_jsx("h1", { children: "660px example" }), _jsx(ComponentSwapper
            // eslint-disable-next-line no-console
            , { 
                // eslint-disable-next-line no-console
                onSwap: () => console.log('swapping'), breakpoint: "<660px", breakpointActiveComponent: _jsx(Button, { primary: true, children: "Active breakpoint - primary button" }), breakpointInactiveComponent: _jsx(Button, { children: "Inactive breakpoint - regular button" }), children: _jsx("div", { style: { padding: '10px 0' }, children: " Example child node " }) })] }));
};
export const Default = () => _jsx(ComponentSwapperVariations, {});
//# sourceMappingURL=index.stories.js.map