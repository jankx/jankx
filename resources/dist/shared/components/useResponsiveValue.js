import { useState } from '@wordpress/element';
export function useResponsiveValue(initialValues = {}) {
    const [values, setValues] = useState({
        desktop: initialValues.desktop || 3,
        tablet: initialValues.tablet || 2,
        mobile: initialValues.mobile || 1,
    });
    const updateValue = (device, value) => {
        setValues(prev => ({
            ...prev,
            [device]: value
        }));
    };
    const updateValues = (newValues) => {
        setValues(prev => ({
            ...prev,
            ...newValues
        }));
    };
    const resetToDefaults = (defaults) => {
        setValues(defaults);
    };
    return {
        values,
        updateValue,
        updateValues,
        resetToDefaults
    };
}
