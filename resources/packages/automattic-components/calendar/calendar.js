import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * External dependencies
 */
import { Button, __experimentalHStack as HStack, __experimentalHeading as Heading, } from '@wordpress/components';
import { dateI18n, getSettings } from '@wordpress/date';
import { useState, useRef, useEffect } from '@wordpress/element';
import { __, sprintf, isRTL } from '@wordpress/i18n';
import { arrowLeft, arrowRight } from '@wordpress/icons';
import clsx from 'clsx';
import { format, isSameDay, subMonths, addMonths, startOfDay, isEqual, addDays, subWeeks, addWeeks, isSameMonth, startOfWeek, endOfWeek, } from 'date-fns';
/**
 * Internal dependencies
 */
import { TIMEZONELESS_FORMAT } from './constants';
import { useLilius } from './use-lilius';
import { inputToDate } from './utils';
import './styles.scss';
/**
 * Calendar is a React component that renders a calendar for date selection.
 *
 * ```jsx
 * import { Calendar } from '@wordpress/components';
 * import { useState } from '@wordpress/element';
 *
 * const MyCalendar = () => {
 *   const [ date, setDate ] = useState( new Date() );
 *
 *   return (
 *     <Calendar
 *       currentDate={ date }
 *       onChange={ ( newDate ) => setDate( newDate ) }
 *     />
 *   );
 * };
 * ```
 */
export function Calendar({ currentDate, onChange, isInvalidDate, onMonthPreviewed, startOfWeek: weekStartsOn = 0, }) {
    const date = currentDate ? inputToDate(currentDate) : new Date();
    const { calendar, viewing, setSelected, setViewing, isSelected, viewPreviousMonth, viewNextMonth, } = useLilius({
        selected: [startOfDay(date)],
        viewing: startOfDay(date),
        weekStartsOn,
    });
    // Used to implement a roving tab index. Tracks the day that receives focus
    // when the user tabs into the calendar.
    const [focusable, setFocusable] = useState(startOfDay(date));
    // Allows us to only programmatically focus() a day when focus was already
    // within the calendar. This stops us stealing focus from e.g. a TimePicker
    // input.
    const [isFocusWithinCalendar, setIsFocusWithinCalendar] = useState(false);
    // Update internal state when currentDate prop changes.
    const [prevCurrentDate, setPrevCurrentDate] = useState(currentDate);
    if (currentDate !== prevCurrentDate) {
        setPrevCurrentDate(currentDate);
        setSelected([startOfDay(date)]);
        setViewing(startOfDay(date));
        setFocusable(startOfDay(date));
    }
    return (_jsxs("div", { className: "calendar", role: "application", "aria-label": __('Calendar'), children: [_jsxs(HStack, { className: "calendar__navigator", children: [_jsx(Button, { icon: isRTL() ? arrowRight : arrowLeft, variant: "tertiary", "aria-label": __('View previous month'), onClick: () => {
                            viewPreviousMonth();
                            setFocusable(subMonths(focusable, 1));
                            onMonthPreviewed?.(format(subMonths(viewing, 1), TIMEZONELESS_FORMAT));
                        }, size: "compact" }), _jsxs(Heading, { level: 3, className: "calendar__month-heading", children: [_jsx("strong", { children: dateI18n('F', viewing, -viewing.getTimezoneOffset()) }), ' ', dateI18n('Y', viewing, -viewing.getTimezoneOffset())] }), _jsx(Button, { icon: isRTL() ? arrowLeft : arrowRight, variant: "tertiary", "aria-label": __('View next month'), onClick: () => {
                            viewNextMonth();
                            setFocusable(addMonths(focusable, 1));
                            onMonthPreviewed?.(format(addMonths(viewing, 1), TIMEZONELESS_FORMAT));
                        }, size: "compact" })] }), _jsxs("div", { className: "calendar__month", onFocus: () => setIsFocusWithinCalendar(true), onBlur: () => setIsFocusWithinCalendar(false), children: [calendar[0][0].map((day) => (_jsx("div", { className: "calendar__day-of-week", children: dateI18n('D', day, -day.getTimezoneOffset()) }, day.toString()))), calendar[0].map((week) => week.map((day, index) => {
                        if (!isSameMonth(day, viewing)) {
                            return null;
                        }
                        return (_jsx(Day, { day: day, column: index + 1, isSelected: isSelected(day), isFocusable: isEqual(day, focusable), isFocusAllowed: isFocusWithinCalendar, isToday: isSameDay(day, new Date()), isInvalid: isInvalidDate ? isInvalidDate(day) : false, onClick: () => {
                                setSelected([day]);
                                setFocusable(day);
                                onChange?.(format(
                                // Don't change the selected date's time fields.
                                new Date(day.getFullYear(), day.getMonth(), day.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds()), TIMEZONELESS_FORMAT));
                            }, onKeyDown: (event) => {
                                let nextFocusable;
                                if (event.key === 'ArrowLeft') {
                                    nextFocusable = addDays(day, isRTL() ? 1 : -1);
                                }
                                if (event.key === 'ArrowRight') {
                                    nextFocusable = addDays(day, isRTL() ? -1 : 1);
                                }
                                if (event.key === 'ArrowUp') {
                                    nextFocusable = subWeeks(day, 1);
                                }
                                if (event.key === 'ArrowDown') {
                                    nextFocusable = addWeeks(day, 1);
                                }
                                if (event.key === 'PageUp') {
                                    nextFocusable = subMonths(day, 1);
                                }
                                if (event.key === 'PageDown') {
                                    nextFocusable = addMonths(day, 1);
                                }
                                if (event.key === 'Home') {
                                    nextFocusable = startOfWeek(day);
                                }
                                if (event.key === 'End') {
                                    nextFocusable = startOfDay(endOfWeek(day));
                                }
                                if (nextFocusable) {
                                    event.preventDefault();
                                    setFocusable(nextFocusable);
                                    if (!isSameMonth(nextFocusable, viewing)) {
                                        setViewing(nextFocusable);
                                        onMonthPreviewed?.(format(nextFocusable, TIMEZONELESS_FORMAT));
                                    }
                                }
                            } }, day.toString()));
                    }))] })] }));
}
function Day({ day, column, isSelected, isFocusable, isFocusAllowed, isToday, isInvalid, onClick, onKeyDown, }) {
    const ref = useRef();
    // Focus the day when it becomes focusable, e.g. because an arrow key is
    // pressed. Only do this if focus is allowed - this stops us stealing focus
    // from e.g. a TimePicker input.
    useEffect(() => {
        if (ref.current && isFocusable && isFocusAllowed) {
            ref.current.focus();
        }
        // isFocusAllowed is not a dep as there is no point calling focus() on
        // an already focused element.
    }, [isFocusable]);
    return (_jsx(Button, { __next40pxDefaultSize: true, ref: ref, className: clsx('calendar__day', `calendar__day--column-${column}`, {
            'is-selected': isSelected,
            'is-today': isToday,
            'is-invalid': isInvalid,
        }), disabled: isInvalid, tabIndex: isFocusable ? 0 : -1, "aria-label": getDayLabel(day, isSelected), onClick: onClick, onKeyDown: onKeyDown, children: dateI18n('j', day, -day.getTimezoneOffset()) }));
}
function getDayLabel(date, isSelected) {
    const { formats } = getSettings();
    const localizedDate = dateI18n(formats.date, date, -date.getTimezoneOffset());
    if (isSelected) {
        return sprintf(
        // translators: %s: The calendar date.
        __('%1$s. Selected'), localizedDate);
    }
    return localizedDate;
}
export default Calendar;
//# sourceMappingURL=calendar.js.map