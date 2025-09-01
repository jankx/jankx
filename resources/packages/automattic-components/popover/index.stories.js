import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from 'react';
import Popover from '.';
export default { title: 'Unaudited/Popover' };
const Container = (props) => {
    const [currentRef, setCurrentRef] = useState(undefined);
    const ref = useRef(undefined);
    useEffect(() => {
        setCurrentRef(ref.current);
    }, []);
    return (_jsxs(_Fragment, { children: [_jsx("div", { ref: ref, style: { display: 'inline-block', border: '1px solid gray' }, children: "Target Element" }), _jsx(Popover, { className: "theme-card__tooltip", context: currentRef, isVisible: true, showDelay: 0, ...props, children: "I am the description." })] }));
};
export const Basic = () => {
    return _jsx(Container, {});
};
//# sourceMappingURL=index.stories.js.map