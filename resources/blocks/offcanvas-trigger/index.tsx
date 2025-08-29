import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import {
    useBlockProps,
    InspectorControls,
    RichText
} from '@wordpress/block-editor';
import {
    PanelBody,
    TextControl,
    SelectControl,
    ToggleControl,
    ColorPicker,
    RangeControl,
    Button
} from '@wordpress/components';
import { useState } from '@wordpress/element';
import {
    menu,
    home,
    info,
    cog,
    envelope,
    plus,
    trash
} from '@wordpress/icons';

interface OffcanvasTriggerAttributes {
    triggerText: string;
    triggerIcon: string;
    targetSidebarId: string;
    buttonStyle: string;
    buttonSize: string;
    backgroundColor: string;
    textColor: string;
    borderRadius: string;
    showIcon: boolean;
    showText: boolean;
    className?: string;
}

interface OffcanvasTriggerEditProps {
    attributes: OffcanvasTriggerAttributes;
    setAttributes: (attributes: Partial<OffcanvasTriggerAttributes>) => void;
}

// Icon options
const ICON_OPTIONS = [
    { label: 'Menu', value: 'menu' },
    { label: 'Home', value: 'home' },
    { label: 'Info', value: 'info' },
    { label: 'Cog', value: 'cog' },
    { label: 'Email', value: 'email' },
    { label: 'User', value: 'user' },
    { label: 'Search', value: 'search' },
    { label: 'Settings', value: 'settings' },
    { label: 'Heart', value: 'heart' },
    { label: 'Star', value: 'star' }
];

// Button style options
const BUTTON_STYLE_OPTIONS = [
    { label: 'Default', value: 'default' },
    { label: 'Outline', value: 'outline' },
    { label: 'Ghost', value: 'ghost' },
    { label: 'Rounded', value: 'rounded' },
    { label: 'Pill', value: 'pill' }
];

// Button size options
const BUTTON_SIZE_OPTIONS = [
    { label: 'Small', value: 'small' },
    { label: 'Medium', value: 'medium' },
    { label: 'Large', value: 'large' }
];

