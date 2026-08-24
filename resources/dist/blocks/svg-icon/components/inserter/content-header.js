import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * WordPress dependencies
 */
import { __, sprintf, _n } from '@wordpress/i18n';
import { RangeControl } from '@wordpress/components';
export default function ContentHeader(props) {
    const { searchInput, shownIconsCount, iconSize, setIconSize } = props;
    return (_jsxs("div", { className: "icon-inserter__content-header", children: [_jsx("div", { className: "search-results", children: searchInput &&
                    sprintf(
                    // translators: %1$s: Number of icons returned from search, %2$s: the search input
                    _n('%1$s search result for "%2$s"', '%1$s search results for "%2$s"', shownIconsCount, 'icon-block'), shownIconsCount, searchInput) }), _jsx("div", { className: "icon-controls", children: _jsxs("div", { className: "icon-controls__size", children: [_jsx("span", { children: __('Preview size', 'icon-block') }), _jsx(RangeControl, { min: 24, max: 72, value: iconSize, withInputField: false, onChange: (value) => setIconSize(value), __nextHasNoMarginBottom: true })] }) })] }));
}
