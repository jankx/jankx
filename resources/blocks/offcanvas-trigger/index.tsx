import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import {
    useBlockProps,
    InspectorControls
} from '@wordpress/block-editor';
import {
    PanelBody,
    TextControl,
    SelectControl,
    ColorPicker,
    RangeControl,
    Button
} from '@wordpress/components';
import { useState } from '@wordpress/element';

interface OffcanvasTriggerAttributes {
    targetSidebarId: string;
    animationSkin: string;
    barColor: string;
    barThickness: number;
    barWidth: number;
    barSpacing: number;
    displayOn: string;
    className?: string;
}

interface OffcanvasTriggerEditProps {
    attributes: OffcanvasTriggerAttributes;
    setAttributes: (attributes: Partial<OffcanvasTriggerAttributes>) => void;
}

// Animation skin options
const ANIMATION_SKIN_OPTIONS = [
    { label: __('Hamburger to X', 'jankx'), value: 'hamburger-to-x' },
    { label: __('Hamburger Expand', 'jankx'), value: 'hamburger-expand' },
    { label: __('Hamburger Arrow', 'jankx'), value: 'hamburger-arrow' },
    { label: __('Hamburger Spin', 'jankx'), value: 'hamburger-spin' },
    { label: __('Simple (No Animation)', 'jankx'), value: 'simple' }
];

// Display options
const DISPLAY_OPTIONS = [
    { label: __('All Devices', 'jankx'), value: 'all' },
    { label: __('Desktop Only', 'jankx'), value: 'desktop' },
    { label: __('Tablet & Below', 'jankx'), value: 'tablet-down' },
    { label: __('Mobile Only', 'jankx'), value: 'mobile' },
    { label: __('Tablet Only', 'jankx'), value: 'tablet' }
];

function OffcanvasTriggerEdit({ attributes, setAttributes }: OffcanvasTriggerEditProps): JSX.Element {
    const {
        targetSidebarId,
        animationSkin,
        barColor,
        barThickness,
        barWidth,
        barSpacing,
        displayOn,
        className
    } = attributes;

    const [isColorPickerOpen, setIsColorPickerOpen] = useState<boolean>(false);
    const [isActive, setIsActive] = useState<boolean>(false);

    const blockProps = useBlockProps({
        className: `offcanvas-trigger-block display-${displayOn} ${className || ''} editor-always-visible`
    });

    // Handle click in editor - toggle active state for preview
    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsActive(!isActive);
        // Also toggle sidebar in editor if available
        jQuery(e.target).parents('.is-root-container').toggleClass('sidebar-open');
    };

    // Render hamburger bars
    const renderHamburger = () => {
        const barStyle = {
            backgroundColor: barColor,
            height: `${barThickness}px`,
            width: `${barWidth}px`
        };

        const containerStyle: React.CSSProperties = {
            '--bar-spacing': `${barSpacing}px`,
            '--bar-thickness': `${barThickness}px`,
            '--bar-width': `${barWidth}px`,
            '--bar-color': barColor
        } as React.CSSProperties;

        return (
            <div
                className={`hamburger-container skin-${animationSkin} ${isActive ? 'active' : ''}`}
                style={containerStyle}
            >
                <span className="bar bar-top" style={barStyle}></span>
                <span className="bar bar-middle" style={barStyle}></span>
                <span className="bar bar-bottom" style={barStyle}></span>
            </div>
        );
    };

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Animation Settings', 'jankx')} initialOpen={true}>
                    <SelectControl
                        label={__('Animation Skin', 'jankx')}
                        value={animationSkin}
                        options={ANIMATION_SKIN_OPTIONS}
                        onChange={(value: string) => setAttributes({ animationSkin: value })}
                        help={__('Choose the animation style for the hamburger menu toggle.', 'jankx')}
                    />

                    <TextControl
                        label={__('Target Sidebar ID', 'jankx')}
                        value={targetSidebarId}
                        onChange={(value: string) => setAttributes({ targetSidebarId: value })}
                        help={__('Enter the ID of the offcanvas sidebar to trigger. Leave empty to trigger the first sidebar found.', 'jankx')}
                    />
                </PanelBody>

                <PanelBody title={__('Appearance', 'jankx')} initialOpen={false}>
                    <div className="color-control">
                        <label>{__('Bar Color', 'jankx')}</label>
                        <Button
                            variant="secondary"
                            onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}
                            style={{
                                backgroundColor: barColor,
                                color: '#fff',
                                width: '100%',
                                justifyContent: 'center',
                                marginTop: '8px'
                            }}
                        >
                            {barColor}
                        </Button>
                        {isColorPickerOpen && (
                            <div className="color-picker-popup" style={{ marginTop: '8px' }}>
                                <ColorPicker
                                    color={barColor}
                                    onChange={(color: string) => setAttributes({ barColor: color })}
                                />
                            </div>
                        )}
                    </div>

                    <RangeControl
                        label={__('Bar Thickness (px)', 'jankx')}
                        value={barThickness}
                        onChange={(value: number | undefined) => {
                            if (value !== undefined) {
                                setAttributes({ barThickness: value });
                            }
                        }}
                        min={1}
                        max={10}
                        step={1}
                    />

                    <RangeControl
                        label={__('Bar Width (px)', 'jankx')}
                        value={barWidth}
                        onChange={(value: number | undefined) => {
                            if (value !== undefined) {
                                setAttributes({ barWidth: value });
                            }
                        }}
                        min={20}
                        max={60}
                        step={1}
                    />

                    <RangeControl
                        label={__('Bar Spacing (px)', 'jankx')}
                        value={barSpacing}
                        onChange={(value: number | undefined) => {
                            if (value !== undefined) {
                                setAttributes({ barSpacing: value });
                            }
                        }}
                        min={3}
                        max={15}
                        step={1}
                        help={__('Distance between the bars.', 'jankx')}
                    />
                </PanelBody>

                <PanelBody title={__('Display Settings', 'jankx')} initialOpen={false}>
                    <SelectControl
                        label={__('Display On', 'jankx')}
                        value={displayOn}
                        options={DISPLAY_OPTIONS}
                        onChange={(value: string) => setAttributes({ displayOn: value })}
                        help={__('Control which devices this trigger button appears on. Note: The trigger is always visible in the editor for easy editing.', 'jankx')}
                    />
                </PanelBody>
            </InspectorControls>

            <div {...blockProps}>
                <button
                    className="offcanvas-trigger hamburger-trigger"
                    onClick={handleClick}
                    data-target-sidebar={targetSidebarId}
                    aria-label={__('Toggle menu', 'jankx')}
                >
                    {renderHamburger()}
                </button>
            </div>
        </>
    );
}

function OffcanvasTriggerSave(): null {
    return null; // Dynamic block
}

registerBlockType('jankx/offcanvas-trigger', {
    title: 'Offcanvas Trigger',
    category: 'widgets',
    attributes: {
        targetSidebarId: { type: 'string', default: '' },
        animationSkin: { type: 'string', default: 'hamburger-to-x' },
        barColor: { type: 'string', default: '#333333' },
        barThickness: { type: 'number', default: 3 },
        barWidth: { type: 'number', default: 30 },
        barSpacing: { type: 'number', default: 5 },
        displayOn: { type: 'string', default: 'all' },
        className: { type: 'string' }
    },
    edit: OffcanvasTriggerEdit,
    save: OffcanvasTriggerSave,
});
