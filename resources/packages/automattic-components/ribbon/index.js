import { jsx as _jsx } from "react/jsx-runtime";
import clsx from 'clsx';
import './style.scss';
const Ribbon = (props) => (_jsx("div", { className: clsx({
        ribbon: true,
        'is-green': props.color === 'green',
    }), children: _jsx("span", { className: "ribbon__title", children: props.children }) }));
export default Ribbon;
//# sourceMappingURL=index.js.map