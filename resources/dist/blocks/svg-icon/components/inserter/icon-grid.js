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
import { Icon, blockDefault } from '@wordpress/icons';
import { Button } from '@wordpress/components';
/**
 * Internal dependencies
 */
import { parseIcon } from './../../utils';
export default function IconGrid(props) {
    const { shownIcons, iconSize, updateIconAtts, attributes } = props;
    const noResults = (_jsxs("div", { className: "block-editor-inserter__no-results", children: [_jsx(Icon, { icon: blockDefault, className: "block-editor-inserter__no-results-icon" }), _jsx("p", { children: __('No results found.', 'block-icon') })] }));
    const searchResults = (_jsx("div", { className: "icons-list", children: shownIcons.map((icon) => {
            let renderedIcon = icon.icon;
            // Icons provided by third-parties are generally strings.
            if (typeof renderedIcon === 'string') {
                renderedIcon = parseIcon(renderedIcon);
            }
            return (_jsxs(Button, { className: classnames('icons-list__item', 'block-editor-block-types-list__item', {
                    'is-active': icon.name === attributes?.iconName,
                    'has-no-icon-fill': icon?.hasNoIconFill,
                }), onClick: () => updateIconAtts(icon.name, icon?.hasNoIconFill), children: [_jsx("span", { className: "icons-list__item-icon", children: _jsx(Icon, { icon: renderedIcon, size: iconSize }) }), _jsx("span", { className: "icons-list__item-title", children: icon?.title ?? icon.name })] }, `icon-${icon.name}`));
        }) }));
    return (_jsx("div", { className: "icon-inserter__content-grid", children: isEmpty(shownIcons) ? noResults : searchResults }));
}