function OffcanvasTriggerEdit({ attributes, setAttributes }: OffcanvasTriggerEditProps): JSX.Element {
    const {
        triggerText,
        triggerIcon,
        targetSidebarId,
        buttonStyle,
        buttonSize,
        backgroundColor,
        textColor,
        borderRadius,
        showIcon,
        showText,
        className
    } = attributes;

    const [isColorPickerOpen, setIsColorPickerOpen] = useState<boolean>(false);
    const [isTextColorPickerOpen, setIsTextColorPickerOpen] = useState<boolean>(false);

    const blockProps = useBlockProps({
        className: `offcanvas-trigger-block ${className || ''}`
    });

    // Get icon component
    const getIconComponent = (iconName: string) => {
        const iconMap: { [key: string]: any } = {
            menu,
            home,
            info,
            cog,
            envelope
        };
        return iconMap[iconName] || menu;
    };

    // Button styles
    const getButtonStyles = () => {
        const baseStyles = {
            backgroundColor: buttonStyle === 'outline' || buttonStyle === 'ghost' ? 'transparent' : backgroundColor,
            color: textColor,
            border: buttonStyle === 'outline' ? `2px solid ${backgroundColor}` : 'none',
            borderRadius: borderRadius,
            padding: buttonSize === 'small' ? '8px 12px' : buttonSize === 'large' ? '16px 24px' : '12px 16px',
            fontSize: buttonSize === 'small' ? '14px' : buttonSize === 'large' ? '18px' : '16px',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            textDecoration: 'none',
            transition: 'all 0.3s ease'
        };

        return baseStyles;
    };

    // Handle click in editor
    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        // In editor, just show a message
        jQuery(e.target).parents('.is-root-container').toggleClass('sidebar-open');
    };

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Trigger Settings', 'jankx')} initialOpen={true}>
                    <TextControl
                        label={__('Button Text', 'jankx')}
                        value={triggerText}
                        onChange={(value: string) => setAttributes({ triggerText: value })}
                    />

                    <SelectControl
                        label={__('Button Icon', 'jankx')}
                        value={triggerIcon}
                        options={ICON_OPTIONS}
                        onChange={(value: string) => setAttributes({ triggerIcon: value })}
                    />

                    <TextControl
                        label={__('Target Sidebar ID', 'jankx')}
                        value={targetSidebarId}
                        onChange={(value: string) => setAttributes({ targetSidebarId: value })}
                        help={__('Enter the ID of the offcanvas sidebar to trigger. Leave empty to trigger the first sidebar found.', 'jankx')}
                    />

                    <ToggleControl
                        label={__('Show Icon', 'jankx')}
                        checked={showIcon}
                        onChange={(value: boolean) => setAttributes({ showIcon: value })}
                    />

                    <ToggleControl
                        label={__('Show Text', 'jankx')}
                        checked={showText}
                        onChange={(value: boolean) => setAttributes({ showText: value })}
                    />
                </PanelBody>

                <PanelBody title={__('Button Style', 'jankx')} initialOpen={false}>
                    <SelectControl
                        label={__('Button Style', 'jankx')}
                        value={buttonStyle}
                        options={BUTTON_STYLE_OPTIONS}
                        onChange={(value: string) => setAttributes({ buttonStyle: value })}
                    />

                    <SelectControl
                        label={__('Button Size', 'jankx')}
                        value={buttonSize}
                        options={BUTTON_SIZE_OPTIONS}
                        onChange={(value: string) => setAttributes({ buttonSize: value })}
                    />

                    <div className="color-controls">
                        <div className="color-control">
                            <Button
                                variant="secondary"
                                onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}
                                style={{ backgroundColor: backgroundColor, color: textColor }}
                            >
                                {__('Background Color', 'jankx')}
                            </Button>
                            {isColorPickerOpen && (
                                <div className="color-picker-popup">
                                    <ColorPicker
                                        color={backgroundColor}
                                        onChange={(color: string) => setAttributes({ backgroundColor: color })}
                                    />
                                </div>
                            )}
                        </div>

                        <div className="color-control">
                            <Button
                                variant="secondary"
                                onClick={() => setIsTextColorPickerOpen(!isTextColorPickerOpen)}
                                style={{ backgroundColor: textColor, color: backgroundColor }}
                            >
                                {__('Text Color', 'jankx')}
                            </Button>
                            {isTextColorPickerOpen && (
                                <div className="color-picker-popup">
                                    <ColorPicker
                                        color={textColor}
                                        onChange={(color: string) => setAttributes({ textColor: color })}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <RangeControl
                        label={__('Border Radius', 'jankx')}
                        value={parseInt(borderRadius)}
                        onChange={(value: number | undefined) => {
                            if (value !== undefined) {
                                setAttributes({ borderRadius: `${value}px` });
                            }
                        }}
                        min={0}
                        max={50}
                        step={1}
                    />
                </PanelBody>
            </InspectorControls>

            <div {...blockProps}>
                <button
                    className={`offcanvas-trigger style-${buttonStyle} size-${buttonSize}`}
                    style={getButtonStyles()}
                    onClick={handleClick}
                    data-target-sidebar={targetSidebarId}
                >
                    {showIcon && getIconComponent(triggerIcon) && (
                        <span className="trigger-icon">
                            {getIconComponent(triggerIcon)}
                        </span>
                    )}
                    {showText && (
                        <span className="trigger-text">{triggerText}</span>
                    )}
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
        triggerText: { type: 'string', default: 'Menu' },
        triggerIcon: { type: 'string', default: 'menu' },
        targetSidebarId: { type: 'string', default: '' },
        buttonStyle: { type: 'string', default: 'default' },
        buttonSize: { type: 'string', default: 'medium' },
        backgroundColor: { type: 'string', default: '#48a770' },
        textColor: { type: 'string', default: '#ffffff' },
        borderRadius: { type: 'string', default: '4px' },
        showIcon: { type: 'boolean', default: true },
        showText: { type: 'boolean', default: true },
        className: { type: 'string' }
    },
    edit: OffcanvasTriggerEdit,
    save: OffcanvasTriggerSave,
});
