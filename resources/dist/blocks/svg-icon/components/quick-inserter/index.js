import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty } from 'lodash';
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Button, Popover, SearchControl } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { Icon, blockDefault } from '@wordpress/icons';
/**
 * Internal dependencies
 */
import getIcons from './../../icons';
import { flattenIconsArray, parseIcon } from './../../utils';
export default function QuickInserterPopover(props) {
    const [searchInput, setSearchInput] = useState('');
    const { setInserterOpen, isQuickInserterOpen, setQuickInserterOpen, setAttributes, } = props;
    if (!isQuickInserterOpen) {
        return null;
    }
    function updateIconAtts(name, hasNoIconFill) {
        setAttributes({
            icon: '',
            iconName: name,
            hasNoIconFill,
        });
        setInserterOpen(false);
    }
    const iconsByType = getIcons();
    const iconsAll = flattenIconsArray(iconsByType);
    // Get the icons of the default type, if there is one. Otherwise, just pull
    // from the first icon type.
    const iconsOfDefaultType = iconsByType.filter((t) => t.isDefault)[0]?.icons ?? iconsAll;
    let shownIcons = [];
    if (searchInput) {
        shownIcons = iconsAll.filter((icon) => {
            const input = searchInput.toLowerCase();
            const iconName = icon.title.toLowerCase();
            // First check if the name matches.
            if (iconName.includes(input)) {
                return true;
            }
            // Then check if any keywords match.
            if (icon?.keywords && !isEmpty(icon?.keywords)) {
                const keywordMatches = icon.keywords.filter((keyword) => keyword.includes(input));
                return !isEmpty(keywordMatches);
            }
            return false;
        });
    }
    if (!searchInput) {
        // See if there is a default icon(s) set.
        const defaultIcons = iconsOfDefaultType.filter((i) => i.isDefault) ?? [];
        // Get the rest of the icons in the type excluding the default ones.
        const nonDefaultIcons = iconsOfDefaultType.filter((i) => !i.isDefault) ?? [];
        // First show the default icons, then the rest.
        shownIcons = shownIcons.concat(defaultIcons, nonDefaultIcons);
    }
    // Only want to display 6 icons.
    shownIcons = shownIcons.slice(0, 6);
    const searchResults = (_jsx("div", { className: "block-editor-inserter__panel-content", children: _jsx("div", { className: "icons-list", children: shownIcons.map((icon) => {
                let renderedIcon = icon.icon;
                if (typeof renderedIcon === 'string') {
                    renderedIcon = parseIcon(renderedIcon);
                }
                return (_jsxs(Button, { label: __('Insert Icon', 'icon-block'), className: classnames('icons-list__item', 'block-editor-block-types-list__item', {
                        'has-no-icon-fill': icon?.hasNoIconFill,
                    }), onClick: () => {
                        updateIconAtts(icon.name, icon?.hasNoIconFill);
                        setQuickInserterOpen(false);
                        setSearchInput('');
                    }, children: [_jsx("span", { className: "icons-list__item-icon", children: _jsx(Icon, { icon: renderedIcon }) }), _jsx("span", { className: "icons-list__item-title", children: icon.title })] }, `icon-${icon.name}`));
            }) }) }));
    const noResults = (_jsxs("div", { className: "block-editor-inserter__no-results", children: [_jsx(Icon, { icon: blockDefault, className: "block-editor-inserter__no-results-icon" }), _jsx("p", { children: __('No results found.', 'block-icon') })] }));
    return (_jsx(Popover, { className: "wp-block-outermost-icon-inserter__quick-inserter block-editor-inserter__popover is-quick", onClose: () => setQuickInserterOpen(false), position: "bottom right", offset: 12, children: _jsxs("div", { className: "block-editor-inserter__quick-inserter", children: [_jsx(SearchControl, { className: "block-editor-inserter__search", label: __('Search icons', 'icon-block'), hideLabelFromVision: true, value: searchInput, onChange: (value) => setSearchInput(value), __nextHasNoMarginBottom: true }), _jsx("div", { className: "block-editor-inserter__quick-inserter-results", children: [
                        isEmpty(shownIcons) && noResults,
                        !isEmpty(shownIcons) && searchResults,
                    ] }), _jsx(Button, { className: "block-editor-inserter__quick-inserter-expand", onClick: () => {
                        setInserterOpen(true);
                        setQuickInserterOpen(false);
                        setSearchInput('');
                    }, children: __('Browse all', 'icon-block') })] }) }));
}
