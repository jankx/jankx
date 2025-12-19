import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl, ToggleControl, Button } from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';
import './editor.scss';
export default function Edit({ attributes, setAttributes }) {
    const { selectedDates = [], currentMonth = 3, currentYear = 2026, showNavigation = true, showWeekdays = true } = attributes;
    const [localSelectedDates, setLocalSelectedDates] = useState(selectedDates);
    const [localMonth, setLocalMonth] = useState(currentMonth);
    const [localYear, setLocalYear] = useState(currentYear);
    const monthNames = [
        'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4',
        'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8',
        'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
    ];
    const weekdayNames = [
        'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'
    ];
    // Generate calendar data
    const generateCalendarData = (month, year) => {
        const firstDay = new Date(year, month - 1, 1);
        const daysInMonth = new Date(year, month, 0).getDate();
        const firstWeekday = (firstDay.getDay() + 6) % 7; // Convert to Monday = 0
        const calendarDays = [];
        // Previous month's days
        const prevMonth = month === 1 ? 12 : month - 1;
        const prevYear = month === 1 ? year - 1 : year;
        const prevMonthDays = new Date(prevYear, prevMonth, 0).getDate();
        for (let i = firstWeekday - 1; i >= 0; i--) {
            const day = prevMonthDays - i;
            calendarDays.push({
                day,
                month: prevMonth,
                year: prevYear,
                isCurrentMonth: false,
                isSelected: false
            });
        }
        // Current month's days
        for (let day = 1; day <= daysInMonth; day++) {
            const selectedDate = localSelectedDates.find(d => d.day === day);
            const isSelected = !!selectedDate;
            const mode = selectedDate ? selectedDate.mode : null;
            calendarDays.push({
                day,
                month,
                year,
                isCurrentMonth: true,
                isSelected,
                mode
            });
        }
        // Next month's days to fill the grid
        const remainingDays = 42 - calendarDays.length;
        const nextMonth = month === 12 ? 1 : month + 1;
        const nextYear = month === 12 ? year + 1 : year;
        for (let day = 1; day <= remainingDays; day++) {
            calendarDays.push({
                day,
                month: nextMonth,
                year: nextYear,
                isCurrentMonth: false,
                isSelected: false
            });
        }
        return calendarDays;
    };
    const calendarData = generateCalendarData(localMonth, localYear);
    const handleDateClick = (day, isCurrentMonth) => {
        if (!isCurrentMonth)
            return;
        const existingDateIndex = localSelectedDates.findIndex(d => d.day === day);
        let newSelectedDates;
        if (existingDateIndex === -1) {
            // Not selected -> outline mode
            newSelectedDates = [...localSelectedDates, { day, mode: 'outline' }];
        }
        else {
            const currentMode = localSelectedDates[existingDateIndex].mode;
            if (currentMode === 'outline') {
                // Outline -> fill mode
                newSelectedDates = [...localSelectedDates];
                newSelectedDates[existingDateIndex] = { day, mode: 'fill' };
            }
            else {
                // Fill -> remove
                newSelectedDates = localSelectedDates.filter(d => d.day !== day);
            }
        }
        setLocalSelectedDates(newSelectedDates);
        setAttributes({ selectedDates: newSelectedDates });
    };
    const handleMonthChange = (direction) => {
        let newMonth = localMonth;
        let newYear = localYear;
        if (direction === 'next') {
            newMonth = localMonth === 12 ? 1 : localMonth + 1;
            newYear = localMonth === 12 ? localYear + 1 : localYear;
        }
        else {
            newMonth = localMonth === 1 ? 12 : localMonth - 1;
            newYear = localMonth === 1 ? localYear - 1 : localYear;
        }
        setLocalMonth(newMonth);
        setLocalYear(newYear);
        setAttributes({
            currentMonth: newMonth,
            currentYear: newYear
        });
    };
    const monthOptions = monthNames.map((name, index) => ({
        label: name,
        value: index + 1
    }));
    const yearOptions = [];
    for (let year = 2020; year <= 2030; year++) {
        yearOptions.push({
            label: year.toString(),
            value: year
        });
    }
    return (_jsxs("div", { ...useBlockProps(), children: [_jsx(InspectorControls, { children: _jsxs(PanelBody, { title: __('Calendar Settings', 'jankx'), children: [_jsx(SelectControl, { label: __('Month', 'jankx'), value: localMonth, options: monthOptions, onChange: (value) => {
                                const newMonth = parseInt(value);
                                setLocalMonth(newMonth);
                                setAttributes({ currentMonth: newMonth });
                            } }), _jsx(SelectControl, { label: __('Year', 'jankx'), value: localYear, options: yearOptions, onChange: (value) => {
                                const newYear = parseInt(value);
                                setLocalYear(newYear);
                                setAttributes({ currentYear: newYear });
                            } }), _jsx(ToggleControl, { label: __('Show Navigation', 'jankx'), checked: showNavigation, onChange: (value) => setAttributes({ showNavigation: value }) }), _jsx(ToggleControl, { label: __('Show Weekdays', 'jankx'), checked: showWeekdays, onChange: (value) => setAttributes({ showWeekdays: value }) }), _jsx(Button, { isSecondary: true, onClick: () => {
                                setLocalSelectedDates([]);
                                setAttributes({ selectedDates: [] });
                            }, children: __('Clear Selected Dates', 'jankx') })] }) }), _jsxs("div", { className: "date-picker-calendar-editor", children: [showNavigation && (_jsxs("div", { className: "calendar-header", children: [_jsx("button", { className: "calendar-nav-btn prev-month", onClick: () => handleMonthChange('prev'), children: _jsx("span", { className: "dashicons dashicons-arrow-left-alt2" }) }), _jsxs("h3", { className: "calendar-title", children: [monthNames[localMonth - 1], " - ", localYear] }), _jsx("button", { className: "calendar-nav-btn next-month", onClick: () => handleMonthChange('next'), children: _jsx("span", { className: "dashicons dashicons-arrow-right-alt2" }) })] })), showWeekdays && (_jsx("div", { className: "calendar-weekdays", children: weekdayNames.map((weekday, index) => (_jsx("div", { className: "weekday", children: weekday }, index))) })), _jsx("div", { className: "calendar-grid", children: calendarData.map((dayData, index) => (_jsx("div", { className: `calendar-day ${dayData.isCurrentMonth ? 'current-month' : 'other-month'} ${dayData.isSelected ? 'selected' : ''} ${dayData.isSelected && dayData.mode ? `mode-${dayData.mode}` : ''}`, onClick: () => handleDateClick(dayData.day, dayData.isCurrentMonth), children: _jsx("span", { className: "day-number", children: dayData.day }) }, index))) })] })] }));
}
