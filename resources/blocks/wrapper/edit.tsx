
import { JankxInspector } from '../../js/components/jankx-inspector/JankxInspector';
import { ResponsiveControl } from '../../js/components/jankx-inspector/ResponsiveControl';
import { useBlockProps, InnerBlocks, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, RangeControl, SelectControl, ToggleControl, TextControl } from '@wordpress/components';

export default function Edit({ attributes, setAttributes }: any) {
    const blockProps = useBlockProps({
        className: 'jankx-wrapper-block',
        style: {
            '--jankx-padding-ultrawide': attributes.paddingUltrawide ? `${attributes.paddingUltrawide}px` : undefined,
            '--jankx-padding-desktop': attributes.paddingDesktop ? `${attributes.paddingDesktop}px` : undefined,
            '--jankx-padding-tablet': attributes.paddingTablet ? `${attributes.paddingTablet}px` : undefined,
            '--jankx-padding-mobile': attributes.paddingMobile ? `${attributes.paddingMobile}px` : undefined,
            '--jankx-margin-ultrawide': attributes.marginUltrawide ? `${attributes.marginUltrawide}px` : undefined,
            '--jankx-margin-desktop': attributes.marginDesktop ? `${attributes.marginDesktop}px` : undefined,
            '--jankx-margin-tablet': attributes.marginTablet ? `${attributes.marginTablet}px` : undefined,
            '--jankx-margin-mobile': attributes.marginMobile ? `${attributes.marginMobile}px` : undefined,
            '--jankx-max-width': attributes.maxWidth || undefined,
        } as any
    });

    return (
        <div {...blockProps}>
            <InspectorControls>
                <JankxInspector
                    tabs={[
                        { name: 'general', title: 'Layout' },
                        { name: 'responsive', title: 'Responsive' },
                        { name: 'advanced', title: 'Advanced' }
                    ]}
                >
                    {(tab) => {
                        if (tab.name === 'general') {
                            return (
                                <PanelBody title="Basic Layout" initialOpen={true}>
                                    <SelectControl
                                        label="HTML Tag"
                                        value={attributes.tagName}
                                        options={[
                                            { label: 'div', value: 'div' },
                                            { label: 'section', value: 'section' },
                                            { label: 'article', value: 'article' },
                                            { label: 'aside', value: 'aside' },
                                            { label: 'main', value: 'main' }
                                        ]}
                                        onChange={(tagName) => setAttributes({ tagName })}
                                    />
                                    <TextControl
                                        label="Max Width"
                                        value={attributes.maxWidth || ''}
                                        placeholder="e.g. 1200px, 80rem, 100%"
                                        help="Set the max-width of this wrapper. Leave empty for no restriction."
                                        onChange={(maxWidth) => setAttributes({ maxWidth: maxWidth || undefined })}
                                    />
                                </PanelBody>
                            );
                        }
                        if (tab.name === 'responsive') {
                            return (
                                <>
                                    <PanelBody title="Padding" initialOpen={true}>
                                    <ResponsiveControl label="Inner Space">
                                        {(device) => (
                                            <RangeControl
                                                value={device === 'ultrawide' ? attributes.paddingUltrawide : device === 'desktop' ? attributes.paddingDesktop : device === 'tablet' ? attributes.paddingTablet : attributes.paddingMobile}
                                                onChange={(val) => {
                                                    const key = device === 'ultrawide' ? 'paddingUltrawide' : device === 'desktop' ? 'paddingDesktop' : device === 'tablet' ? 'paddingTablet' : 'paddingMobile';
                                                    setAttributes({ [key]: val });
                                                }}
                                                min={0}
                                                max={200}
                                            />
                                        )}
                                    </ResponsiveControl>
                                    </PanelBody>
                                    <PanelBody title="Margin" initialOpen={false}>
                                        <ResponsiveControl label="Outer Space">
                                            {(device) => (
                                                <RangeControl
                                                    value={device === 'ultrawide' ? attributes.marginUltrawide : device === 'desktop' ? attributes.marginDesktop : device === 'tablet' ? attributes.marginTablet : attributes.marginMobile}
                                                    onChange={(val) => {
                                                        const key = device === 'ultrawide' ? 'marginUltrawide' : device === 'desktop' ? 'marginDesktop' : device === 'tablet' ? 'marginTablet' : 'marginMobile';
                                                        setAttributes({ [key]: val });
                                                    }}
                                                    min={0}
                                                    max={200}
                                                />
                                            )}
                                        </ResponsiveControl>
                                    </PanelBody>
                                    <PanelBody title="Visibility" initialOpen={false}>
                                        <ToggleControl
                                            label="Hide on Ultrawide"
                                            checked={attributes.hideOnUltrawide}
                                            onChange={(hideOnUltrawide) => setAttributes({ hideOnUltrawide })}
                                        />
                                        <ToggleControl
                                            label="Hide on Desktop"
                                            checked={attributes.hideOnDesktop}
                                            onChange={(hideOnDesktop) => setAttributes({ hideOnDesktop })}
                                        />
                                        <ToggleControl
                                            label="Hide on Tablet"
                                            checked={attributes.hideOnTablet}
                                            onChange={(hideOnTablet) => setAttributes({ hideOnTablet })}
                                        />
                                        <ToggleControl
                                            label="Hide on Mobile"
                                            checked={attributes.hideOnMobile}
                                            onChange={(hideOnMobile) => setAttributes({ hideOnMobile })}
                                        />
                                    </PanelBody>
                                    <PanelBody title="Utilities" initialOpen={false}>
                                        <SelectControl
                                            label="Render Mode"
                                            value={attributes.renderMode}
                                            options={[
                                                { label: 'Dynamic (SSR)', value: 'dynamic' },
                                                { label: 'Static (CSR)', value: 'static' }
                                            ]}
                                            onChange={(renderMode) => setAttributes({ renderMode })}
                                            help="Choose how this block should be rendered."
                                        />
                                    </PanelBody>
                                </>
                            );
                        }
                        return null;
                    }}
                </JankxInspector>
            </InspectorControls>
            <InnerBlocks
                __experimentalLayout={{
                    type: 'constrained',
                    contentSize: attributes.maxWidth || undefined,
                }}
            />
        </div>
    );
}
