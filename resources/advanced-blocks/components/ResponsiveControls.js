import React, { useState } from 'react';
import { __ } from '@wordpress/i18n';
import {
    PanelBody,
    ButtonGroup,
    Button,
    RangeControl,
    ColorPicker,
    ToggleControl,
    SelectControl,
    TextControl,
    __experimentalBoxControl as BoxControl,
    __experimentalUnitControl as UnitControl
} from '@wordpress/components';
import { desktop, tablet, mobile } from '@wordpress/icons';

const ResponsiveControls = ({ 
    attributes, 
    setAttributes, 
    controls = [], 
    title = __('Responsive Controls', 'cheephub'), 
    initialOpen = false 
}) => {
    const [activeDevice, setActiveDevice] = useState('desktop');

    const devices = [
        {
            key: 'desktop',
            label: __('Desktop', 'cheephub'),
            icon: desktop,
            breakpoint: 1024
        },
        {
            key: 'tablet',
            label: __('Tablet', 'cheephub'),
            icon: tablet,
            breakpoint: 768
        },
        {
            key: 'mobile',
            label: __('Mobile', 'cheephub'),
            icon: mobile,
            breakpoint: 480
        }
    ];

    const getAttributeValue = (attributeName) => {
        if (activeDevice === 'desktop') {
            return attributes[attributeName] || '';
        }
        
        const deviceAttribute = `${attributeName}${activeDevice.charAt(0).toUpperCase() + activeDevice.slice(1)}`;
        return attributes[deviceAttribute] || '';
    };

    const setAttributeValue = (attributeName, value) => {
        if (activeDevice === 'desktop') {
            setAttributes({ [attributeName]: value });
        } else {
            const deviceAttribute = `${attributeName}${activeDevice.charAt(0).toUpperCase() + activeDevice.slice(1)}`;
            setAttributes({ [deviceAttribute]: value });
        }
    };

    const renderControl = (control) => {
        const { type, label, attribute, min, max, step, options, help, ...rest } = control;
        
        const value = getAttributeValue(attribute);
        const onChange = (newValue) => setAttributeValue(attribute, newValue);

        switch (type) {
            case 'range':
                return (
                    <RangeControl
                        label={label}
                        value={value}
                        onChange={onChange}
                        min={min || 0}
                        max={max || 100}
                        step={step || 1}
                        help={help}
                        {...rest}
                    />
                );
            
            case 'unit':
                return (
                    <UnitControl
                        label={label}
                        value={value}
                        onChange={onChange}
                        help={help}
                        {...rest}
                    />
                );
            
            case 'color':
                return (
                    <ColorPicker
                        label={label}
                        color={value}
                        onChange={onChange}
                        {...rest}
                    />
                );
            
            case 'toggle':
                return (
                    <ToggleControl
                        label={label}
                        checked={value}
                        onChange={onChange}
                        help={help}
                        {...rest}
                    />
                );
            
            case 'select':
                return (
                    <SelectControl
                        label={label}
                        value={value}
                        onChange={onChange}
                        options={options || []}
                        help={help}
                        {...rest}
                    />
                );
            
            case 'text':
                return (
                    <TextControl
                        label={label}
                        value={value}
                        onChange={onChange}
                        help={help}
                        {...rest}
                    />
                );
            
            case 'box':
                return (
                    <BoxControl
                        label={label}
                        values={value}
                        onChange={onChange}
                        help={help}
                        {...rest}
                    />
                );
            
            default:
                return null;
        }
    };

    const shouldShowControl = (control) => {
        // Show all controls for desktop
        if (activeDevice === 'desktop') {
            return true;
        }
        
        // For tablet/mobile, only show controls that have responsive variants
        return control.responsive !== false;
    };

    return (
        <PanelBody title={title} initialOpen={initialOpen}>
            <div className="cheephub-responsive-controls__device-selector">
                <ButtonGroup className="cheephub-responsive-controls__device-buttons">
                    {devices.map((device) => (
                        <Button
                            key={device.key}
                            isSmall
                            isPrimary={activeDevice === device.key}
                            onClick={() => setActiveDevice(device.key)}
                            icon={device.icon}
                            aria-label={device.label}
                            title={device.label}
                        />
                    ))}
                </ButtonGroup>
            </div>
            
            <div className="cheephub-responsive-controls__active-device">
                <span className="cheephub-responsive-controls__device-label">
                    {__('Editing for:', 'cheephub')} <strong>
                        {devices.find(d => d.key === activeDevice)?.label}
                    </strong>
                </span>
            </div>
            
            <div className="cheephub-responsive-controls__controls">
                {controls.filter(shouldShowControl).map((control, index) => (
                    <div key={index} className="cheephub-responsive-controls__control-item">
                        {renderControl(control)}
                    </div>
                ))}
            </div>
            
            {activeDevice !== 'desktop' && (
                <div className="cheephub-responsive-controls__device-help">
                    <p className="description">
                        {__('These settings will override desktop values on smaller screens.', 'cheephub')}
                    </p>
                </div>
            )}
        </PanelBody>
    );
};

export default ResponsiveControls;
