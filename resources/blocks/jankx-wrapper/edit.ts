
import { JankxInspector } from '../../js/components/jankx-inspector/JankxInspector';
import { ResponsiveControl } from '../../js/components/jankx-inspector/ResponsiveControl';

const { useBlockProps, InnerBlocks, InspectorControls } = wp.blockEditor;
const { PanelBody, RangeControl, SelectControl } = wp.components;

export default function Edit({ attributes, setAttributes }: any) {
    const blockProps = useBlockProps({
        className: 'jankx-wrapper-block',
        style: {
            '--jankx-padding-desktop': attributes.paddingDesktop ? `${attributes.paddingDesktop}px` : undefined,
            '--jankx-padding-tablet': attributes.paddingTablet ? `${attributes.paddingTablet}px` : undefined,
            '--jankx-padding-mobile': attributes.paddingMobile ? `${attributes.paddingMobile}px` : undefined,
            '--jankx-margin-desktop': attributes.marginDesktop ? `${attributes.marginDesktop}px` : undefined,
            '--jankx-margin-tablet': attributes.marginTablet ? `${attributes.marginTablet}px` : undefined,
            '--jankx-margin-mobile': attributes.marginMobile ? `${attributes.marginMobile}px` : undefined,
        }
    });

    return (
        <>
        <InspectorControls>
        <JankxInspector
                    tabs= {
            [
            { name: 'general', title: 'Layout' },
            { name: 'responsive', title: 'Responsive' },
            { name: 'advanced', title: 'Advanced' }
            ]}
        >
        {(tab) => {
        if (tab.name === 'general') {
            return (
                <PanelBody title= "Basic Layout" initialOpen = { true} >
                    <SelectControl
                                        label="HTML Tag"
            value = { attributes.tagName }
            options = {
                [
                { label: 'div', value: 'div' },
                { label: 'section', value: 'section' },
                { label: 'article', value: 'article' },
                { label: 'aside', value: 'aside' },
                { label: 'main', value: 'main' }
                ]}
            onChange = {(tagName) => setAttributes({ tagName })
        }
                                    />
            </PanelBody>
                            );
    }
    if (tab.name === 'responsive') {
        return (
            <>
            <PanelBody title= "Padding" initialOpen = { true} >
                <ResponsiveControl label="Inner Space" >
                    {(device) => (
                        <RangeControl
                                                    value= { device === 'desktop' ? attributes.paddingDesktop : device === 'tablet' ? attributes.paddingTablet : attributes.paddingMobile
    }
    onChange = {(val) => {
        const key = device === 'desktop' ? 'paddingDesktop' : device === 'tablet' ? 'paddingTablet' : 'paddingMobile';
        setAttributes({ [key]: val });
    }
}
min = { 0}
max = { 200}
    />
                                            )}
</ResponsiveControl>
    </PanelBody>
    < PanelBody title = "Margin" initialOpen = { false} >
        <ResponsiveControl label="Outer Space" >
            {(device) => (
                <RangeControl
                                                    value= { device === 'desktop' ? attributes.marginDesktop : device === 'tablet' ? attributes.marginTablet : attributes.marginMobile}
onChange = {(val) => {
    const key = device === 'desktop' ? 'marginDesktop' : device === 'tablet' ? 'marginTablet' : 'marginMobile';
    setAttributes({ [key]: val });
}}
min = { 0}
max = { 200}
    />
                                            )}
</ResponsiveControl>
    </PanelBody>
    </>
                            );
                        }
return null;
                    }}
</JankxInspector>
    </InspectorControls>
    < div {...blockProps }>
        <InnerBlocks />
        </div>
        </>
    );
}
