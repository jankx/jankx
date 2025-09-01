import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { getCurrencyObject } from '@automattic/number-formatters';
import clsx from 'clsx';
import { useTranslate } from 'i18n-calypso';
import { Component, createElement } from 'react';
import { Badge } from '../';
import './style.scss';
export class PlanPrice extends Component {
    render() {
        const { currencyCode = 'USD', rawPrice, isSmallestUnit, original, discounted, className, displayFlatPrice, displayPerMonthNotation, productDisplayPrice, isOnSale, taxText, omitHeading, priceDisplayWrapperClassName, isLargeCurrency, } = this.props;
        const classes = clsx('plan-price', className, {
            'is-original': original,
            'is-discounted': discounted,
            'is-large-currency': isLargeCurrency,
        });
        const tagName = omitHeading ? 'span' : 'h4';
        const areThereMultipleRawPrices = rawPrice && Array.isArray(rawPrice) && rawPrice.length > 1;
        if (productDisplayPrice && !areThereMultipleRawPrices) {
            return createElement(tagName, { className: classes }, _jsx("span", { className: "plan-price__integer", 
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML: { __html: productDisplayPrice } }));
        }
        if (!currencyCode || rawPrice === undefined || rawPrice === null) {
            return null;
        }
        // "Normalize" the input price or price range.
        const rawPriceRange = Array.isArray(rawPrice) ? rawPrice.slice(0, 2) : [rawPrice];
        // If zero is in an array of length 2, render nothing
        if (Array.isArray(rawPrice) && rawPriceRange.includes(0)) {
            return null;
        }
        if (displayFlatPrice) {
            return (_jsx(FlatPriceDisplay, { smallerPrice: rawPriceRange[0], higherPrice: rawPriceRange[1], currencyCode: currencyCode, className: classes, isSmallestUnit: isSmallestUnit }));
        }
        return (_jsx(MultiPriceDisplay, { className: classes, tagName: tagName, smallerPrice: rawPriceRange[0], higherPrice: rawPriceRange[1], currencyCode: currencyCode, taxText: taxText, displayPerMonthNotation: displayPerMonthNotation, isOnSale: isOnSale, priceDisplayWrapperClassName: priceDisplayWrapperClassName, isSmallestUnit: isSmallestUnit }));
    }
}
export default PlanPrice;
function PriceWithoutHtml({ price, currencyCode, isSmallestUnit, }) {
    const priceObj = getCurrencyObject(price, currencyCode, { isSmallestUnit });
    if (priceObj.hasNonZeroFraction) {
        return _jsx(_Fragment, { children: `${priceObj.integer}${priceObj.fraction}` });
    }
    return _jsx(_Fragment, { children: priceObj.integer });
}
function FlatPriceDisplay({ smallerPrice, higherPrice, currencyCode, className, isSmallestUnit, }) {
    const { symbol: currencySymbol, symbolPosition } = getCurrencyObject(smallerPrice, currencyCode);
    const translate = useTranslate();
    if (!higherPrice) {
        return (_jsxs("span", { className: className, children: [symbolPosition === 'before' ? currencySymbol : null, _jsx(PriceWithoutHtml, { price: smallerPrice, currencyCode: currencyCode, isSmallestUnit: isSmallestUnit }), symbolPosition === 'after' ? currencySymbol : null] }));
    }
    return (_jsxs("span", { className: className, children: [symbolPosition === 'before' ? currencySymbol : null, translate('%(smallerPrice)s-%(higherPrice)s', {
                args: {
                    smallerPrice: (_jsx(PriceWithoutHtml, { price: smallerPrice, currencyCode: currencyCode, isSmallestUnit: isSmallestUnit })),
                    higherPrice: (_jsx(PriceWithoutHtml, { price: higherPrice, currencyCode: currencyCode, isSmallestUnit: isSmallestUnit })),
                },
                comment: 'The price range for a particular product',
            }), symbolPosition === 'after' ? currencySymbol : null] }));
}
function MultiPriceDisplay({ tagName, className, smallerPrice, higherPrice, currencyCode, taxText, displayPerMonthNotation, isOnSale, priceDisplayWrapperClassName, isSmallestUnit, }) {
    const { symbol: currencySymbol, symbolPosition } = getCurrencyObject(smallerPrice, currencyCode);
    const translate = useTranslate();
    return createElement(tagName, { className }, _jsxs(_Fragment, { children: [symbolPosition === 'before' ? (_jsx("sup", { className: "plan-price__currency-symbol", children: currencySymbol })) : null, !higherPrice && (_jsx(HtmlPriceDisplay, { price: smallerPrice, currencyCode: currencyCode, priceDisplayWrapperClassName: priceDisplayWrapperClassName, isSmallestUnit: isSmallestUnit })), higherPrice &&
                translate('{{smallerPrice/}}-{{higherPrice/}}', {
                    components: {
                        smallerPrice: (_jsx(HtmlPriceDisplay, { price: smallerPrice, currencyCode: currencyCode, priceDisplayWrapperClassName: priceDisplayWrapperClassName, isSmallestUnit: isSmallestUnit })),
                        higherPrice: (_jsx(HtmlPriceDisplay, { price: higherPrice, currencyCode: currencyCode, priceDisplayWrapperClassName: priceDisplayWrapperClassName, isSmallestUnit: isSmallestUnit })),
                    },
                    comment: 'The price range for a particular product',
                }), symbolPosition === 'after' ? (_jsx("sup", { className: "plan-price__currency-symbol", children: currencySymbol })) : null, taxText && (_jsx("sup", { className: "plan-price__tax-amount", children: translate('(+%(taxText)s tax)', { args: { taxText } }) })), displayPerMonthNotation && (_jsx("span", { className: "plan-price__term", children: translate('per{{newline/}}month', {
                    components: { newline: _jsx("br", {}) },
                    comment: 'Displays next to the price. You can remove the "{{newline/}}" if it is not proper for your language.',
                }) })), isOnSale && (_jsx(Badge, { children: translate('Sale', {
                    comment: 'Shown next to a domain that has a special discounted sale price',
                }) }))] }));
}
function HtmlPriceDisplay({ price, currencyCode, priceDisplayWrapperClassName, isSmallestUnit, }) {
    const priceObj = getCurrencyObject(price, currencyCode, { isSmallestUnit });
    if (priceDisplayWrapperClassName) {
        return (_jsx("div", { className: priceDisplayWrapperClassName, children: _jsxs("span", { className: "plan-price__integer", children: [priceObj.integer, priceObj.hasNonZeroFraction && priceObj.fraction] }) }));
    }
    return (_jsxs(_Fragment, { children: [_jsx("span", { className: "plan-price__integer", children: priceObj.integer }), _jsx("sup", { className: "plan-price__fraction", children: priceObj.hasNonZeroFraction && priceObj.fraction })] }));
}
//# sourceMappingURL=index.js.map