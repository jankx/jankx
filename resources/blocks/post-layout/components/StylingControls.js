import { __ } from '@wordpress/i18n';
import { PanelBody, SelectControl, RangeControl, ToggleControl, ButtonGroup, Button } from '@wordpress/components';
import { desktop, tablet, mobile } from '@wordpress/icons';

export default function StylingControls({ styling, responsive, onUpdate }) {
    const updateStyling = (updates) => {
        onUpdate('styling', { ...styling, ...updates });
    };

    const updateResponsive = (updates) => {
        onUpdate('responsive', { ...responsive, ...updates });
    };

    const viewTypeOptions = [
        { label: __('Grid', 'jankx'), value: 'grid' },
        { label: __('List', 'jankx'), value: 'list' },
        { label: __('Card', 'jankx'), value: 'card' },
        { label: __('Masonry', 'jankx'), value: 'masonry' },
        { label: __('Carousel', 'jankx'), value: 'carousel' },
        { label: __('Timeline', 'jankx'), value: 'timeline' },
        { label: __('Magazine', 'jankx'), value: 'magazine' },
        { label: __('Portfolio', 'jankx'), value: 'portfolio' },
        { label: __('Blog', 'jankx'), value: 'blog' }
    ];

    const hoverEffectOptions = [
        { label: __('None', 'jankx'), value: 'none' },
        { label: __('Lift', 'jankx'), value: 'lift' },
        { label: __('Scale', 'jankx'), value: 'scale' },
        { label: __('Glow', 'jankx'), value: 'glow' },
        { label: __('Slide', 'jankx'), value: 'slide' },
        { label: __('Rotate', 'jankx'), value: 'rotate' }
    ];

    const shadowOptions = [
        { label: __('None', 'jankx'), value: 'none' },
        { label: __('Small', 'jankx'), value: 'small' },
        { label: __('Medium', 'jankx'), value: 'medium' },
        { label: __('Large', 'jankx'), value: 'large' },
        { label: __('Extra Large', 'jankx'), value: 'xl' }
    ];

    return (
        <div className="jankx-styling-controls">
            <PanelBody title={__('Layout Styling', 'jankx')} initialOpen={true}>
                <SelectControl
                    label={__('View Type', 'jankx')}
                    value={styling.viewType}
                    options={viewTypeOptions}
                    onChange={(value) => updateStyling({ viewType: value })}
                    help={__('Choose the layout type for displaying posts', 'jankx')}
                />

                <SelectControl
                    label={__('Hover Effect', 'jankx')}
                    value={styling.hoverEffect}
                    options={hoverEffectOptions}
                    onChange={(value) => updateStyling({ hoverEffect: value })}
                    help={__('Animation effect when hovering over cards', 'jankx')}
                />

                <RangeControl
                    label={__('Border Radius', 'jankx')}
                    value={styling.borderRadius}
                    onChange={(value) => updateStyling({ borderRadius: value })}
                    min={0}
                    max={50}
                    step={1}
                    help={__('Corner roundness for cards (in pixels)', 'jankx')}
                />

                <SelectControl
                    label={__('Shadow', 'jankx')}
                    value={styling.shadow}
                    options={shadowOptions}
                    onChange={(value) => updateStyling({ shadow: value })}
                    help={__('Shadow depth for cards', 'jankx')}
                />
            </PanelBody>

            <PanelBody title={__('Responsive Controls', 'jankx')} initialOpen={false}>
                <ToggleControl
                    label={__('Enable Responsive Controls', 'jankx')}
                    checked={responsive.enabled}
                    onChange={(value) => updateResponsive({ enabled: value })}
                    help={__('Allow different styling for different screen sizes', 'jankx')}
                />

                {responsive.enabled && (
                    <div className="jankx-responsive-settings">
                        <div className="jankx-responsive-section">
                            <h5>{__('Desktop (≥1024px)', 'jankx')}</h5>
                            <p className="jankx-help-text">
                                {__('Default styling for large screens', 'jankx')}
                            </p>
                        </div>

                        <div className="jankx-responsive-section">
                            <h5>{__('Tablet (≤768px)', 'jankx')}</h5>
                            <p className="jankx-help-text">
                                {__('Styling adjustments for medium screens', 'jankx')}
                            </p>

                            <div className="jankx-responsive-controls">
                                <div className="jankx-responsive-control">
                                    <div className="jankx-responsive-label">
                                        <tablet.icon />
                                        <span>{__('Border Radius', 'jankx')}</span>
                                    </div>
                                    <RangeControl
                                        value={styling.borderRadiusTablet || styling.borderRadius}
                                        onChange={(value) => updateStyling({ borderRadiusTablet: value })}
                                        min={0}
                                        max={40}
                                        step={1}
                                    />
                                </div>

                                <div className="jankx-responsive-control">
                                    <div className="jankx-responsive-label">
                                        <tablet.icon />
                                        <span>{__('Shadow', 'jankx')}</span>
                                    </div>
                                    <SelectControl
                                        value={styling.shadowTablet || styling.shadow}
                                        options={shadowOptions}
                                        onChange={(value) => updateStyling({ shadowTablet: value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="jankx-responsive-section">
                            <h5>{__('Mobile (≤480px)', 'jankx')}</h5>
                            <p className="jankx-help-text">
                                {__('Styling adjustments for small screens', 'jankx')}
                            </p>

                            <div className="jankx-responsive-controls">
                                <div className="jankx-responsive-control">
                                    <div className="jankx-responsive-label">
                                        <mobile.icon />
                                        <span>{__('Border Radius', 'jankx')}</span>
                                    </div>
                                    <RangeControl
                                        value={styling.borderRadiusMobile || styling.borderRadius}
                                        onChange={(value) => updateStyling({ borderRadiusMobile: value })}
                                        min={0}
                                        max={30}
                                        step={1}
                                    />
                                </div>

                                <div className="jankx-responsive-control">
                                    <div className="jankx-responsive-label">
                                        <mobile.icon />
                                        <span>{__('Shadow', 'jankx')}</span>
                                    </div>
                                    <SelectControl
                                        value={styling.shadowMobile || styling.shadow}
                                        options={shadowOptions}
                                        onChange={(value) => updateStyling({ shadowMobile: value })}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </PanelBody>

            <PanelBody title={__('Advanced Styling', 'jankx')} initialOpen={false}>
                <div className="jankx-advanced-styling">
                    <h5>{__('Animation Settings', 'jankx')}</h5>
                    <p className="jankx-help-text">
                        {__('Control how elements animate and transition', 'jankx')}
                    </p>

                    <ToggleControl
                        label={__('Enable Animations', 'jankx')}
                        checked={styling.enableAnimations || false}
                        onChange={(value) => updateStyling({ enableAnimations: value })}
                        help={__('Add smooth animations to card interactions', 'jankx')}
                    />

                    {styling.enableAnimations && (
                        <RangeControl
                            label={__('Animation Duration', 'jankx')}
                            value={styling.animationDuration || 300}
                            onChange={(value) => updateStyling({ animationDuration: value })}
                            min={100}
                            max={1000}
                            step={50}
                            help={__('Animation speed in milliseconds', 'jankx')}
                        />
                    )}
                </div>

                <div className="jankx-performance">
                    <h5>{__('Performance Options', 'jankx')}</h5>
                    <p className="jankx-help-text">
                        {__('Optimize rendering performance', 'jankx')}
                    </p>

                    <ToggleControl
                        label={__('Lazy Loading', 'jankx')}
                        checked={styling.lazyLoading || false}
                        onChange={(value) => updateStyling({ lazyLoading: value })}
                        help={__('Load images only when they come into view', 'jankx')}
                    />

                    <ToggleControl
                        label={__('CSS Containment', 'jankx')}
                        checked={styling.cssContainment || false}
                        onChange={(value) => updateStyling({ cssContainment: value })}
                        help={__('Improve rendering performance with CSS containment', 'jankx')}
                    />
                </div>
            </PanelBody>
        </div>
    );
}
