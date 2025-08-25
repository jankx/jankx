import { __ } from '@wordpress/i18n';
import { PanelBody, ToggleControl, RangeControl, CheckboxControl } from '@wordpress/components';

export default function DisplayOptions({ displayOptions, onUpdate }) {
    const updateDisplayOptions = (updates) => {
        onUpdate('displayOptions', { ...displayOptions, ...updates });
    };

    const metaFieldOptions = [
        { label: __('Date', 'jankx'), value: 'date' },
        { label: __('Author', 'jankx'), value: 'author' },
        { label: __('Categories', 'jankx'), value: 'categories' },
        { label: __('Tags', 'jankx'), value: 'tags' },
        { label: __('Comments Count', 'jankx'), value: 'comments' },
        { label: __('Reading Time', 'jankx'), value: 'reading_time' },
        { label: __('Custom Fields', 'jankx'), value: 'custom_fields' }
    ];

    const updateMetaFields = (field, checked) => {
        const currentFields = [...displayOptions.metaFields];
        if (checked && !currentFields.includes(field)) {
            currentFields.push(field);
        } else if (!checked && currentFields.includes(field)) {
            currentFields.splice(currentFields.indexOf(field), 1);
        }
        updateDisplayOptions({ metaFields: currentFields });
    };

    return (
        <div className="jankx-display-options">
            <PanelBody title={__('Content Display', 'jankx')} initialOpen={true}>
                <ToggleControl
                    label={__('Show Title', 'jankx')}
                    checked={displayOptions.showTitle}
                    onChange={(value) => updateDisplayOptions({ showTitle: value })}
                    help={__('Display the post title', 'jankx')}
                />

                <ToggleControl
                    label={__('Show Excerpt', 'jankx')}
                    checked={displayOptions.showExcerpt}
                    onChange={(value) => updateDisplayOptions({ showExcerpt: value })}
                    help={__('Display the post excerpt or content preview', 'jankx')}
                />

                {displayOptions.showExcerpt && (
                    <RangeControl
                        label={__('Excerpt Length', 'jankx')}
                        value={displayOptions.excerptLength}
                        onChange={(value) => updateDisplayOptions({ excerptLength: value })}
                        min={10}
                        max={100}
                        step={5}
                        help={__('Number of words to show in excerpt', 'jankx')}
                    />
                )}

                <ToggleControl
                    label={__('Show Meta Information', 'jankx')}
                    checked={displayOptions.showMeta}
                    onChange={(value) => updateDisplayOptions({ showMeta: value })}
                    help={__('Display post metadata (date, author, categories, etc.)', 'jankx')}
                />

                {displayOptions.showMeta && (
                    <div className="jankx-meta-fields">
                        <h5>{__('Meta Fields to Display', 'jankx')}</h5>
                        <p className="jankx-help-text">
                            {__('Select which meta information to show for each post', 'jankx')}
                        </p>

                        {metaFieldOptions.map(field => (
                            <CheckboxControl
                                key={field.value}
                                label={field.label}
                                checked={displayOptions.metaFields.includes(field.value)}
                                onChange={(checked) => updateMetaFields(field.value, checked)}
                            />
                        ))}
                    </div>
                )}

                <ToggleControl
                    label={__('Show Featured Image', 'jankx')}
                    checked={displayOptions.showThumbnail}
                    onChange={(value) => updateDisplayOptions({ showThumbnail: value })}
                    help={__('Display the post featured image', 'jankx')}
                />

                <ToggleControl
                    label={__('Show Read More Link', 'jankx')}
                    checked={displayOptions.showReadMore}
                    onChange={(value) => updateDisplayOptions({ showReadMore: value })}
                    help={__('Display a "Read More" link to the full post', 'jankx')}
                />
            </PanelBody>

            <PanelBody title={__('Content Behavior', 'jankx')} initialOpen={false}>
                <div className="jankx-content-behavior">
                    <h5>{__('Content Truncation', 'jankx')}</h5>
                    <p className="jankx-help-text">
                        {__('Control how content is displayed when it exceeds the available space', 'jankx')}
                    </p>

                    <div className="jankx-truncation-options">
                        <ToggleControl
                            label={__('Smart Truncation', 'jankx')}
                            checked={displayOptions.smartTruncation || false}
                            onChange={(value) => updateDisplayOptions({ smartTruncation: value })}
                            help={__('Intelligently truncate content at word boundaries', 'jankx')}
                        />

                        <ToggleControl
                            label={__('Preserve HTML', 'jankx')}
                            checked={displayOptions.preserveHTML || false}
                            onChange={(value) => updateDisplayOptions({ preserveHTML: value })}
                            help={__('Keep HTML formatting when truncating content', 'jankx')}
                        />
                    </div>
                </div>

                <div className="jankx-content-linking">
                    <h5>{__('Content Linking', 'jankx')}</h5>
                    <p className="jankx-help-text">
                        {__('Control how users navigate to full content', 'jankx')}
                    </p>

                    <ToggleControl
                        label={__('Link Entire Card', 'jankx')}
                        checked={displayOptions.linkEntireCard || false}
                        onChange={(value) => updateDisplayOptions({ linkEntireCard: value })}
                        help={__('Make the entire post card clickable', 'jankx')}
                    />

                    <ToggleControl
                        label={__('Open in New Tab', 'jankx')}
                        checked={displayOptions.openInNewTab || false}
                        onChange={(value) => updateDisplayOptions({ openInNewTab: value })}
                        help={__('Open posts in a new browser tab', 'jankx')}
                    />
                </div>
            </PanelBody>

            <PanelBody title={__('Accessibility', 'jankx')} initialOpen={false}>
                <div className="jankx-accessibility">
                    <h5>{__('Screen Reader Support', 'jankx')}</h5>
                    <p className="jankx-help-text">
                        {__('Improve accessibility for users with screen readers', 'jankx')}
                    </p>

                    <ToggleControl
                        label={__('ARIA Labels', 'jankx')}
                        checked={displayOptions.ariaLabels || false}
                        onChange={(value) => updateDisplayOptions({ ariaLabels: value })}
                        help={__('Add ARIA labels for better screen reader support', 'jankx')}
                    />

                    <ToggleControl
                        label={__('Skip Links', 'jankx')}
                        checked={displayOptions.skipLinks || false}
                        onChange={(value) => updateDisplayOptions({ skipLinks: value })}
                        help={__('Add skip links for keyboard navigation', 'jankx')}
                    />
                </div>
            </PanelBody>
        </div>
    );
}
