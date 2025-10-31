import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { ButtonGroup, Button, Panel, PanelBody } from '@wordpress/components';
import { useState } from '@wordpress/element';

import FilterBuilder from './components/FilterBuilder';
import DisplaySettings from './components/DisplaySettings';
import TargetBlocks from './components/TargetBlocks';

interface AdvancedFilterAttributes {
    filterId: string;
    filterType: string;
    filterConfig: Record<string, unknown>;
    targetBlocks: Array<{
        id: string;
        blockId: string;
        blockName: string;
        selector: string;
        enabled: boolean;
    }>;
    ajaxSettings: Record<string, unknown>;
    displaySettings: Record<string, unknown>;
    styling: Record<string, unknown>;
    customFilters: Array<Record<string, unknown>>;
    metaFilters: Array<Record<string, unknown>>;
    dateFilters: Array<Record<string, unknown>>;
    priceFilters: Array<Record<string, unknown>>;
    customFields: Array<Record<string, unknown>>;
}

interface EditProps {
    attributes: AdvancedFilterAttributes;
    setAttributes: (attrs: Partial<AdvancedFilterAttributes>) => void;
    clientId: string;
}

function Edit({ attributes, setAttributes, clientId }: EditProps): JSX.Element {
    const {
        filterId,
        filterType,
        filterConfig,
        targetBlocks,
        ajaxSettings,
        displaySettings,
        styling,
        customFilters,
        metaFilters,
        dateFilters,
        priceFilters
    } = attributes;

    const [activeTab, setActiveTab] = useState<'filters' | 'display' | 'targets'>('filters');

    const blockProps = useBlockProps({
        className: 'jankx-advanced-filter'
    });

    // Tạo filterId nếu chưa có
    if (!filterId) {
        setAttributes({ filterId: `filter_${clientId}` });
    }

    const updateAttribute = (key: keyof AdvancedFilterAttributes, value: unknown): void => {
        setAttributes({ [key]: value } as Partial<AdvancedFilterAttributes>);
    };

    const renderTabContent = (): JSX.Element | null => {
        switch (activeTab) {
            case 'filters':
                return (
                    <FilterBuilder
                        attributes={attributes}
                        setAttributes={setAttributes}
                    />
                );
            case 'display':
                return (
                    <DisplaySettings
                        attributes={attributes}
                        setAttributes={setAttributes}
                    />
                );
            case 'targets':
                return (
                    <TargetBlocks
                        attributes={attributes}
                        setAttributes={setAttributes}
                    />
                );
            default:
                return null;
        }
    };

    const renderPreview = (): JSX.Element => {
        const hasFilters = customFilters.length > 0 || metaFilters.length > 0 || (filterType === 'taxonomy' && filterConfig?.taxonomy);
        const hasTargets = targetBlocks.length > 0 && targetBlocks.some((t: any) => t.enabled);

        // Count filters
        const dateFilters = attributes.dateFilters || [];
        const priceFilters = attributes.priceFilters || [];
        
        const filterCount = 
            (filterType === 'taxonomy' && filterConfig?.taxonomy ? 1 : 0) +
            (customFilters?.length || 0) +
            (metaFilters?.length || 0) +
            (dateFilters?.length || 0) +
            (priceFilters?.length || 0);

        return (
            <div className="jankx-advanced-filter__preview">
                <div className="jankx-advanced-filter__preview-header">
                    <div className="jankx-advanced-filter__preview-icon">
                        <span className="dashicons dashicons-filter"></span>
                    </div>
                    <div className="jankx-advanced-filter__preview-info">
                        <div className="jankx-advanced-filter__preview-title">
                            {__('Advanced Filter', 'jankx')}
                            {filterId && (
                                <span className="jankx-advanced-filter__preview-id">({filterId})</span>
                            )}
                        </div>
                        <div className="jankx-advanced-filter__preview-stats">
                            {filterCount > 0 && (
                                <span className="jankx-advanced-filter__stat">
                                    <span className="dashicons dashicons-filter"></span>
                                    {filterCount} {filterCount === 1 ? __('filter', 'jankx') : __('filters', 'jankx')}
                                </span>
                            )}
                            {hasTargets && (
                                <span className="jankx-advanced-filter__stat">
                                    <span className="dashicons dashicons-admin-links"></span>
                                    {targetBlocks.filter((t: any) => t.enabled).length} {__('targets', 'jankx')}
                                </span>
                            )}
                            {ajaxSettings?.enabled && (
                                <span className="jankx-advanced-filter__stat">
                                    <span className="dashicons dashicons-update"></span>
                                    {__('AJAX', 'jankx')}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {!hasFilters ? (
                    <div className="jankx-advanced-filter__preview-empty">
                        <span className="dashicons dashicons-info"></span>
                        <p>{__('Chưa có bộ lọc nào được cấu hình.', 'jankx')}</p>
                        <p className="jankx-advanced-filter__preview-hint">
                            {__('Hãy cấu hình bộ lọc trong panel bên phải → tab "Bộ lọc".', 'jankx')}
                        </p>
                    </div>
                ) : (
                    <div className="jankx-advanced-filter__preview-content">
                        <div className="jankx-advanced-filter__preview-label">
                            {__('Preview:', 'jankx')}
                        </div>
                        <div className="jankx-advanced-filter__preview-filters">
                            {filterType === 'taxonomy' && filterConfig?.taxonomy && (
                                <div className="jankx-advanced-filter__preview-filter-item">
                                    <span className="jankx-advanced-filter__preview-filter-icon">🏷️</span>
                                    <span className="jankx-advanced-filter__preview-filter-label">
                                        {filterConfig.taxonomy === 'category' ? __('Categories', 'jankx') : 
                                         filterConfig.taxonomy === 'post_tag' ? __('Tags', 'jankx') : 
                                         filterConfig.taxonomy}
                                    </span>
                                </div>
                            )}
                            {customFilters.map((filter: any, index: number) => (
                                <div key={filter.id || index} className="jankx-advanced-filter__preview-filter-item">
                                    <span className="jankx-advanced-filter__preview-filter-icon">⚙️</span>
                                    <span className="jankx-advanced-filter__preview-filter-label">
                                        {filter.label || __('Custom Filter', 'jankx')}
                                    </span>
                                </div>
                            ))}
                            {metaFilters.map((filter: any, index: number) => (
                                <div key={filter.id || index} className="jankx-advanced-filter__preview-filter-item">
                                    <span className="jankx-advanced-filter__preview-filter-icon">📊</span>
                                    <span className="jankx-advanced-filter__preview-filter-label">
                                        {filter.label || filter.metaKey || __('Meta Filter', 'jankx')}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {!hasTargets && (
                    <div className="jankx-advanced-filter__preview-warning">
                        <span className="dashicons dashicons-warning"></span>
                        <p>{__('Chưa có block đích nào được chọn.', 'jankx')}</p>
                        <p className="jankx-advanced-filter__preview-hint">
                            {__('Hãy chọn block đích trong panel bên phải → tab "Targets".', 'jankx')}
                        </p>
                    </div>
                )}
            </div>
        );
    };

    return (
        <>
            <div {...blockProps}>
                {renderPreview()}
            </div>

            <InspectorControls>
                <Panel>
                    <PanelBody title={__('Cài đặt Filter', 'jankx')} initialOpen={true}>
                        <div className="jankx-advanced-filter__tabs">
                            <ButtonGroup className="jankx-advanced-filter__tab-buttons">
                                <Button
                                    isPrimary={activeTab === 'filters'}
                                    onClick={() => setActiveTab('filters')}
                                    icon="filter"
                                    label={__('Bộ lọc', 'jankx')}
                                >
                                    {__('Bộ lọc', 'jankx')}
                                </Button>
                                <Button
                                    isPrimary={activeTab === 'display'}
                                    onClick={() => setActiveTab('display')}
                                    icon="visibility"
                                    label={__('Hiển thị', 'jankx')}
                                >
                                    {__('Hiển thị', 'jankx')}
                                </Button>
                                <Button
                                    isPrimary={activeTab === 'targets'}
                                    onClick={() => setActiveTab('targets')}
                                    icon="admin-links"
                                    label={__('Targets', 'jankx')}
                                >
                                    {__('Targets', 'jankx')}
                                </Button>
                            </ButtonGroup>
                        </div>

                        <div className="jankx-advanced-filter__tab-content">
                            {renderTabContent()}
                        </div>
                    </PanelBody>
                </Panel>
            </InspectorControls>
        </>
    );
}

console.log('Advanced Filter');
registerBlockType('jankx/advanced-filter', {
    title: __('Advanced Filter', 'jankx'),
    description: __('Bộ lọc nâng cao với khả năng tương tác AJAX và tích hợp với Post Layout', 'jankx'),
    category: 'jankx',
    icon: 'filter',
    keywords: [
        __('filter', 'jankx'),
        __('search', 'jankx'),
        __('ajax', 'jankx'),
        __('interactive', 'jankx'),
        __('posts', 'jankx')
    ],
    supports: {
        html: false,
        align: ['wide', 'full'],
        customClassName: true,
        reusable: true
    },
    attributes: {
        filterId: { type: 'string', default: '' },
        filterType: { type: 'string', default: 'taxonomy' },
        filterConfig: { type: 'object', default: {} },
        targetBlocks: { type: 'array', default: [] },
        ajaxSettings: { type: 'object', default: {} },
        displaySettings: { type: 'object', default: {} },
        styling: { type: 'object', default: {} },
        customFilters: { type: 'array', default: [] },
        metaFilters: { type: 'array', default: [] },
        dateFilters: { type: 'array', default: [] },
        priceFilters: { type: 'array', default: [] },
        customFields: { type: 'array', default: [] }
    },
    edit: Edit,
    save: () => null
});
