import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { formatNumber, formatNumberCompact } from '@automattic/number-formatters';
import { decodeEntities } from '@wordpress/html-entities';
import { Icon, chevronDown, chevronUp, tag, file } from '@wordpress/icons';
import clsx from 'clsx';
import { Fragment, useState } from 'react';
import './style.scss';
const BASE_CLASS_NAME = 'horizontal-bar-list';
const HorizontalBarListItem = ({ data, className, maxValue, url, onClick, hasIndicator, leftSideItem, renderLeftSideItem, renderRightSideItem, useShortLabel, useShortNumber, leftGroupToggle, isStatic, additionalColumns, usePlainCard, isLinkUnderlined, hasNoBackground, formatValue, }) => {
    const { label, value, shortLabel, children: itemChildren } = data;
    const fillPercentage = maxValue > 0 ? (value / maxValue) * 100 : 0;
    const isLink = url || (onClick && !itemChildren);
    const hasChildren = !!itemChildren;
    const [open, setOpen] = useState(false);
    const toggleOpen = (e) => {
        e?.preventDefault();
        setOpen(!open);
    };
    const toggleOpenKey = (e) => {
        if (e?.key === 'Enter' || e?.key === 'Space') {
            e?.preventDefault();
            setOpen(!open);
        }
    };
    const onClickHandler = (e) => {
        e?.preventDefault();
        onClick?.(e, data);
    };
    const onKeyDownHandler = (e) => {
        if (e?.key === 'Enter' || e?.key === 'Space') {
            e?.preventDefault();
            onClick?.(e, data);
        }
    };
    const TagName = isLink ? 'a' : 'div'; // group parents and countries don't use anchors.
    let labelText;
    // tags use an array for a label(s)
    if (Array.isArray(label)) {
        // combine all items into one
        labelText = (_jsx(_Fragment, { children: label.length > 1
                ? label.map((item, index) => (_jsxs(Fragment, { children: [_jsx(Icon, { className: "stats-icon", icon: item.labelIcon === 'folder' ? file : tag, size: 22 }), _jsx("span", { children: decodeEntities(item.label) })] }, index)))
                : label[0].label }));
    }
    else {
        labelText = decodeEntities(useShortLabel ? shortLabel || '' : label); // shortLabel as an empty string to make TS happy
    }
    let rowClick;
    let rowKeyPress;
    if (hasChildren) {
        rowClick = toggleOpen;
        rowKeyPress = toggleOpenKey;
    }
    else if (!url) {
        rowClick = onClickHandler;
        rowKeyPress = onKeyDownHandler;
    }
    const groupChevron = (_jsx("span", { className: `${BASE_CLASS_NAME}-group-toggle`, children: _jsx(Icon, { icon: open ? chevronUp : chevronDown }) }));
    const renderValue = () => {
        if (useShortNumber) {
            return _jsx("span", { children: formatNumberCompact(value) });
        }
        if (formatValue) {
            return formatValue(value, data);
        }
        return usePlainCard ? value : formatNumber(value, { decimals: 0 });
    };
    return (_jsxs(_Fragment, { children: [_jsxs("li", { className: clsx(`${BASE_CLASS_NAME}-item`, {
                    [`${BASE_CLASS_NAME}-item--indicated`]: hasIndicator,
                    [`${BASE_CLASS_NAME}-item--link`]: isLink || hasChildren,
                    [`${BASE_CLASS_NAME}-item--link-underlined`]: isLinkUnderlined,
                    [`${BASE_CLASS_NAME}-item--static`]: isStatic,
                    [`${BASE_CLASS_NAME}-item--no-bg`]: hasNoBackground,
                }, className), style: !usePlainCard
                    ? {
                        [`--${BASE_CLASS_NAME}-fill`]: `${fillPercentage}%`,
                    }
                    : {}, onClick: rowClick, onKeyDown: rowKeyPress, 
                // eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
                role: "button", tabIndex: 0, children: [_jsxs("div", { className: `${BASE_CLASS_NAME}-item-bar`, children: [(leftSideItem || (renderLeftSideItem && renderLeftSideItem?.(data))) && (_jsx("span", { className: `${BASE_CLASS_NAME}-item__left-icon`, children: leftSideItem ? leftSideItem : renderLeftSideItem?.(data) })), _jsxs(TagName, { className: clsx(`${BASE_CLASS_NAME}-label`, hasChildren && `${BASE_CLASS_NAME}-label--group-header`), href: url, tabIndex: 0, children: [leftGroupToggle && hasChildren && groupChevron, _jsx("span", { className: `${BASE_CLASS_NAME}__group-label`, children: labelText }), !leftGroupToggle && hasChildren && groupChevron] }), renderRightSideItem && (_jsx("span", { className: `${BASE_CLASS_NAME}--hover-action`, children: renderRightSideItem(data) })), additionalColumns && (_jsx("div", { className: `${BASE_CLASS_NAME}-item--additional`, children: additionalColumns }))] }), _jsx("div", { className: "value", children: renderValue() })] }), itemChildren && open && (_jsx("li", { children: _jsx("ul", { className: `${BASE_CLASS_NAME}-group`, children: itemChildren?.map((child, index) => {
                        if (child.value === null) {
                            child.value = value; // take parent's value
                        }
                        return (_jsx(HorizontalBarListItem, { data: child, className: className, maxValue: maxValue, useShortLabel: useShortLabel, useShortNumber: useShortNumber, renderLeftSideItem: renderLeftSideItem, renderRightSideItem: renderRightSideItem, onClick: (e) => onClick?.(e, child), hasIndicator: hasIndicator, isStatic: isStatic, usePlainCard: usePlainCard, isLinkUnderlined: isLinkUnderlined, formatValue: formatValue }, `group-${child?.id ?? index}`));
                    }) }) }))] }));
};
export default HorizontalBarListItem;
//# sourceMappingURL=horizontal-bar-grid-item.js.map