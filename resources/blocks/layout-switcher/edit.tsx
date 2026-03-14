import { useBlockProps, InspectorControls, BlockControls, AlignmentToolbar } from '@wordpress/block-editor';
import { PanelBody, CheckboxControl, Placeholder, SelectControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import './editor.scss';

interface LayoutSwitcherAttributes {
    supportedLayouts: string[];
    displayType: string;
    alignment: string;
}

interface LayoutSwitcherContext {
    postType?: string;
    displayLayout?: string;
    queryId?: string;
}

interface LayoutInfo {
    title?: string;
    icon?: string;
    [key: string]: any;
}

interface LayoutsData {
    layoutsByPostType: Record<string, any>;
    commonLayouts: any;
}

export default function Edit({
    attributes,
    setAttributes,
    context
}: {
    attributes: LayoutSwitcherAttributes;
    setAttributes: (attrs: Partial<LayoutSwitcherAttributes>) => void;
    context: LayoutSwitcherContext;
}) {
    const { supportedLayouts, displayType, alignment } = attributes;
    const { postType, displayLayout } = context;

    const blockProps = useBlockProps({
        className: `jankx-layout-switcher-edit layout-switcher--align-${alignment}`
    });

    // Get layouts from localized data
    const layoutsData = (window as any).jankxDynamicDataLayouts as LayoutsData || {
        layoutsByPostType: {},
        commonLayouts: {}
    };

    const layoutsByPostType = layoutsData.layoutsByPostType || {};
    const availableLayouts: Record<string, LayoutInfo> = {
        ...(layoutsData.commonLayouts || {}),
        ...(postType && layoutsByPostType[postType] ? layoutsByPostType[postType] : {})
    };

    const layoutOptions = Object.keys(availableLayouts).map(name => ({
        name,
        title: availableLayouts[name]?.title || name,
        icon: availableLayouts[name]?.icon || 'layout'
    }));

    const toggleLayout = (name) => {
        const newLayouts = supportedLayouts.includes(name)
            ? supportedLayouts.filter(l => l !== name)
            : [...supportedLayouts, name];
        setAttributes({ supportedLayouts: newLayouts });
    };

    if (!context.queryId) {
        return (
            <div {...blockProps}>
                <Placeholder
                    icon="layout"
                    label={__('Layout Switcher', 'jankx')}
                    instructions={__('Please place this block inside a Dynamic Data Layout block.', 'jankx')}
                />
            </div>
        );
    }

    return (
        <>
            <BlockControls>
                <AlignmentToolbar
                    value={alignment}
                    onChange={(val) => setAttributes({ alignment: val })}
                />
            </BlockControls>
            <InspectorControls>
                <PanelBody title={__('Display Settings', 'jankx')}>
                    <SelectControl
                        label={__('Display Type', 'jankx')}
                        value={displayType}
                        options={[
                            { label: __('Icons Only', 'jankx'), value: 'icons' },
                            { label: __('Labels Only', 'jankx'), value: 'labels' },
                            { label: __('Both', 'jankx'), value: 'both' }
                        ]}
                        onChange={(val) => setAttributes({ displayType: val })}
                    />
                </PanelBody>
                <PanelBody title={__('Supported Layouts', 'jankx')}>
                    {layoutOptions.map(layout => (
                        <CheckboxControl
                            key={layout.name}
                            label={layout.title}
                            checked={supportedLayouts.includes(layout.name)}
                            onChange={() => toggleLayout(layout.name)}
                        />
                    ))}
                </PanelBody>
            </InspectorControls>
            <div {...blockProps}>
                <div className={`jankx-layout-switcher layout-switcher--type-${displayType}`}>
                    <ul className="layout-options">
                        {layoutOptions.filter(l => supportedLayouts.includes(l.name)).map(layout => (
                            <li
                                key={layout.name}
                                className={`layout-option ${displayLayout === layout.name ? 'is-active' : ''}`}
                            >
                                <button type="button">
                                    {displayType !== 'labels' && (
                                        <span className={`layout-icon dashicons dashicons-${layout.icon.replace('dashicons-', '')}`}></span>
                                    )}
                                    {displayType !== 'icons' && (
                                        <span className="layout-label">{layout.title}</span>
                                    )}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
}
