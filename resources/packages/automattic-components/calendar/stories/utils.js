export function daysFromNow(days) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date;
}
export function isWeekend(date) {
    return date.getDay() === 0 || date.getDay() === 6;
}
//# sourceMappingURL=utils.js.map