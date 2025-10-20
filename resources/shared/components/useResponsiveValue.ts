import { useState } from '@wordpress/element';
import { ResponsiveValue } from './ResponsiveControl';

export interface UseResponsiveValueOptions {
    desktop?: number;
    tablet?: number;
    mobile?: number;
}

export interface UseResponsiveValueReturn {
    values: ResponsiveValue;
    updateValue: (device: keyof ResponsiveValue, value: number) => void;
    updateValues: (values: Partial<ResponsiveValue>) => void;
    resetToDefaults: (defaults: ResponsiveValue) => void;
}

export function useResponsiveValue(
    initialValues: UseResponsiveValueOptions = {}
): UseResponsiveValueReturn {
    const [values, setValues] = useState<ResponsiveValue>({
        desktop: initialValues.desktop || 3,
        tablet: initialValues.tablet || 2,
        mobile: initialValues.mobile || 1,
    });

    const updateValue = (device: keyof ResponsiveValue, value: number) => {
        setValues(prev => ({
            ...prev,
            [device]: value
        }));
    };

    const updateValues = (newValues: Partial<ResponsiveValue>) => {
        setValues(prev => ({
            ...prev,
            ...newValues
        }));
    };

    const resetToDefaults = (defaults: ResponsiveValue) => {
        setValues(defaults);
    };

    return {
        values,
        updateValue,
        updateValues,
        resetToDefaults
    };
}
