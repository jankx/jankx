import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import clsx from 'clsx';
import { useTranslate } from 'i18n-calypso';
import StatsHeroCard from './stats-hero-card';
import './stats-card.scss';
const BASE_CLASS_NAME = 'stats-card';
const StatsCard = (props) => {
    const translate = useTranslate();
    const { heroElement, splitHeader, toggleControl } = props;
    // Isolate the rendering logic for the Locations module into a new component.
    // This ensures the existing StatsCard component remains unchanged, allowing us to safely iterate on it.
    if (heroElement && splitHeader && toggleControl) {
        return _jsx(StatsHeroCard, { ...props });
    }
    const { children, className, title, titleURL, titleAriaLevel = 4, titleNodes, downloadCsv, footerAction, isEmpty, emptyMessage, multiHeader, metricLabel, mainItemLabel, additionalHeaderColumns, headerClassName, overlay, } = props;
    const titleNode = titleURL ? (_jsx("a", { href: `${titleURL}`, className: `${BASE_CLASS_NAME}-header__title`, children: title })) : (_jsxs("div", { className: `${BASE_CLASS_NAME}-header__title`, role: "heading", "aria-level": titleAriaLevel, children: [_jsx("div", { children: title }), _jsx("div", { className: `${BASE_CLASS_NAME}-header__title-nodes`, children: titleNodes })] }));
    // On one line shows card title and value column header
    const simpleHeaderNode = (_jsxs("div", { className: clsx(`${BASE_CLASS_NAME}-header`, headerClassName), children: [titleNode, !isEmpty && _jsx("div", { children: metricLabel ?? translate('Views') })] }));
    // Show card title and download csv button on one line, description and metric label on another:
    const multiHeaderNode = (_jsxs(_Fragment, { children: [_jsxs("div", { className: clsx(`${BASE_CLASS_NAME}-header`, headerClassName), children: [titleNode, !isEmpty && downloadCsv] }), !isEmpty && (_jsxs("div", { className: clsx(`${BASE_CLASS_NAME}-sub-header`, headerClassName), children: [_jsxs("div", { children: [" All ", title.toLowerCase(), " "] }), _jsx("div", { children: metricLabel ?? translate('Views') })] }))] }));
    // Show Card title on one line and all other column header(s) below:
    // (main item, optional additional columns and value)
    const splitHeaderNode = (_jsxs("div", { className: clsx(`${BASE_CLASS_NAME}-header`, headerClassName, `${BASE_CLASS_NAME}-header--split`), children: [_jsxs("div", { className: `${BASE_CLASS_NAME}-header--main`, children: [_jsxs("div", { className: `${BASE_CLASS_NAME}-header--main__left`, children: [!heroElement && titleNode, downloadCsv] }), _jsx("div", { className: `${BASE_CLASS_NAME}-header--main__right`, children: toggleControl })] }), !isEmpty && (_jsxs("div", { className: `${BASE_CLASS_NAME}--column-header`, children: [_jsxs("div", { className: `${BASE_CLASS_NAME}--column-header__left`, children: [splitHeader && mainItemLabel, additionalHeaderColumns && (_jsx("div", { className: `${BASE_CLASS_NAME}-header__additional`, children: additionalHeaderColumns }))] }, "left"), !isEmpty && (_jsx("div", { className: `${BASE_CLASS_NAME}--column-header__right`, children: metricLabel ?? translate('Views') }, "right"))] }))] }));
    const getHeaderNode = () => {
        if (multiHeader) {
            return multiHeaderNode;
        }
        if (splitHeader) {
            return splitHeaderNode;
        }
        return simpleHeaderNode;
    };
    return (_jsxs("div", { className: clsx(className, BASE_CLASS_NAME, {
            [`${BASE_CLASS_NAME}__hasoverlay`]: !!overlay,
        }), children: [_jsxs("div", { className: `${BASE_CLASS_NAME}__content`, ...(overlay && { 'aria-hidden': true, inert: '' }), children: [!!heroElement && (_jsxs("div", { className: `${BASE_CLASS_NAME}--hero`, children: [splitHeader && _jsx("div", { className: `${BASE_CLASS_NAME}-header`, children: titleNode }), heroElement] })), _jsxs("div", { className: `${BASE_CLASS_NAME}--header-and-body`, children: [getHeaderNode(), _jsx("div", { className: clsx(`${BASE_CLASS_NAME}--body`, {
                                    [`${BASE_CLASS_NAME}--body-empty`]: isEmpty,
                                }), children: isEmpty ? emptyMessage : children })] }), footerAction && (_jsx("a", { className: `${BASE_CLASS_NAME}--footer`, href: footerAction?.url, "aria-label": translate('View all %(title)s', {
                            args: { title: title.toLocaleLowerCase?.() ?? title.toLowerCase() },
                            comment: '"View all posts & pages", "View all referrers", etc.',
                        }), children: footerAction.label || translate('View all') }))] }), overlay && _jsx("div", { className: `${BASE_CLASS_NAME}__overlay`, children: overlay })] }));
};
export default StatsCard;
//# sourceMappingURL=stats-card.js.map