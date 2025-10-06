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
        metaFilters
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
                        postType="post"
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
        const hasFilters = customFilters.length > 0 || metaFilters.length > 0 || filterType !== 'custom';
        const hasTargets = targetBlocks.length > 0;

        return (
            <div className="jankx-advanced-filter__preview">
                <div className="jankx-advanced-filter__header">
                    <h3 className="jankx-advanced-filter__title">
                        {__('Advanced Filter', 'jankx')}
                        {filterId && (
                            <span className="jankx-advanced-filter__id">
                                ID: {filterId}
                            </span>
                        )}
                    </h3>
                    <div className="jankx-advanced-filter__status">
                        {hasFilters && (
                            <span className="jankx-advanced-filter__status-item status-filters">
                                {__('Có bộ lọc', 'jankx')}
                            </span>
                        )}
                        {hasTargets && (
                            <span className="jankx-advanced-filter__status-item status-targets">
                                {__('Có target', 'jankx')}
                            </span>
                        )}
                        {ajaxSettings?.enabled && (
                            <span className="jankx-advanced-filter__status-item status-ajax">
                                {__('AJAX', 'jankx')}
                            </span>
                        )}
                    </div>
                </div>

                <div className="jankx-advanced-filter__content">
                    {filterType === 'taxonomy' && (
                        <div className="jankx-advanced-filter__preview-item">
                            <label className="jankx-advanced-filter__label">
                                {displaySettings?.showLabel ? (displaySettings.labelText || __('Lọc theo:', 'jankx')) : ''}
                            </label>
                            <select className="jankx-advanced-filter__select" disabled>
                                <option>{filterConfig?.placeholder || __('Chọn danh mục...', 'jankx')}</option>
                                <option>Danh mục 1 (5)</option>
                                <option>Danh mục 2 (3)</option>
                                <option>Danh mục 3 (8)</option>
                            </select>
                        </div>
                    )}

                    {customFilters.map((filter, index) => (
                        <div key={filter.id || index} className="jankx-advanced-filter__preview-item">
                            <label className="jankx-advanced-filter__label">
                                {filter.label || __('Custom Filter', 'jankx')}
                            </label>
                            <input
                                type="text"
                                className="jankx-advanced-filter__input"
                                placeholder={__('Nhập giá trị...', 'jankx')}
                                disabled
                            />
                        </div>
                    ))}

                    {metaFilters.map((filter, index) => (
                        <div key={filter.id || index} className="jankx-advanced-filter__preview-item">
                            <label className="jankx-advanced-filter__label">
                                {filter.label || __('Meta Filter', 'jankx')}
                            </label>
                            <input
                                type="text"
                                className="jankx-advanced-filter__input"
                                placeholder={__('Nhập giá trị...', 'jankx')}
                                disabled
                            />
                        </div>
                    ))}

                    {displaySettings?.showReset && (
                        <div className="jankx-advanced-filter__preview-item">
                            <button className="jankx-advanced-filter__reset" disabled>
                                {displaySettings.resetText || __('Xóa bộ lọc', 'jankx')}
                            </button>
                        </div>
                    )}
                </div>

                {!hasFilters && (
                    <div className="jankx-advanced-filter__empty">
                        {__('Chưa có bộ lọc nào. Hãy thêm bộ lọc trong tab "Bộ lọc".', 'jankx')}
                    </div>
                )}

                {!hasTargets && (
                    <div className="jankx-advanced-filter__warning">
                        {__('Chưa có block đích nào. Hãy thêm block đích trong tab "Targets".', 'jankx')}
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
                                {[
                                    { key: 'filters', label: __('Bộ lọc', 'jankx'), icon: 'filter' },
                                    { key: 'display', label: __('Hiển thị', 'jankx'), icon: 'visibility' },
                                    { key: 'targets', label: __('Targets', 'jankx'), icon: 'admin-links' }
                                ].map(({ key, label, icon }) => (
                                    <Button
                                        key={key}
                                        isPrimary={activeTab === (key as typeof activeTab)}
                                        onClick={() => setActiveTab(key as typeof activeTab)}
                                        icon={icon}
                                        label={label}
                                    >
                                        {label}
                                    </Button>
                                ))}
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
