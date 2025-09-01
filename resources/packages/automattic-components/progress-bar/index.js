import { jsx as _jsx } from "react/jsx-runtime";
import clsx from 'clsx';
import * as React from 'react';
import ScreenReaderText from '../screen-reader-text';
import './style.scss';
export default class ProgressBar extends React.PureComponent {
    static defaultProps = {
        total: 100,
        compact: false,
        isPulsing: false,
        canGoBackwards: false,
    };
    static getDerivedStateFromProps(props, state) {
        return {
            allTimeMax: Math.max(state.allTimeMax, props.value),
        };
    }
    state = {
        allTimeMax: this.props.value,
    };
    getCompletionPercentage() {
        const percentage = Math.ceil(((this.props.canGoBackwards ? this.props.value : this.state.allTimeMax) /
            this.props.total) *
            100);
        // The percentage should not be allowed to be more than 100
        return Math.min(percentage, 100);
    }
    renderBar() {
        const { color, title, total, value, style } = this.props;
        let styles = { width: this.getCompletionPercentage() + '%' };
        if (color) {
            styles.backgroundColor = color;
        }
        if (style) {
            styles = { ...styles, ...style };
        }
        return (_jsx("div", { "aria-valuemax": total, "aria-valuemin": 0, "aria-valuenow": value, "aria-label": "progress bar", className: "progress-bar__progress", role: "progressbar", style: styles, children: title && _jsx(ScreenReaderText, { children: title }) }));
    }
    render() {
        const classes = clsx(this.props.className, 'progress-bar', {
            'is-compact': this.props.compact,
            'is-pulsing': this.props.isPulsing,
        });
        return _jsx("div", { className: classes, children: this.renderBar() });
    }
}
//# sourceMappingURL=index.js.map