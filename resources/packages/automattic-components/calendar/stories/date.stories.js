import { jsx as _jsx } from "react/jsx-runtime";
/**
 * External dependencies
 */
import { useState, useEffect } from '@wordpress/element';
/**
 * Internal dependencies
 */
import Calendar from '../calendar';
import { isWeekend } from './utils';
const meta = {
    title: 'Unaudited/Calendar',
    id: 'packages-components-calendar',
    component: Calendar,
    argTypes: {
        currentDate: { control: 'date' },
        onChange: { action: 'onChange', control: false },
    },
    parameters: {
        docs: { canvas: { sourceState: 'shown' } },
    },
};
export default meta;
const Template = ({ currentDate, onChange, ...args }) => {
    const [date, setDate] = useState(currentDate);
    useEffect(() => {
        setDate(currentDate);
    }, [currentDate]);
    return (_jsx(Calendar, { ...args, currentDate: date, onChange: (newDate) => {
            setDate(newDate);
            onChange?.(newDate);
        } }));
};
export const Default = Template.bind({});
Default.args = {
    currentDate: new Date(),
};
export const WithInvalidDates = Template.bind({});
WithInvalidDates.args = {
    currentDate: new Date(),
    isInvalidDate: isWeekend,
};
//# sourceMappingURL=date.stories.js.map