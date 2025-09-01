import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from '@wordpress/components';
import clsx from 'clsx';
import { IconBad, IconGood, IconNeutral } from './icons';
import './style.scss';
var Experience;
(function (Experience) {
    Experience["GOOD"] = "good";
    Experience["NEUTRAL"] = "neutral";
    Experience["BAD"] = "bad";
})(Experience || (Experience = {}));
const ExperienceControlOption = ({ className, isSelected, onClick, children, }) => (_jsx(Button, { className: clsx('experience-control__button', className, {
        'is-selected': isSelected,
    }), onClick: onClick, children: _jsx("div", { className: "experience-control__button-content", children: children }) }));
const ExperienceControlBase = ({ label, children, helpText, }) => (_jsxs("div", { className: "experience-control", children: [_jsx("div", { className: "experience-control__label", children: label }), _jsx("div", { className: "experience-control__buttons", children: children }), helpText && _jsx("div", { className: "experience-control__help-text", children: helpText })] }));
export function ExperienceControl({ label, onChange, selectedExperience, helpText, }) {
    const handleChange = (experience) => {
        onChange(experience);
    };
    const options = [
        {
            value: Experience.GOOD,
            icon: _jsx(IconGood, {}),
        },
        {
            value: Experience.NEUTRAL,
            icon: _jsx(IconNeutral, {}),
        },
        {
            value: Experience.BAD,
            icon: _jsx(IconBad, {}),
        },
    ];
    return (_jsx(ExperienceControlBase, { label: label, helpText: helpText, children: options.map((option) => (_jsx(ExperienceControlOption, { className: `is-${option.value}`, isSelected: selectedExperience === option.value, onClick: () => handleChange(option.value), children: option.icon }, option.value))) }));
}
ExperienceControl.Base = ExperienceControlBase;
ExperienceControl.Option = ExperienceControlOption;
export default ExperienceControl;
//# sourceMappingURL=index.js.map