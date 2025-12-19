import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { __ } from "@wordpress/i18n";
const MarkerOptions = ({ selectedMarker, onMarkerChange, textDomain }) => {
    const markerOptions = [
        {
            name: 'text-marker',
            label: __('Default Marker', textDomain),
            className: 'jankx-text-marker'
        },
        {
            name: 'marker-uneven',
            label: __('Uneven Style', textDomain),
            className: 'jankx-marker-uneven'
        },
        {
            name: 'marker-thick',
            label: __('Thick Style', textDomain),
            className: 'jankx-marker-thick'
        },
        {
            name: 'marker-messy',
            label: __('Messy Style', textDomain),
            className: 'jankx-marker-messy'
        },
        {
            name: 'marker-double',
            label: __('Double Style', textDomain),
            className: 'jankx-marker-double'
        },
        {
            name: 'marker-faded',
            label: __('Faded Style', textDomain),
            className: 'jankx-marker-faded'
        },
        {
            name: 'marker-wavy',
            label: __('Wavy Style', textDomain),
            className: 'jankx-marker-wavy'
        },
        {
            name: 'marker-textured',
            label: __('Textured Style', textDomain),
            className: 'jankx-marker-textured'
        }
    ];
    return (_jsx("div", { className: "jankx-radio-gutenberg", children: markerOptions.map((option) => (_jsxs("label", { className: "jankx-radio-option", children: [_jsx("input", { type: "radio", name: "textMarker", value: option.name, checked: selectedMarker === option.name, onChange: (e) => onMarkerChange(e.target.value, option.className) }), _jsxs("div", { className: "jankx-radio-content", children: [_jsx("span", { className: "jankx-radio-label", children: option.label }), _jsx("span", { className: `jankx-radio-preview ${option.className}`, children: __('Sample Text', textDomain) })] })] }, option.name))) }));
};
export default MarkerOptions;
