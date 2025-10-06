import { __ } from '@wordpress/i18n';
import { PanelBody, ToggleControl, RangeControl, CheckboxControl, SelectControl, TextControl } from '@wordpress/components';

export default function DisplayOptions({ attributes, onUpdate }) {
    const { useDefaultQuery, displayOptions, pagination } = attributes;

    // Guard against undefined nested fields
    const safeMetaFields = Array.isArray(displayOptions?.metaFields) ? displayOptions.metaFields : [];

    const updateDisplayOptions = (updates) => {
        onUpdate('displayOptions', { ...displayOptions, ...updates });
    };

    const updatePagination = (updates) => {
        onUpdate('pagination', { ...pagination, ...updates });
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
        const currentFields = Array.isArray(displayOptions?.metaFields) ? [...displayOptions.metaFields] : [];
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
                {useDefaultQuery ? (
                    <div className="jankx-default-query-info">
                        <p className="jankx-help-text">
                            {__('Display options are limited when using default page query. Some options may not be available.', 'jankx')}
                        </p>
                    </div>
                ) : null}

                <ToggleControl
                    label={__('Show Title', 'jankx')}
                    checked={!!displayOptions.showTitle}
                    onChange={(value) => updateDisplayOptions({ showTitle: value })}
                    help={__('Display the post title', 'jankx')}
                    disabled={useDefaultQuery}
                />

                <ToggleControl
                    label={__('Show Excerpt', 'jankx')}
                    checked={!!displayOptions.showExcerpt}
                    onChange={(value) => updateDisplayOptions({ showExcerpt: value })}
                    help={__('Display the post excerpt or content preview', 'jankx')}
                    disabled={useDefaultQuery}
                />

                {displayOptions.showExcerpt && !useDefaultQuery && (
                    <RangeControl
                        label={__('Excerpt Length', 'jankx')}
                        value={displayOptions.excerptLength || 10}
                        onChange={(value) => updateDisplayOptions({ excerptLength: value })}
                        min={10}
                        max={100}
                        step={5}
                        help={__('Number of words to show in excerpt', 'jankx')}
                    />
                )}

                <ToggleControl
                    label={__('Show Meta Information', 'jankx')}
                    checked={!!displayOptions.showMeta}
                    onChange={(value) => updateDisplayOptions({ showMeta: value })}
                    help={__('Display post metadata (date, author, categories, etc.)', 'jankx')}
                    disabled={useDefaultQuery}
                />

                {displayOptions.showMeta && !useDefaultQuery && (
                    <div className="jankx-meta-fields">
                        <h5>{__('Meta Fields to Display', 'jankx')}</h5>
                        <p className="jankx-help-text">
                            {__('Select which meta information to show for each post', 'jankx')}
                        </p>

                        {metaFieldOptions.map(field => (
                            <CheckboxControl
                                key={field.value}
                                label={field.label}
                                checked={safeMetaFields.includes(field.value)}
                                onChange={(checked) => updateMetaFields(field.value, checked)}
                            />
                        ))}
                    </div>
                )}

                <ToggleControl
                    label={__('Show Featured Image', 'jankx')}
                    checked={!!displayOptions.showThumbnail}
                    onChange={(value) => updateDisplayOptions({ showThumbnail: value })}
                    help={__('Display the post featured image', 'jankx')}
                    disabled={useDefaultQuery}
                />

                <ToggleControl
                    label={__('Show Read More Link', 'jankx')}
                    checked={!!displayOptions.showReadMore}
                    onChange={(value) => updateDisplayOptions({ showReadMore: value })}
                    help={__('Display a "Read More" link to the full post', 'jankx')}
                    disabled={useDefaultQuery}
                />
            </PanelBody>

            {!useDefaultQuery && (
                <PanelBody title={__('Content Behavior', 'jankx')} initialOpen={false}>
                    <div className="jankx-content-behavior">
                        <h5>{__('Content Truncation', 'jankx')}</h5>
                        <p className="jankx-help-text">
                            {__('Control how content is displayed when it exceeds the available space', 'jankx')}
                        </p>

                        <div className="jankx-truncation-options">
                            <ToggleControl
                                label={__('Smart Truncation', 'jankx')}
                                checked={!!displayOptions.smartTruncation}
                                onChange={(value) => updateDisplayOptions({ smartTruncation: value })}
                                help={__('Intelligently truncate content at word boundaries', 'jankx')}
                            />

                            <ToggleControl
                                label={__('Preserve HTML', 'jankx')}
                                checked={!!displayOptions.preserveHTML}
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
                            checked={!!displayOptions.linkEntireCard}
                            onChange={(value) => updateDisplayOptions({ linkEntireCard: value })}
                            help={__('Make the entire post card clickable', 'jankx')}
                        />

                        <ToggleControl
                            label={__('Open in New Tab', 'jankx')}
                            checked={!!displayOptions.openInNewTab}
                            onChange={(value) => updateDisplayOptions({ openInNewTab: value })}
                            help={__('Open posts in a new browser tab', 'jankx')}
                        />
                    </div>
                </PanelBody>
            )}

            {!useDefaultQuery && (
                <PanelBody title={__('Accessibility', 'jankx')} initialOpen={false}>
                    <div className="jankx-accessibility">
                        <h5>{__('Screen Reader Support', 'jankx')}</h5>
                        <p className="jankx-help-text">
                            {__('Improve accessibility for users with screen readers', 'jankx')}
                        </p>

                        <ToggleControl
                            label={__('ARIA Labels', 'jankx')}
                            checked={!!displayOptions.ariaLabels}
                            onChange={(value) => updateDisplayOptions({ ariaLabels: value })}
                            help={__('Add ARIA labels for better screen reader support', 'jankx')}
                        />

                        <ToggleControl
                            label={__('Skip Links', 'jankx')}
                            checked={!!displayOptions.skipLinks}
                            onChange={(value) => updateDisplayOptions({ skipLinks: value })}
                            help={__('Add skip links for keyboard navigation', 'jankx')}
                        />
                    </div>
                </PanelBody>
            )}

            {!useDefaultQuery && (
                <PanelBody title={__('Pagination Settings', 'jankx')} initialOpen={false}>
                    <div className="jankx-pagination-settings">
                        <ToggleControl
                            label={__('Enable Pagination', 'jankx')}
                            checked={!!pagination?.enabled}
                            onChange={(value) => updatePagination({ enabled: value })}
                            help={__('Show pagination controls for navigation between pages', 'jankx')}
                        />

                        {pagination?.enabled && (
                            <>
                                <SelectControl
                                    label={__('Pagination Type', 'jankx')}
                                    value={pagination?.type || 'numbers'}
                                    options={[
                                        { label: __('Numbers', 'jankx'), value: 'numbers' },
                                        { label: __('Previous/Next', 'jankx'), value: 'prev_next' },
                                        { label: __('Load More', 'jankx'), value: 'load_more' },
                                        { label: __('Infinite Scroll', 'jankx'), value: 'infinite' }
                                    ]}
                                    onChange={(value) => updatePagination({ type: value })}
                                    help={__('Choose the type of pagination to display', 'jankx')}
                                />

                                {pagination?.type === 'numbers' && (
                                    <>
                                        <RangeControl
                                            label={__('Max Page Numbers', 'jankx')}
                                            value={pagination?.maxNumbers || 10}
                                            onChange={(value) => updatePagination({ maxNumbers: value })}
                                            min={3}
                                            max={20}
                                            help={__('Maximum number of page numbers to show', 'jankx')}
                                        />

                                        <ToggleControl
                                            label={__('Show First/Last', 'jankx')}
                                            checked={!!pagination?.showFirstLast}
                                            onChange={(value) => updatePagination({ showFirstLast: value })}
                                            help={__('Show first and last page buttons', 'jankx')}
                                        />

                                        <ToggleControl
                                            label={__('Show Ellipsis', 'jankx')}
                                            checked={!!pagination?.showEllipsis}
                                            onChange={(value) => updatePagination({ showEllipsis: value })}
                                            help={__('Show ellipsis (...) for hidden pages', 'jankx')}
                                        />

                                        <ToggleControl
                                            label={__('Show Current Page', 'jankx')}
                                            checked={!!pagination?.showCurrentPage}
                                            onChange={(value) => updatePagination({ showCurrentPage: value })}
                                            help={__('Highlight the current page number', 'jankx')}
                                        />
                                    </>
                                )}

                                {(pagination?.type === 'prev_next' || pagination?.type === 'numbers') && (
                                    <>
                                        <TextControl
                                            label={__('Previous Text', 'jankx')}
                                            value={pagination?.prevText || 'Previous'}
                                            onChange={(value) => updatePagination({ prevText: value })}
                                            help={__('Text for previous page button', 'jankx')}
                                        />

                                        <TextControl
                                            label={__('Next Text', 'jankx')}
                                            value={pagination?.nextText || 'Next'}
                                            onChange={(value) => updatePagination({ nextText: value })}
                                            help={__('Text for next page button', 'jankx')}
                                        />

                                        <ToggleControl
                                            label={__('Show Icons', 'jankx')}
                                            checked={!!pagination?.showIcons}
                                            onChange={(value) => updatePagination({ showIcons: value })}
                                            help={__('Show arrow icons on navigation buttons', 'jankx')}
                                        />
                                    </>
                                )}

                                {(pagination?.type === 'load_more' || pagination?.type === 'infinite') && (
                                    <>
                                        <TextControl
                                            label={__('Load More Text', 'jankx')}
                                            value={pagination?.loadMoreText || 'Load More'}
                                            onChange={(value) => updatePagination({ loadMoreText: value })}
                                            help={__('Text for load more button', 'jankx')}
                                        />

                                        <TextControl
                                            label={__('Loading Text', 'jankx')}
                                            value={pagination?.loadingText || 'Loading...'}
                                            onChange={(value) => updatePagination({ loadingText: value })}
                                            help={__('Text shown while loading', 'jankx')}
                                        />

                                        <TextControl
                                            label={__('No More Text', 'jankx')}
                                            value={pagination?.noMoreText || 'No More Posts'}
                                            onChange={(value) => updatePagination({ noMoreText: value })}
                                            help={__('Text shown when all posts are loaded', 'jankx')}
                                        />

                                        <RangeControl
                                            label={__('Posts Per Load', 'jankx')}
                                            value={pagination?.postsPerLoad || 6}
                                            onChange={(value) => updatePagination({ postsPerLoad: value })}
                                            min={1}
                                            max={50}
                                            help={__('Number of posts to load each time', 'jankx')}
                                        />

                                        <ToggleControl
                                            label={__('Show Spinner', 'jankx')}
                                            checked={!!pagination?.showSpinner}
                                            onChange={(value) => updatePagination({ showSpinner: value })}
                                            help={__('Show loading spinner', 'jankx')}
                                        />

                                        <ToggleControl
                                            label={__('Hide When Complete', 'jankx')}
                                            checked={!!pagination?.hideWhenComplete}
                                            onChange={(value) => updatePagination({ hideWhenComplete: value })}
                                            help={__('Hide button when all posts are loaded', 'jankx')}
                                        />
                                    </>
                                )}

                                {pagination?.type === 'infinite' && (
                                    <>
                                        <RangeControl
                                            label={__('Trigger Distance', 'jankx')}
                                            value={pagination?.triggerDistance || 100}
                                            onChange={(value) => updatePagination({ triggerDistance: value })}
                                            min={50}
                                            max={500}
                                            help={__('Distance from bottom to trigger loading (px)', 'jankx')}
                                        />

                                        <ToggleControl
                                            label={__('Show Loading Indicator', 'jankx')}
                                            checked={!!pagination?.showLoadingIndicator}
                                            onChange={(value) => updatePagination({ showLoadingIndicator: value })}
                                            help={__('Show loading indicator during infinite scroll', 'jankx')}
                                        />

                                        <ToggleControl
                                            label={__('Show Back to Top', 'jankx')}
                                            checked={!!pagination?.showBackToTop}
                                            onChange={(value) => updatePagination({ showBackToTop: value })}
                                            help={__('Show back to top button after loading', 'jankx')}
                                        />
                                    </>
                                )}

                                <div className="jankx-pagination-advanced">
                                    <h5>{__('Advanced Options', 'jankx')}</h5>

                                    <ToggleControl
                                        label={__('AJAX Pagination', 'jankx')}
                                        checked={!!pagination?.ajax}
                                        onChange={(value) => updatePagination({ ajax: value })}
                                        help={__('Load pages without refreshing the browser', 'jankx')}
                                    />

                                    <ToggleControl
                                        label={__('Update URL', 'jankx')}
                                        checked={!!pagination?.updateURL}
                                        onChange={(value) => updatePagination({ updateURL: value })}
                                        help={__('Update browser URL when navigating pages', 'jankx')}
                                    />

                                    <ToggleControl
                                        label={__('Scroll to Top', 'jankx')}
                                        checked={!!pagination?.scrollToTop}
                                        onChange={(value) => updatePagination({ scrollToTop: value })}
                                        help={__('Scroll to top when changing pages', 'jankx')}
                                    />

                                    <ToggleControl
                                        label={__('Keyboard Navigation', 'jankx')}
                                        checked={!!pagination?.keyboardNav}
                                        onChange={(value) => updatePagination({ keyboardNav: value })}
                                        help={__('Allow keyboard navigation (arrow keys)', 'jankx')}
                                    />

                                    <ToggleControl
                                        label={__('Touch Support', 'jankx')}
                                        checked={!!pagination?.touchSupport}
                                        onChange={(value) => updatePagination({ touchSupport: value })}
                                        help={__('Enable touch/swipe navigation', 'jankx')}
                                    />

                                    <RangeControl
                                        label={__('Animation Duration', 'jankx')}
                                        value={pagination?.animationDuration || 300}
                                        onChange={(value) => updatePagination({ animationDuration: value })}
                                        min={100}
                                        max={1000}
                                        step={50}
                                        help={__('Animation duration in milliseconds', 'jankx')}
                                    />
                                </div>
                            </>
                        )}
                    </div>
                </PanelBody>
            )}
        </div>
    );
}
