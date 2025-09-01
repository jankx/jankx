import { jsxs as _jsxs, jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { createRef, Component } from 'react';
import Count from '../count';
import TranslatableString from './translatable/proptype';
class SelectDropdownItem extends Component {
    static propTypes = {
        children: PropTypes.oneOfType([TranslatableString, PropTypes.node]).isRequired,
        compactCount: PropTypes.bool,
        path: PropTypes.string,
        selected: PropTypes.bool,
        onClick: PropTypes.func,
        count: PropTypes.number,
        disabled: PropTypes.bool,
        icon: PropTypes.element,
        ariaLabel: PropTypes.string,
        secondaryIcon: PropTypes.element,
    };
    static defaultProps = {
        selected: false,
    };
    linkRef = createRef();
    // called by the parent `SelectDropdown` component to focus the item on keyboard navigation
    focusLink() {
        this.linkRef.current.focus();
    }
    render() {
        const optionClassName = clsx('select-dropdown__item', this.props.className, {
            'is-selected': this.props.selected,
            'is-disabled': this.props.disabled,
            'has-icon': this.props.icon,
        });
        const label = this.props.value || this.props.children;
        const ariaLabel = this.props.ariaLabel ||
            ('number' === typeof this.props.count ? `${label} (${this.props.count})` : label);
        return (_jsx("li", { className: "select-dropdown__option", children: _jsxs("a", { ref: this.linkRef, href: this.props.path, className: optionClassName, onClick: this.props.disabled ? null : this.props.onClick, "data-bold-text": label, role: "menuitem", tabIndex: "0", "aria-current": this.props.selected, "aria-label": ariaLabel, "data-e2e-title": this.props.e2eTitle, children: [_jsxs("span", { className: "select-dropdown__item-text", children: [this.props.icon, this.props.children] }), 'number' === typeof this.props.count ? (_jsx("span", { "data-text": this.props.count, className: "select-dropdown__item-count", children: _jsx(Count, { count: this.props.count, compact: this.props.compactCount }) })) : (_jsx(_Fragment, { children: this.props.secondaryIcon }))] }) }));
    }
}
export default SelectDropdownItem;
//# sourceMappingURL=item.js.map