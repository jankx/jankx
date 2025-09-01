import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { comment, Icon, paragraph, postContent, starEmpty } from '@wordpress/icons';
import clsx from 'clsx';
import { translate, useTranslate } from 'i18n-calypso';
import ComponentSwapper from '../component-swapper';
import CountCard from './count-card';
import HighlightCardsHeading from './highlight-cards-heading';
import MobileHighlightCardListing from './mobile-highlight-cards';
import './style.scss';
function getCardProps(counts) {
    return [
        { heading: translate('Posts'), count: counts?.posts, icon: postContent },
        { heading: translate('Words'), count: counts?.words, icon: paragraph },
        { heading: translate('Likes'), count: counts?.likes, icon: starEmpty },
        { heading: translate('Comments'), count: counts?.comments, icon: comment },
    ];
}
function AnnualHighlightsMobile({ counts }) {
    return _jsx(MobileHighlightCardListing, { highlights: getCardProps(counts) });
}
function AnnualHighlightsStandard({ counts }) {
    const props = getCardProps(counts);
    return (_jsx("div", { className: "highlight-cards-list", children: props.map(({ count, heading, icon }, index) => (_jsx(CountCard, { heading: heading, label: heading.toLocaleLowerCase(), value: count, icon: _jsx(Icon, { icon: icon }), showValueTooltip: true }, index))) }));
}
export default function AnnualHighlightCards({ className, counts, titleHref, year, navigation, }) {
    const translate = useTranslate();
    const header = (_jsxs(HighlightCardsHeading, { children: [year != null && Number.isFinite(year)
                ? translate('%(year)s in review', { args: { year } })
                : translate('Year in review'), ' ', titleHref ? (_jsx("small", { children: _jsx("a", { className: "highlight-cards-heading-wrapper", href: titleHref, children: translate('View all annual insights') }) })) : null] }));
    return (_jsxs("div", { className: clsx('highlight-cards', className ?? null), children: [_jsxs("div", { className: "highlight-year-navigation", children: [header, navigation] }), _jsx(ComponentSwapper, { breakpoint: "<660px", breakpointActiveComponent: _jsx(AnnualHighlightsMobile, { counts: counts }), breakpointInactiveComponent: _jsx(AnnualHighlightsStandard, { counts: counts }) })] }));
}
//# sourceMappingURL=annual-highlight-cards.js.map