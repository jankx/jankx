import { registerBlockType } from '@wordpress/blocks';
import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { InspectorControls, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { PanelBody, SelectControl, Button, ColorPicker, RangeControl, ToggleControl } from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import metadata from '../block.json';
import Edit from './edit';
import Save from './save';
import './style.scss';

const isInsideDecoration = (select: any, clientId: string): boolean => {
    const editor = select('core/block-editor');
    return (editor.getBlockParents(clientId) || []).some((parentId: string) => editor.getBlock(parentId)?.name === metadata.name);
};

registerBlockType(metadata.name, {
    ...metadata,
    edit: Edit,
    save: Save,
} as any);

addFilter('blocks.registerBlockType', 'jankx/site-decoration-child-attribute', (settings: any) => ({
    ...settings,
    attributes: {
        ...(settings.attributes || {}),
        jankxDecoration: { type: 'object', default: undefined },
    },
}));

const getDecorationProps = (attributes: any): { className?: string; style?: Record<string, string | number> } => {
    const decoration = attributes?.jankxDecoration;
    if (!decoration) {
        return {};
    }

    const classes = ['jankx-decoration-child'];
    if (decoration.underlineStyle && decoration.underlineStyle !== 'none') {
        classes.push(`jankx-decoration-child--underline-${decoration.underlineStyle}`);
    }
    if (decoration.afterEnabled) {
        classes.push(`jankx-decoration-child--after-${decoration.afterPosition || 'bottom'}`);
        classes.push(`jankx-decoration-child--after-layer-${decoration.afterLayer || 'behind'}`);
    }
    if (decoration.entranceEffect && decoration.entranceEffect !== 'none') {
        classes.push(`jankx-decoration-child--entrance-${decoration.entranceEffect}`);
    }
    if (decoration.hoverEffect && decoration.hoverEffect !== 'none') {
        classes.push(`jankx-decoration-child--hover-${decoration.hoverEffect}`);
    }

    return {
        className: classes.join(' '),
        style: {
            '--jankx-decoration-underline-color': decoration.underlineColor || undefined,
            '--jankx-decoration-underline-width': `${decoration.underlineWidth || 48}px`,
            '--jankx-decoration-after-color': decoration.afterColor || undefined,
            '--jankx-decoration-after-image': decoration.afterImage ? `url(${decoration.afterImage})` : undefined,
            '--jankx-decoration-after-size': decoration.afterSize || 'auto',
            '--jankx-decoration-after-opacity': decoration.afterOpacity ?? 1,
            '--jankx-decoration-after-height': `${decoration.afterHeight || 72}px`,
            '--jankx-decoration-after-z-index': decoration.afterLayer === 'front' ? 1 : -1,
            '--jankx-decoration-effect-duration': `${decoration.effectDuration || 500}ms`,
            '--jankx-decoration-effect-delay': `${decoration.effectDelay || 0}ms`,
        },
    };
};

addFilter(
    'blocks.getSaveContent.extraProps',
    'jankx/site-decoration-child-props',
    (extraProps: any, blockType: any, attributes: any) => {
        const props = getDecorationProps(attributes);
        if (!props.className) {
            return extraProps;
        }
        return {
            ...extraProps,
            className: `${extraProps.className || ''} ${props.className}`.trim(),
            style: { ...(extraProps.style || {}), ...props.style },
        };
    }
);

const withDecorationEditorProps = createHigherOrderComponent((BlockListBlock: any) => (props: any) => {
    const decorationProps = getDecorationProps(props.attributes);
    if (!decorationProps.className) {
        return <BlockListBlock {...props} />;
    }

    return (
        <BlockListBlock
            {...props}
            className={`${props.className || ''} ${decorationProps.className}`.trim()}
            wrapperProps={{
                ...(props.wrapperProps || {}),
                style: { ...(props.wrapperProps?.style || {}), ...decorationProps.style },
            }}
        />
    );
}, 'withDecorationEditorProps');

addFilter('editor.BlockListBlock', 'jankx/site-decoration-child-editor-props', withDecorationEditorProps);

const withDecorationControls = createHigherOrderComponent((BlockEdit: any) => (props: any) => {
    const insideDecoration = useSelect((select: any) => isInsideDecoration(select, props.clientId), [props.clientId]);
    const { updateBlockAttributes } = useDispatch('core/block-editor') as any;
    if (!insideDecoration) {
        return <BlockEdit {...props} />;
    }

    const decoration = props.attributes?.jankxDecoration || {};
    const updateDecoration = (changes: Record<string, unknown>) => updateBlockAttributes(props.clientId, {
        jankxDecoration: { ...decoration, ...changes },
    });

    return (
        <>
            <BlockEdit {...props} />
            <InspectorControls>
                <PanelBody title={__('Site decoration', 'jankx')} initialOpen>
                    <p>{__('Customize this block independently. Combine any options below.', 'jankx')}</p>
                </PanelBody>
                <PanelBody title={__('Heading underline', 'jankx')} initialOpen>
                    <SelectControl
                        label={__('Style', 'jankx')}
                        value={decoration.underlineStyle || 'none'}
                        options={[
                            { label: __('None', 'jankx'), value: 'none' },
                            { label: __('Solid', 'jankx'), value: 'solid' },
                            { label: __('Double', 'jankx'), value: 'double' },
                            { label: __('Dotted', 'jankx'), value: 'dotted' },
                            { label: __('Ornament', 'jankx'), value: 'ornament' },
                        ]}
                        onChange={(value) => updateDecoration({ underlineStyle: value })}
                    />
                    {decoration.underlineStyle && decoration.underlineStyle !== 'none' && <>
                        <RangeControl label={__('Width', 'jankx')} value={decoration.underlineWidth || 48} min={12} max={240} onChange={(value) => updateDecoration({ underlineWidth: value || 48 })} />
                        <ColorPicker color={decoration.underlineColor || '#d9a441'} onChangeComplete={(value) => updateDecoration({ underlineColor: value.hex })} disableAlpha />
                    </>}
                </PanelBody>
                <PanelBody title={__('After ornament background', 'jankx')} initialOpen={false}>
                    <ToggleControl label={__('Enable ornament', 'jankx')} checked={!!decoration.afterEnabled} onChange={(value) => updateDecoration({ afterEnabled: value })} />
                    {decoration.afterEnabled && <>
                        <ColorPicker color={decoration.afterColor || '#d9a441'} onChangeComplete={(value) => updateDecoration({ afterColor: value.hex })} disableAlpha />
                        <MediaUploadCheck>
                            <MediaUpload
                                allowedTypes={['image']}
                                value={0}
                                onSelect={(media: any) => updateDecoration({ afterImage: media.url })}
                                render={({ open }: { open: () => void }) => <Button variant="secondary" onClick={open}>{decoration.afterImage ? __('Replace background image', 'jankx') : __('Choose background image', 'jankx')}</Button>}
                            />
                        </MediaUploadCheck>
                        {decoration.afterImage && <Button isDestructive variant="link" onClick={() => updateDecoration({ afterImage: '' })}>{__('Remove image', 'jankx')}</Button>}
                        <SelectControl label={__('Image size', 'jankx')} value={decoration.afterSize || 'auto'} options={[{ label: __('Original', 'jankx'), value: 'auto' }, { label: __('Cover', 'jankx'), value: 'cover' }, { label: __('Contain', 'jankx'), value: 'contain' }]} onChange={(value) => updateDecoration({ afterSize: value })} />
                        <RangeControl label={__('Opacity', 'jankx')} value={decoration.afterOpacity ?? 1} min={0} max={1} step={0.05} onChange={(value) => updateDecoration({ afterOpacity: value ?? 1 })} />
                        <RangeControl label={__('Height', 'jankx')} value={decoration.afterHeight || 72} min={8} max={300} onChange={(value) => updateDecoration({ afterHeight: value || 72 })} />
                        <SelectControl label={__('Position', 'jankx')} value={decoration.afterPosition || 'bottom'} options={[{ label: __('Top', 'jankx'), value: 'top' }, { label: __('Bottom', 'jankx'), value: 'bottom' }]} onChange={(value) => updateDecoration({ afterPosition: value })} />
                        <ToggleControl label={__('Place in front', 'jankx')} checked={decoration.afterLayer === 'front'} onChange={(value) => updateDecoration({ afterLayer: value ? 'front' : 'behind' })} />
                    </>}
                </PanelBody>
                <PanelBody title={__('Effects', 'jankx')} initialOpen={false}>
                    <SelectControl label={__('Entrance effect', 'jankx')} value={decoration.entranceEffect || 'none'} options={[{ label: __('None', 'jankx'), value: 'none' }, { label: __('Fade up', 'jankx'), value: 'fade-up' }, { label: __('Fade down', 'jankx'), value: 'fade-down' }, { label: __('Zoom in', 'jankx'), value: 'zoom-in' }, { label: __('Reveal', 'jankx'), value: 'reveal' }]} onChange={(value) => updateDecoration({ entranceEffect: value })} />
                    <SelectControl label={__('Hover effect', 'jankx')} value={decoration.hoverEffect || 'none'} options={[{ label: __('None', 'jankx'), value: 'none' }, { label: __('Lift', 'jankx'), value: 'lift' }, { label: __('Glow', 'jankx'), value: 'glow' }, { label: __('Underline', 'jankx'), value: 'underline' }]} onChange={(value) => updateDecoration({ hoverEffect: value })} />
                    <RangeControl label={__('Duration (ms)', 'jankx')} value={decoration.effectDuration || 500} min={100} max={2000} step={50} onChange={(value) => updateDecoration({ effectDuration: value || 500 })} />
                    <RangeControl label={__('Delay (ms)', 'jankx')} value={decoration.effectDelay || 0} min={0} max={2000} step={50} onChange={(value) => updateDecoration({ effectDelay: value || 0 })} />
                </PanelBody>
                <PanelBody title={__('Reset', 'jankx')} initialOpen={false}>
                    <Button isDestructive onClick={() => updateBlockAttributes(props.clientId, { jankxDecoration: undefined })}>{__('Remove all decoration', 'jankx')}</Button>
                </PanelBody>
            </InspectorControls>
        </>
    );
}, 'withDecorationControls');

addFilter('editor.BlockEdit', 'jankx/site-decoration-child-controls', withDecorationControls);
