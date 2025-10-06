import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import {
    PanelBody,
    SelectControl,
    TextControl,
    Button,
    ButtonGroup,
    ToggleControl,
    RangeControl,
    TextareaControl
} from '@wordpress/components';
import { plus, minus, edit, trash } from '@wordpress/icons';

export default function FilterBuilder({ attributes, postType, taxonomies, onUpdate }) {
    const {
        useDefaultQuery,
        taxonomyFilters,
        metaFilters,
        presetFilters,
        customFilters
    } = attributes;

    const [activeFilterType, setActiveFilterType] = useState('taxonomy');
    const [editingFilter, setEditingFilter] = useState(null);

    const taxonomyOptions = taxonomies ? Object.values(taxonomies)
        .filter(tax => tax.types.includes(postType))
        .map(tax => ({
            label: tax.labels.singular_name || tax.name,
            value: tax.slug
        })) : [];

    const presetFilterOptions = [
        { label: __('Featured Posts', 'jankx'), value: 'featured' },
        { label: __('Popular Posts', 'jankx'), value: 'popular' },
        { label: __('Recent Posts', 'jankx'), value: 'recent' },
        { label: __('Trending Posts', 'jankx'), value: 'trending' },
        { label: __('Editor Picks', 'jankx'), value: 'editor_picks' }
    ];

    const addTaxonomyFilter = () => {
        const newFilter = {
            id: `tax_${Date.now()}`,
            taxonomy: '',
            terms: [],
            operator: 'IN',
            includeChildren: true
        };

        const updated = { ...taxonomyFilters, [newFilter.id]: newFilter };
        onUpdate('taxonomyFilters', updated);
    };

    const updateTaxonomyFilter = (filterId, updates) => {
        const updated = {
            ...taxonomyFilters,
            [filterId]: { ...taxonomyFilters[filterId], ...updates }
        };
        onUpdate('taxonomyFilters', updated);
    };

    const removeTaxonomyFilter = (filterId) => {
        const { [filterId]: removed, ...remaining } = taxonomyFilters;
        onUpdate('taxonomyFilters', remaining);
    };

    const addMetaFilter = () => {
        const newFilter = {
            id: `meta_${Date.now()}`,
            key: '',
            value: '',
            compare: '=',
            type: 'CHAR'
        };

        const updated = { ...metaFilters, [newFilter.id]: newFilter };
        onUpdate('metaFilters', updated);
    };

    const updateMetaFilter = (filterId, updates) => {
        const updated = {
            ...metaFilters,
            [filterId]: { ...metaFilters[filterId], ...updates }
        };
        onUpdate('metaFilters', updated);
    };

    const removeMetaFilter = (filterId) => {
        const { [filterId]: removed, ...remaining } = metaFilters;
        onUpdate('metaFilters', remaining);
    };

    const addPresetFilter = (preset) => {
        if (!presetFilters.includes(preset)) {
            onUpdate('presetFilters', [...presetFilters, preset]);
        }
    };

    const removePresetFilter = (preset) => {
        onUpdate('presetFilters', presetFilters.filter(p => p !== preset));
    };

    const addCustomFilter = () => {
        const newFilter = {
            id: `custom_${Date.now()}`,
            name: '',
            callback: '',
            parameters: {}
        };

        const updated = { ...customFilters, [newFilter.id]: newFilter };
        onUpdate('customFilters', updated);
    };

    const updateCustomFilter = (filterId, updates) => {
        const updated = {
            ...customFilters,
            [filterId]: { ...customFilters[filterId], ...updates }
        };
        onUpdate('customFilters', updated);
    };

    const removeCustomFilter = (filterId) => {
        const { [filterId]: removed, ...remaining } = customFilters;
        onUpdate('customFilters', remaining);
    };

    const renderTaxonomyFilter = (filterId, filter) => (
        <div key={filterId} className="jankx-filter-item">
            <div className="jankx-filter-header">
                <SelectControl
                    label={__('Taxonomy', 'jankx')}
                    value={filter.taxonomy}
                    options={taxonomyOptions}
                    onChange={(value) => updateTaxonomyFilter(filterId, { taxonomy: value })}
                />
                <Button
                    icon={trash}
                    label={__('Remove Filter', 'jankx')}
                    onClick={() => removeTaxonomyFilter(filterId)}
                    isDestructive
                    small
                />
            </div>

            <TextControl
                label={__('Terms (comma-separated)', 'jankx')}
                value={filter.terms.join(', ')}
                onChange={(value) => updateTaxonomyFilter(filterId, {
                    terms: value.split(',').map(term => term.trim()).filter(Boolean)
                })}
            />

            <SelectControl
                label={__('Operator', 'jankx')}
                value={filter.operator}
                options={[
                    { label: __('In', 'jankx'), value: 'IN' },
                    { label: __('Not In', 'jankx'), value: 'NOT IN' },
                    { label: __('And', 'jankx'), value: 'AND' },
                    { label: __('Exists', 'jankx'), value: 'EXISTS' },
                    { label: __('Not Exists', 'jankx'), value: 'NOT EXISTS' }
                ]}
                onChange={(value) => updateTaxonomyFilter(filterId, { operator: value })}
            />

            <ToggleControl
                label={__('Include Children', 'jankx')}
                checked={filter.includeChildren}
                onChange={(value) => updateTaxonomyFilter(filterId, { includeChildren: value })}
            />
        </div>
    );

    const renderMetaFilter = (filterId, filter) => (
        <div key={filterId} className="jankx-filter-item">
            <div className="jankx-filter-header">
                <TextControl
                    label={__('Meta Key', 'jankx')}
                    value={filter.key}
                    onChange={(value) => updateMetaFilter(filterId, { key: value })}
                />
                <Button
                    icon={trash}
                    label={__('Remove Filter', 'jankx')}
                    onClick={() => removeMetaFilter(filterId)}
                    isDestructive
                    small
                />
            </div>

            <TextControl
                label={__('Meta Value', 'jankx')}
                value={filter.value}
                onChange={(value) => updateMetaFilter(filterId, { value })}
            />

            <SelectControl
                label={__('Compare', 'jankx')}
                value={filter.compare}
                options={[
                    { label: __('Equals', 'jankx'), value: '=' },
                    { label: __('Not Equals', 'jankx'), value: '!=' },
                    { label: __('Greater Than', 'jankx'), value: '>' },
                    { label: __('Greater Than or Equal', 'jankx'), value: '>=' },
                    { label: __('Less Than', 'jankx'), value: '<' },
                    { label: __('Less Than or Equal', 'jankx'), value: '<=' },
                    { label: __('Like', 'jankx'), value: 'LIKE' },
                    { label: __('Not Like', 'jankx'), value: 'NOT LIKE' },
                    { label: __('Exists', 'jankx'), value: 'EXISTS' },
                    { label: __('Not Exists', 'jankx'), value: 'NOT EXISTS' }
                ]}
                onChange={(value) => updateMetaFilter(filterId, { compare: value })}
            />

            <SelectControl
                label={__('Value Type', 'jankx')}
                value={filter.type}
                options={[
                    { label: __('String', 'jankx'), value: 'CHAR' },
                    { label: __('Number', 'jankx'), value: 'NUMERIC' },
                    { label: __('Date', 'jankx'), value: 'DATE' },
                    { label: __('Time', 'jankx'), value: 'TIME' },
                    { label: __('DateTime', 'jankx'), value: 'DATETIME' },
                    { label: __('Binary', 'jankx'), value: 'BINARY' },
                    { label: __('Decimal', 'jankx'), value: 'DECIMAL' },
                    { label: __('Signed', 'jankx'), value: 'SIGNED' },
                    { label: __('Unsigned', 'jankx'), value: 'UNSIGNED' }
                ]}
                onChange={(value) => updateMetaFilter(filterId, { type: value })}
            />
        </div>
    );

    const renderCustomFilter = (filterId, filter) => (
        <div key={filterId} className="jankx-filter-item">
            <div className="jankx-filter-header">
                <TextControl
                    label={__('Filter Name', 'jankx')}
                    value={filter.name}
                    onChange={(value) => updateCustomFilter(filterId, { name: value })}
                />
                <Button
                    icon={trash}
                    label={__('Remove Filter', 'jankx')}
                    onClick={() => removeCustomFilter(filterId)}
                    isDestructive
                    small
                />
            </div>

            <TextControl
                label={__('Callback Function', 'jankx')}
                value={filter.callback}
                onChange={(value) => updateCustomFilter(filterId, { callback: value })}
                help={__('Name of the registered filter function', 'jankx')}
            />

            <TextareaControl
                label={__('Parameters (JSON)', 'jankx')}
                value={JSON.stringify(filter.parameters, null, 2)}
                onChange={(value) => {
                    try {
                        const parsed = JSON.parse(value);
                        updateCustomFilter(filterId, { parameters: parsed });
                    } catch (e) {
                        // Invalid JSON, ignore
                    }
                }}
                help={__('JSON object with filter parameters', 'jankx')}
            />
        </div>
    );

    return (
        <div className="jankx-filter-builder">
            <PanelBody title={__('Filter Builder', 'jankx')} initialOpen={true}>
                {useDefaultQuery ? (
                    <div className="jankx-default-query-info">
                        <p className="jankx-help-text">
                            {__('Filters are disabled when using default page query. Switch to custom query to enable filtering options.', 'jankx')}
                        </p>
                    </div>
                ) : (
                    <>
                        <ButtonGroup className="jankx-filter-type-selector">
                            {[
                                { key: 'taxonomy', label: __('Taxonomy', 'jankx') },
                                { key: 'meta', label: __('Meta', 'jankx') },
                                { key: 'preset', label: __('Preset', 'jankx') },
                                { key: 'custom', label: __('Custom', 'jankx') }
                            ].map(({ key, label }) => (
                                <Button
                                    key={key}
                                    isPrimary={activeFilterType === key}
                                    onClick={() => setActiveFilterType(key)}
                                >
                                    {label}
                                </Button>
                            ))}
                        </ButtonGroup>

                        {activeFilterType === 'taxonomy' && (
                            <div className="jankx-filter-section">
                                <div className="jankx-filter-section-header">
                                    <h4>{__('Taxonomy Filters', 'jankx')}</h4>
                                    <Button
                                        icon={plus}
                                        label={__('Add Taxonomy Filter', 'jankx')}
                                        onClick={addTaxonomyFilter}
                                        isPrimary
                                        small
                                    />
                                </div>

                                {Object.entries(taxonomyFilters).map(([filterId, filter]) =>
                                    renderTaxonomyFilter(filterId, filter)
                                )}

                                {Object.keys(taxonomyFilters).length === 0 && (
                                    <p className="jankx-no-filters">
                                        {__('No taxonomy filters added yet.', 'jankx')}
                                    </p>
                                )}
                            </div>
                        )}

                        {activeFilterType === 'meta' && (
                            <div className="jankx-filter-section">
                                <div className="jankx-filter-section-header">
                                    <h4>{__('Meta Filters', 'jankx')}</h4>
                                    <Button
                                        icon={plus}
                                        label={__('Add Meta Filter', 'jankx')}
                                        onClick={addMetaFilter}
                                        isPrimary
                                        small
                                    />
                                </div>

                                {Object.entries(metaFilters).map(([filterId, filter]) =>
                                    renderMetaFilter(filterId, filter)
                                )}

                                {Object.keys(metaFilters).length === 0 && (
                                    <p className="jankx-no-filters">
                                        {__('No meta filters added yet.', 'jankx')}
                                    </p>
                                )}
                            </div>
                        )}

                        {activeFilterType === 'preset' && (
                            <div className="jankx-filter-section">
                                <h4>{__('Preset Filters', 'jankx')}</h4>
                                <p className="jankx-filter-help">
                                    {__('Select from predefined filter presets', 'jankx')}
                                </p>

                                <div className="jankx-preset-filters">
                                    {presetFilterOptions.map(preset => (
                                        <ToggleControl
                                            key={preset.value}
                                            label={preset.label}
                                            checked={presetFilters.includes(preset.value)}
                                            onChange={(checked) => {
                                                if (checked) {
                                                    addPresetFilter(preset.value);
                                                } else {
                                                    removePresetFilter(preset.value);
                                                }
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeFilterType === 'custom' && (
                            <div className="jankx-filter-section">
                                <div className="jankx-filter-section-header">
                                    <h4>{__('Custom Filters', 'jankx')}</h4>
                                    <Button
                                        icon={plus}
                                        label={__('Add Custom Filter', 'jankx')}
                                        onClick={addCustomFilter}
                                        isPrimary
                                        small
                                    />
                                </div>

                                {Object.entries(customFilters).map(([filterId, filter]) =>
                                    renderCustomFilter(filterId, filter)
                                )}

                                {Object.keys(customFilters).length === 0 && (
                                    <p className="jankx-no-filters">
                                        {__('No custom filters added yet.', 'jankx')}
                                    </p>
                                )}
                            </div>
                        )}
                    </>
                )}
            </PanelBody>
        </div>
    );
}
