import { jsx as _jsx } from "react/jsx-runtime";
import clsx from 'clsx';
import { PureComponent } from 'react';
import './style.scss';
export class Spinner extends PureComponent {
    static defaultProps = {
        size: 20,
        baseClassName: 'spinner',
    };
    render() {
        const className = clsx(this.props.baseClassName, this.props.className);
        const style = {
            width: this.props.size,
            height: this.props.size,
            fontSize: this.props.size, // allows border-width to be specified in em units
        };
        return (_jsx("div", { className: className, children: _jsx("div", { className: "spinner__outer", style: style, children: _jsx("div", { className: "spinner__inner" }) }) }));
    }
}
//# sourceMappingURL=index.js.map