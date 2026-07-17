
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl, Placeholder } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { wordpress as wordpressIcon } from '@wordpress/icons';

export default function Edit({ attributes, setAttributes }: any) {
    const blockProps = useBlockProps({
        className: 'jankx-wordpress-legacy-editor'
    });

    const legacyOptions = [
        { label: __('None', 'jankx'), value: 'none' },
        { label: __('Recent Comments', 'jankx'), value: 'recent_comments' },
        { label: __('Categories List (Legacy)', 'jankx'), value: 'categories' },
        { label: __('Archives', 'jankx'), value: 'archives' },
        { label: __('Pagination (Legacy)', 'jankx'), value: 'pagination' },
        { label: __('Meta (Login/RSS)', 'jankx'), value: 'meta' }
    ];

    return (
        <div {...blockProps}>
            <InspectorControls>
                <PanelBody title={__('Legacy Settings', 'jankx')}>
                    <SelectControl
                        label={__('Feature Type', 'jankx')}
                        value={attributes.legacyType}
                        options={legacyOptions}
                        onChange={(legacyType) => setAttributes({ legacyType })}
                    />
                </PanelBody>
            </InspectorControls>

            {attributes.legacyType === 'none' ? (
                <Placeholder
                    icon={wordpressIcon}
                    label={__('WordPress Legacy', 'jankx')}
                    instructions={__('Select a legacy feature to handle intelligently.', 'jankx')}
                />
            ) : (
                <div className="legacy-preview">
                    <strong>{__('Legacy Feature:', 'jankx')}</strong> {attributes.legacyType}
                    <p style={{ fontSize: '12px', opacity: 0.7 }}>
                        {__('This will be rendered on the frontend using core WordPress functions without loading global style.css.', 'jankx')}
                    </p>
                </div>
            )}
        </div>
    );
}
