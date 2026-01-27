import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, CheckboxControl, Placeholder } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import './editor.scss';

export default function Edit({ attributes, setAttributes, context }) {
    const { supportedLayouts } = attributes;
    const { postType, displayLayout } = context;

    const blockProps = useBlockProps({
        className: 'jankx-layout-switcher-edit'
    });

    // Get layouts from localized data
    const layoutsData = window.jankxDynamicDataLayouts || {
        layoutsByPostType: {},
        commonLayouts: {}
    };

    const availableLayouts = {
        ...layoutsData.commonLayouts,
        ...(layoutsData.layoutsByPostType[postType] || {})
    };

    const layoutOptions = Object.keys(availableLayouts).map(name => ({
        name,
        title: availableLayouts[name].title || name,
        icon: availableLayouts[name].icon || 'layout'
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
            <InspectorControls>
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
                <div className="jankx-layout-switcher">
                    <ul className="layout-options">
                        {layoutOptions.filter(l => supportedLayouts.includes(l.name)).map(layout => (
                            <li
                                key={layout.name}
                                className={`layout-option ${displayLayout === layout.name ? 'is-active' : ''}`}
                                title={layout.title}
                            >
                                <button type="button">
                                    <span className={`dashicons dashicons-${layout.icon.replace('dashicons-', '')}`}></span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
}
