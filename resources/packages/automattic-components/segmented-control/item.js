import { jsx as _jsx } from "react/jsx-runtime";
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Component } from 'react';
class SegmentedControlItem extends Component {
    static propTypes = {
        children: PropTypes.node.isRequired,
        path: PropTypes.string,
        selected: PropTypes.bool,
        title: PropTypes.string,
        value: PropTypes.string,
        onClick: PropTypes.func,
        index: PropTypes.number,
    };
    static defaultProps = {
        selected: false,
    };
    handleKeyEvent = (event) => {
        switch (event.keyCode) {
            case 13: // enter
            case 32: // space
                event.preventDefault();
                document.activeElement.click();
                break;
        }
    };
    render() {
        const itemClassName = clsx({
            'segmented-control__item': true,
            'is-selected': this.props.selected,
        });
        const linkClassName = clsx('segmented-control__link', {
            [`item-index-${this.props.index}`]: this.props.index != null,
        });
        return (_jsx("li", { className: itemClassName, role: "none", children: _jsx("a", { href: this.props.path, className: linkClassName, onClick: this.props.onClick, title: this.props.title, "data-e2e-value": this.props.value, role: "radio", tabIndex: 0, "aria-checked": this.props.selected, onKeyDown: this.handleKeyEvent, children: _jsx("span", { className: "segmented-control__text", children: this.props.children }) }) }));
    }
}
export default SegmentedControlItem;
//# sourceMappingURL=item.js.map