import { jsx as _jsx } from "react/jsx-runtime";
import { ExperienceControl } from './index';
const meta = {
    title: 'Unaudited/ExperienceControl',
    component: ExperienceControl,
};
export default meta;
export const Default = {
    args: {
        label: 'How was your experience?',
        selectedExperience: 'good',
        onChange: () => { },
    },
};
export const WithHelpText = {
    args: {
        label: 'Rate your satisfaction',
        selectedExperience: 'good',
        helpText: 'Please select an option that best describes your experience',
        onChange: () => { },
    },
};
export const PreSelectedBad = {
    args: {
        label: 'How was the support?',
        selectedExperience: 'bad',
        onChange: () => { },
    },
};
// Example of using the Base component directly
export const CustomBase = {
    render: () => (_jsx(ExperienceControl.Base, { label: "Custom Experience Control", children: _jsx(ExperienceControl.Option, { isSelected: true, onClick: () => { }, children: "1" }) })),
};
//# sourceMappingURL=index.stories.js.map