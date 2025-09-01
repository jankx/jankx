import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Icon } from '@wordpress/components';
import { chevronDown } from '@wordpress/icons';
import clsx from 'clsx';
import { localize } from 'i18n-calypso';
import PropTypes from 'prop-types';
import { Component, createElement } from 'react';
import { Card, CompactCard, Gridicon, ScreenReaderText } from '../';
import './style.scss';
const noop = () => { };
class FoldableCard extends Component {
    static displayName = 'FoldableCard';
    static propTypes = {
        actionButton: PropTypes.node,
        actionButtonExpanded: PropTypes.node,
        cardKey: PropTypes.string,
        clickableHeader: PropTypes.bool,
        compact: PropTypes.bool,
        disabled: PropTypes.bool,
        expandable: PropTypes.bool,
        expandedSummary: PropTypes.node,
        expanded: PropTypes.bool,
        headerTagName: PropTypes.string,
        icon: PropTypes.string,
        iconSize: PropTypes.number,
        onClick: PropTypes.func,
        onClose: PropTypes.func,
        onOpen: PropTypes.func,
        screenReaderText: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
        summary: PropTypes.node,
        hideSummary: PropTypes.bool,
        highlight: PropTypes.string,
        smooth: PropTypes.bool,
        contentExpandedStyle: PropTypes.object,
        contentCollapsedStyle: PropTypes.object,
        useInert: PropTypes.bool,
    };
    static defaultProps = {
        onOpen: noop,
        onClose: noop,
        cardKey: '',
        headerTagName: 'span',
        iconSize: 24,
        expandable: true,
        expanded: false,
        screenReaderText: false,
        smooth: false,
        useInert: false,
    };
    state = {
        expanded: this.props.expanded,
    };
    // @TODO: Please update https://github.com/Automattic/wp-calypso/issues/58453 if you are refactoring away from UNSAFE_* lifecycle methods!
    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.expanded !== this.props.expanded) {
            this.setState({ expanded: nextProps.expanded });
        }
    }
    onClick = () => {
        if (this.props.children) {
            this.setState({ expanded: !this.state.expanded });
        }
        if (this.props.onClick) {
            this.props.onClick();
        }
        if (this.state.expanded) {
            this.props.onClose(this.props.cardKey);
        }
        else {
            this.props.onOpen(this.props.cardKey);
        }
    };
    getClickAction() {
        if (this.props.disabled || !this.props.expandable) {
            return;
        }
        return this.onClick;
    }
    getActionButton() {
        if (this.state.expanded) {
            return this.props.actionButtonExpanded || this.props.actionButton;
        }
        return this.props.actionButton;
    }
    renderActionButton() {
        const clickAction = !this.props.clickableHeader ? this.getClickAction() : null;
        if (this.props.actionButton) {
            return (_jsx("div", { className: "foldable-card__action", role: "presentation", onClick: clickAction, children: this.getActionButton() }));
        }
        if (this.props.children) {
            const screenReaderText = this.props.screenReaderText || this.props.translate('More');
            return (_jsxs("button", { disabled: this.props.disabled || !this.props.expandable, type: "button", className: "foldable-card__action foldable-card__expand", "aria-expanded": this.state.expanded, onClick: clickAction, children: [_jsx(ScreenReaderText, { children: screenReaderText }), this.props.icon ? (_jsx(Gridicon, { icon: this.props.icon, size: this.props.iconSize })) : (_jsx(Icon, { icon: chevronDown, size: this.props.iconSize, className: "gridicon" }))] }));
        }
    }
    renderContent() {
        const additionalStyle = this.state.expanded
            ? this.props.contentExpandedStyle
            : this.props.contentCollapsedStyle;
        const inertProps = this.state.expanded || !this.props.useInert ? {} : { inert: '' };
        return (_jsx("div", { className: "foldable-card__content", style: additionalStyle, ...inertProps, children: this.props.children }));
    }
    renderHeader() {
        const summary = this.props.summary ? (_jsxs("span", { className: "foldable-card__summary", children: [this.props.summary, " "] })) : null;
        const expandedSummary = this.props.expandedSummary ? (_jsxs("span", { className: "foldable-card__summary-expanded", children: [this.props.expandedSummary, " "] })) : null;
        const headerClickAction = this.props.clickableHeader ? this.getClickAction() : null;
        const headerClasses = clsx('foldable-card__header', {
            'is-clickable': !!this.props.clickableHeader,
            'is-expandable': this.props.expandable,
        });
        const header = createElement(this.props.headerTagName, { className: 'foldable-card__main' }, this.props.header, this.renderActionButton());
        return (_jsxs("div", { className: headerClasses, role: "presentation", onClick: headerClickAction, children: [header, !this.props.hideSummary && (_jsxs("span", { className: "foldable-card__secondary", children: [summary, expandedSummary] }))] }));
    }
    render() {
        const Container = this.props.compact ? CompactCard : Card;
        const itemSiteClasses = clsx('foldable-card', this.props.className, {
            'is-disabled': !!this.props.disabled,
            'is-expanded': !!this.state.expanded,
            'has-expanded-summary': !!this.props.expandedSummary,
            'is-smooth': !!this.props.smooth,
        });
        return (_jsxs(Container, { className: itemSiteClasses, highlight: this.props.highlight, children: [this.renderHeader(), (this.state.expanded || this.props.smooth) && this.renderContent()] }));
    }
}
export default localize(FoldableCard);
//# sourceMappingURL=index.js.map