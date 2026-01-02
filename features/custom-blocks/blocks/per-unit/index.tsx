import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, SelectControl } from '@wordpress/components';
import metadata from './block.json';
import './style.scss';

const Edit = ({ attributes, setAttributes }) => {
    const blockProps = useBlockProps();
    const { metaKey, customMetaKey, prefix, fallbackText } = attributes;

    return (
        <div {...blockProps}>
            <InspectorControls>
                <PanelBody title="Per Unit Settings">
                    <SelectControl
                        label="Meta Key"
                        value={metaKey}
                        options={[
                            { label: 'Unit', value: '_unit' },
                            { label: 'Custom', value: 'custom' },
                        ]}
                        onChange={(val) => setAttributes({ metaKey: val })}
                    />
                    {metaKey === 'custom' && (
                        <TextControl
                            label="Custom Meta Key"
                            value={customMetaKey}
                            onChange={(val) => setAttributes({ customMetaKey: val })}
                        />
                    )}
                    <TextControl
                        label="Prefix"
                        value={prefix}
                        onChange={(val) => setAttributes({ prefix: val })}
                    />
                    <TextControl
                        label="Fallback Text"
                        value={fallbackText}
                        onChange={(val) => setAttributes({ fallbackText: val })}
                    />
                </PanelBody>
            </InspectorControls>
            <div className="jankx-per-unit-placeholder">
                Per Unit: {prefix} {metaKey === 'custom' ? customMetaKey : metaKey}
            </div>
        </div>
    );
};

registerBlockType(metadata.name, {
    edit: Edit,
    save: () => null,
});
