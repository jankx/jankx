import { jsx as _jsx } from "react/jsx-runtime";
import { Icon, institution } from '@wordpress/icons';
import CountComparisonCard from '../count-comparison-card';
export default {
    title: 'Unaudited/Highlight Cards/CountComparisonCard',
    component: CountComparisonCard,
    argTypes: {
        heading: { control: 'text' },
        previousCount: { control: 'number' },
        count: { control: 'number' },
        showValueTooltip: { control: 'boolean' },
    },
};
const Template = ({ count, previousCount, heading }) => {
    return (_jsx("div", { style: { position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }, children: _jsx(CountComparisonCard, { heading: heading, icon: _jsx(Icon, { icon: institution }), count: count, previousCount: previousCount }) }));
};
export const CountComparisonCard_ = Template.bind({});
CountComparisonCard_.args = {
    heading: 'Customizable Heading',
    count: 234567,
    previousCount: 123456,
    showValueTooltip: false,
};
//# sourceMappingURL=count-comparison-card.stories.js.map