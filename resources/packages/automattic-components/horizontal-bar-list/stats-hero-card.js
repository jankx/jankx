import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import clsx from 'clsx';
import { useTranslate } from 'i18n-calypso';
import './stats-card.scss';
const BASE_CLASS_NAME = 'stats-card';
// This component is mainly used for the Locations module, which uses heroElement, splitHeader and toggleControl
const StatsHeroCard = ({ children, className, title, titleURL, titleAriaLevel = 4, titleNodes, footerAction, isEmpty, emptyMessage, heroElement, metricLabel, mainItemLabel, additionalHeaderColumns, toggleControl, headerClassName, overlay, downloadCsv, }) => {
    const translate = useTranslate();
    const titleNode = titleURL ? (_jsx("a", { href: `${titleURL}`, className: `${BASE_CLASS_NAME}-header__title`, children: title })) : (_jsxs("div", { className: `${BASE_CLASS_NAME}-header__title`, role: "heading", "aria-level": titleAriaLevel, children: [_jsx("div", { children: title }), _jsx("div", { className: `${BASE_CLASS_NAME}-header__title-nodes`, children: titleNodes })] }));
    // Column header node for split header
    const columnHeaderNode = (_jsxs("div", { className: `${BASE_CLASS_NAME}--column-header`, children: [_jsxs("div", { className: `${BASE_CLASS_NAME}--column-header__left`, children: [mainItemLabel, additionalHeaderColumns && (_jsx("div", { className: `${BASE_CLASS_NAME}-header__additional`, children: additionalHeaderColumns }))] }, "left"), !isEmpty && (_jsx("div", { className: `${BASE_CLASS_NAME}--column-header__right`, children: metricLabel ?? translate('Views') }, "right"))] }));
    return (_jsxs("div", { className: clsx(className, BASE_CLASS_NAME, {
            [`${BASE_CLASS_NAME}__hasoverlay`]: !!overlay,
        }), children: [_jsx("div", { className: clsx(`${BASE_CLASS_NAME}-header`, headerClassName, `${BASE_CLASS_NAME}-header--split`), children: _jsxs("div", { className: `${BASE_CLASS_NAME}-header--main`, children: [_jsxs("div", { className: `${BASE_CLASS_NAME}-header--main__left`, children: [titleNode, downloadCsv] }), toggleControl] }) }), _jsxs("div", { className: `${BASE_CLASS_NAME}__content ${BASE_CLASS_NAME}__content--hero`, children: [_jsx("div", { className: `${BASE_CLASS_NAME}--hero`, children: heroElement }), _jsxs("div", { className: `${BASE_CLASS_NAME}--header-and-body`, children: [_jsxs("div", { className: clsx(`${BASE_CLASS_NAME}--body`, {
                                    [`${BASE_CLASS_NAME}--body-empty`]: isEmpty,
                                }), children: [columnHeaderNode, isEmpty ? emptyMessage : children] }), footerAction && (_jsx("a", { className: `${BASE_CLASS_NAME}--footer`, href: footerAction?.url, "aria-label": translate('View all %(title)s', {
                                    args: { title: title.toLocaleLowerCase?.() ?? title.toLowerCase() },
                                    comment: '"View all posts & pages", "View all referrers", etc.',
                                }), onClick: footerAction?.onClick, children: footerAction.label || translate('View all') }))] }), overlay && (_jsx("div", { className: `${BASE_CLASS_NAME}__overlay ${BASE_CLASS_NAME}__overlay--hero`, children: overlay }))] })] }));
};
export default StatsHeroCard;
//# sourceMappingURL=stats-hero-card.js.map