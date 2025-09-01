import { formatNumber as formatNumberI18n } from '@automattic/number-formatters';
export function formatNumber(number, isShortened = true, showSign = false) {
    const numberFormatOptions = isShortened
        ? {
            notation: 'compact',
            maximumFractionDigits: 1,
            ...(showSign && { signDisplay: 'exceptZero' }),
        }
        : { notation: 'standard', ...(showSign && { signDisplay: 'exceptZero' }) };
    return number !== null ? formatNumberI18n(number, { numberFormatOptions }) : '-';
}
export function formatPercentage(number, usePreciseSmallPercentages = false) {
    // If the number is < 1%, then use 2 significant digits and maximumFractionDigits of 2.
    // Otherwise, use the default percentage formatting options.
    const numberFormatOptions = usePreciseSmallPercentages && number && number < 0.01
        ? { style: 'percent', maximumFractionDigits: 2, maximumSignificantDigits: 2 }
        : { style: 'percent' };
    return number !== null ? formatNumberI18n(number, { numberFormatOptions }) : '-';
}
export function subtract(a, b) {
    return a === null || b === null || b === undefined ? null : a - b;
}
export function percentCalculator(part, whole) {
    if (part === null || whole === null || whole === undefined) {
        return null;
    }
    // Handle NaN case.
    if (part === 0 && whole === 0) {
        return 0;
    }
    const answer = part / whole;
    // Handle Infinities as 100%.
    return !Number.isFinite(answer) ? 1 : answer;
}
//# sourceMappingURL=numbers.js.map