import { useBlockProps } from '@wordpress/block-editor';

export default function save({ attributes }) {
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
        priceFilters,
        customFields
    } = attributes;

    const blockProps = useBlockProps.save({
        className: 'jankx-advanced-filter'
    });

    // Cấu hình filter để gửi lên frontend
    const filterConfig = {
        filterId: filterId || `filter_${Date.now()}`,
        filterType,
        filterConfig,
        targetBlocks: targetBlocks.filter(target => target.enabled),
        ajaxSettings: {
            enabled: true,
            loadingText: 'Đang tải...',
            errorText: 'Có lỗi xảy ra',
            updateURL: true,
            scrollToResults: true,
            animationDuration: 300,
            debounceDelay: 300,
            ...ajaxSettings
        },
        displaySettings: {
            showLabel: true,
            labelText: 'Lọc theo:',
            showReset: true,
            resetText: 'Xóa bộ lọc',
            showCount: true,
            showLoading: true,
            responsive: true,
            ...displaySettings
        },
        styling: {
            layout: 'horizontal',
            gap: 15,
            borderRadius: 8,
            shadow: 'none',
            backgroundColor: 'transparent',
            textColor: 'inherit',
            ...styling
        },
        filters: {
            custom: customFilters.filter(filter => filter.enabled),
            meta: metaFilters.filter(filter => filter.enabled),
            date: dateFilters.filter(filter => filter.enabled),
            price: priceFilters.filter(filter => filter.enabled),
            customFields: customFields.filter(field => field.enabled)
        }
    };

    return (
        <div {...blockProps}>
            <div
                className="jankx-advanced-filter-config"
                data-config={JSON.stringify(filterConfig)}
                style={{ display: 'none' }}
            />
            <div className="jankx-advanced-filter-content">
                {/* Nội dung filter sẽ được render bởi JavaScript frontend */}
                <div className="jankx-advanced-filter-loading">
                    {displaySettings?.showLoading && (
                        <div className="jankx-advanced-filter-spinner">
                            <span>{ajaxSettings?.loadingText || 'Đang tải...'}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
