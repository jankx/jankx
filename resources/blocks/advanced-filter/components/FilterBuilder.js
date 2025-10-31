import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import {
    PanelBody,
    SelectControl,
    ToggleControl,
    TextControl,
    RangeControl,
    Button,
    ButtonGroup,
    Card,
    CardBody,
    CardHeader,
    Flex,
    FlexItem,
    Spinner,
    Notice
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { store as coreDataStore } from '@wordpress/core-data';

const FilterBuilder = ({ attributes, setAttributes, postType: propPostType = null }) => {
    const {
        filterType,
        filterConfig,
        targetBlocks,
        ajaxSettings,
        displaySettings,
        customFilters,
        metaFilters,
        dateFilters,
        priceFilters,
        customFields
    } = attributes;

    const [isLoading, setIsLoading] = useState(false);
    const [availableTaxonomies, setAvailableTaxonomies] = useState([]);
    const [availableMetaKeys, setAvailableMetaKeys] = useState([]);
    const [detectedPostType, setDetectedPostType] = useState(propPostType || 'post');

    // Auto-detect post type từ target blocks
    useEffect(() => {
        if (targetBlocks && targetBlocks.length > 0) {
            // Fetch post type từ target blocks
            const fetchTargetBlockPostTypes = async () => {
                const postTypes = new Set();
                
                for (const target of targetBlocks) {
                    if (!target.enabled || !target.blockId) continue;
                    
                    try {
                        // Get block data để lấy postType - sử dụng POST method
                        const formData = new FormData();
                        formData.append('action', 'jankx_get_block_post_type');
                        formData.append('block_id', target.blockId);
                        
                        const response = await fetch(window.ajaxurl || '/wp-admin/admin-ajax.php', {
                            method: 'POST',
                            body: formData,
                            credentials: 'same-origin'
                        });
                        
                        const data = await response.json();
                        if (data.success && data.data) {
                            postTypes.add(data.data);
                        }
                    } catch (error) {
                        console.error('Error fetching block post type:', error);
                    }
                }
                
                // Use first detected post type, or default to 'post'
                if (postTypes.size > 0) {
                    const newPostType = Array.from(postTypes)[0];
                    if (newPostType !== detectedPostType) {
                        setDetectedPostType(newPostType);
                    }
                } else if (!propPostType && detectedPostType !== 'post') {
                    setDetectedPostType('post');
                }
            };
            
            fetchTargetBlockPostTypes();
        } else if (propPostType) {
            if (detectedPostType !== propPostType) {
                setDetectedPostType(propPostType);
            }
        } else {
            // Nếu không có target blocks và không có propPostType, reset về 'post'
            if (detectedPostType !== 'post') {
                setDetectedPostType('post');
            }
        }
    }, [targetBlocks, propPostType]); // Removed detectedPostType from dependencies to avoid infinite loop

    // Lấy danh sách taxonomies dựa trên detected post type
    const { taxonomies } = useSelect((select) => {
        const { getTaxonomies } = select(coreDataStore);
        return {
            taxonomies: getTaxonomies({ per_page: -1, post_type: detectedPostType })
        };
    }, [detectedPostType]);

    // Lấy danh sách meta keys
    useEffect(() => {
        if (!detectedPostType) return;
        
        const fetchMetaKeys = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(
                    `${window.ajaxurl}?action=jankx_get_meta_keys&post_type=${detectedPostType}`,
                    { credentials: 'same-origin' }
                );
                const data = await response.json();
                if (data.success) {
                    setAvailableMetaKeys(data.data || []);
                }
            } catch (error) {
                console.error('Error fetching meta keys:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMetaKeys();
    }, [detectedPostType]);

    // Cập nhật available taxonomies
    useEffect(() => {
        if (taxonomies && detectedPostType) {
            const filtered = taxonomies.filter(tax =>
                tax.types.includes(detectedPostType) && tax.visibility.public
            );
            setAvailableTaxonomies(filtered);
        }
    }, [taxonomies, detectedPostType]);

    // Use detected post type
    const postType = detectedPostType;

    const updateFilterConfig = (key, value) => {
        setAttributes({
            filterConfig: {
                ...filterConfig,
                [key]: value
            }
        });
    };

    const addCustomFilter = () => {
        const newFilter = {
            id: `custom_${Date.now()}`,
            type: 'text',
            label: 'Custom Filter',
            field: '',
            operator: 'contains',
            value: '',
            enabled: true
        };
        setAttributes({
            customFilters: [...customFilters, newFilter]
        });
    };

    const updateCustomFilter = (index, key, value) => {
        const updated = [...customFilters];
        updated[index] = { ...updated[index], [key]: value };
        setAttributes({ customFilters: updated });
    };

    const removeCustomFilter = (index) => {
        const updated = customFilters.filter((_, i) => i !== index);
        setAttributes({ customFilters: updated });
    };

    const addMetaFilter = () => {
        const newFilter = {
            id: `meta_${Date.now()}`,
            metaKey: '',
            label: 'Meta Filter',
            type: 'text',
            operator: 'equals',
            compare: '=',  // WP_Query compare format
            value: '',
            enabled: true
        };
        setAttributes({
            metaFilters: [...metaFilters, newFilter]
        });
    };

    const updateMetaFilter = (index, key, value) => {
        const updated = [...metaFilters];
        updated[index] = { ...updated[index], [key]: value };
        setAttributes({ metaFilters: updated });
    };

    const removeMetaFilter = (index) => {
        const updated = metaFilters.filter((_, i) => i !== index);
        setAttributes({ metaFilters: updated });
    };

    const renderTaxonomyConfig = () => (
        <PanelBody title={__('Cấu hình Taxonomy', 'jankx')} initialOpen={true}>
            <SelectControl
                label={__('Taxonomy', 'jankx')}
                value={filterConfig.taxonomy || 'category'}
                options={[
                    { label: __('Chọn taxonomy...', 'jankx'), value: '' },
                    ...availableTaxonomies.map(tax => ({
                        label: tax.name,
                        value: tax.slug
                    }))
                ]}
                onChange={(value) => updateFilterConfig('taxonomy', value)}
            />

            <SelectControl
                label={__('Layout', 'jankx')}
                value={filterConfig.layout || 'dropdown'}
                options={[
                    { label: __('Dropdown', 'jankx'), value: 'dropdown' },
                    { label: __('Checkbox', 'jankx'), value: 'checkbox' },
                    { label: __('Radio', 'jankx'), value: 'radio' },
                    { label: __('Button Group', 'jankx'), value: 'button-group' },
                    { label: __('Tag Cloud', 'jankx'), value: 'tag-cloud' }
                ]}
                onChange={(value) => updateFilterConfig('layout', value)}
            />

            <TextControl
                label={__('Placeholder', 'jankx')}
                value={filterConfig.placeholder || ''}
                onChange={(value) => updateFilterConfig('placeholder', value)}
                placeholder={__('Nhập placeholder...', 'jankx')}
            />

            <TextControl
                label={__('Text "Tất cả"', 'jankx')}
                value={filterConfig.allText || ''}
                onChange={(value) => updateFilterConfig('allText', value)}
                placeholder={__('Tất cả', 'jankx')}
            />

            <ToggleControl
                label={__('Hiển thị số lượng', 'jankx')}
                checked={filterConfig.showCount || false}
                onChange={(value) => updateFilterConfig('showCount', value)}
            />

            <ToggleControl
                label={__('Cho phép chọn nhiều', 'jankx')}
                checked={filterConfig.multiple || false}
                onChange={(value) => updateFilterConfig('multiple', value)}
            />

            <ToggleControl
                label={__('Hiển thị tất cả', 'jankx')}
                checked={filterConfig.showAll || false}
                onChange={(value) => updateFilterConfig('showAll', value)}
            />

            <ToggleControl
                label={__('Có thể tìm kiếm', 'jankx')}
                checked={filterConfig.searchable || false}
                onChange={(value) => updateFilterConfig('searchable', value)}
            />

            <ToggleControl
                label={__('Hiển thị phân cấp', 'jankx')}
                checked={filterConfig.hierarchical || false}
                onChange={(value) => updateFilterConfig('hierarchical', value)}
            />

            <ToggleControl
                label={__('Hiển thị trống', 'jankx')}
                checked={filterConfig.showEmpty || false}
                onChange={(value) => updateFilterConfig('showEmpty', value)}
            />

            <SelectControl
                label={__('Sắp xếp theo', 'jankx')}
                value={filterConfig.orderBy || 'name'}
                options={[
                    { label: __('Tên', 'jankx'), value: 'name' },
                    { label: __('Slug', 'jankx'), value: 'slug' },
                    { label: __('Số lượng', 'jankx'), value: 'count' },
                    { label: __('ID', 'jankx'), value: 'id' }
                ]}
                onChange={(value) => updateFilterConfig('orderBy', value)}
            />

            <SelectControl
                label={__('Thứ tự', 'jankx')}
                value={filterConfig.order || 'ASC'}
                options={[
                    { label: __('Tăng dần', 'jankx'), value: 'ASC' },
                    { label: __('Giảm dần', 'jankx'), value: 'DESC' }
                ]}
                onChange={(value) => updateFilterConfig('order', value)}
            />
        </PanelBody>
    );

    const renderCustomFilters = () => (
        <PanelBody title={__('Bộ lọc tùy chỉnh', 'jankx')} initialOpen={false}>
            {customFilters.map((filter, index) => (
                <Card key={filter.id} size="small">
                    <CardHeader>
                        <Flex justify="space-between" align="center">
                            <FlexItem>
                                <TextControl
                                    value={filter.label}
                                    onChange={(value) => updateCustomFilter(index, 'label', value)}
                                    placeholder={__('Tên bộ lọc', 'jankx')}
                                />
                            </FlexItem>
                            <FlexItem>
                                <Button
                                    isDestructive
                                    isSmall
                                    onClick={() => removeCustomFilter(index)}
                                >
                                    {__('Xóa', 'jankx')}
                                </Button>
                            </FlexItem>
                        </Flex>
                    </CardHeader>
                    <CardBody>
                        <SelectControl
                            label={__('Loại', 'jankx')}
                            value={filter.type}
                            options={[
                                { label: __('Text', 'jankx'), value: 'text' },
                                { label: __('Number', 'jankx'), value: 'number' },
                                { label: __('Date', 'jankx'), value: 'date' },
                                { label: __('Select', 'jankx'), value: 'select' },
                                { label: __('Checkbox', 'jankx'), value: 'checkbox' }
                            ]}
                            onChange={(value) => updateCustomFilter(index, 'type', value)}
                        />
                        <TextControl
                            label={__('Field', 'jankx')}
                            value={filter.field}
                            onChange={(value) => updateCustomFilter(index, 'field', value)}
                            placeholder={__('Tên field', 'jankx')}
                        />
                        <SelectControl
                            label={__('Toán tử', 'jankx')}
                            value={filter.operator}
                            options={[
                                { label: __('Bằng', 'jankx'), value: 'equals' },
                                { label: __('Chứa', 'jankx'), value: 'contains' },
                                { label: __('Bắt đầu với', 'jankx'), value: 'starts_with' },
                                { label: __('Kết thúc với', 'jankx'), value: 'ends_with' },
                                { label: __('Lớn hơn', 'jankx'), value: 'greater_than' },
                                { label: __('Nhỏ hơn', 'jankx'), value: 'less_than' }
                            ]}
                            onChange={(value) => updateCustomFilter(index, 'operator', value)}
                        />
                        <TextControl
                            label={__('Giá trị', 'jankx')}
                            value={filter.value}
                            onChange={(value) => updateCustomFilter(index, 'value', value)}
                            placeholder={__('Giá trị mặc định', 'jankx')}
                        />
                        <ToggleControl
                            label={__('Kích hoạt', 'jankx')}
                            checked={filter.enabled}
                            onChange={(value) => updateCustomFilter(index, 'enabled', value)}
                        />
                    </CardBody>
                </Card>
            ))}
            <Button
                isPrimary
                onClick={addCustomFilter}
                style={{ marginTop: '10px' }}
            >
                {__('Thêm bộ lọc tùy chỉnh', 'jankx')}
            </Button>
        </PanelBody>
    );

    const renderMetaFilters = () => (
        <PanelBody title={__('Bộ lọc Meta', 'jankx')} initialOpen={false}>
            {isLoading && <Spinner />}
            {metaFilters.map((filter, index) => (
                <Card key={filter.id} size="small">
                    <CardHeader>
                        <Flex justify="space-between" align="center">
                            <FlexItem>
                                <TextControl
                                    value={filter.label}
                                    onChange={(value) => updateMetaFilter(index, 'label', value)}
                                    placeholder={__('Tên bộ lọc', 'jankx')}
                                />
                            </FlexItem>
                            <FlexItem>
                                <Button
                                    isDestructive
                                    isSmall
                                    onClick={() => removeMetaFilter(index)}
                                >
                                    {__('Xóa', 'jankx')}
                                </Button>
                            </FlexItem>
                        </Flex>
                    </CardHeader>
                    <CardBody>
                        <SelectControl
                            label={__('Meta Key', 'jankx')}
                            value={filter.metaKey}
                            options={[
                                { label: __('Chọn meta key...', 'jankx'), value: '' },
                                ...availableMetaKeys.map(key => ({
                                    label: key,
                                    value: key
                                }))
                            ]}
                            onChange={(value) => updateMetaFilter(index, 'metaKey', value)}
                        />
                        <SelectControl
                            label={__('Loại', 'jankx')}
                            value={filter.type}
                            options={[
                                { label: __('Text', 'jankx'), value: 'text' },
                                { label: __('Number', 'jankx'), value: 'number' },
                                { label: __('Date', 'jankx'), value: 'date' },
                                { label: __('Select', 'jankx'), value: 'select' },
                                { label: __('Checkbox', 'jankx'), value: 'checkbox' }
                            ]}
                            onChange={(value) => updateMetaFilter(index, 'type', value)}
                        />
                        <SelectControl
                            label={__('Toán tử', 'jankx')}
                            value={filter.operator || filter.compare || 'equals'}
                            options={[
                                { label: __('Bằng (=)', 'jankx'), value: 'equals' },
                                { label: __('Không bằng (!=)', 'jankx'), value: 'not_equals' },
                                { label: __('Chứa (LIKE)', 'jankx'), value: 'contains' },
                                { label: __('Không chứa (NOT LIKE)', 'jankx'), value: 'not_contains' },
                                { label: __('Lớn hơn (>)', 'jankx'), value: 'greater_than' },
                                { label: __('Lớn hơn hoặc bằng (>=)', 'jankx'), value: 'greater_equal' },
                                { label: __('Nhỏ hơn (<)', 'jankx'), value: 'less_than' },
                                { label: __('Nhỏ hơn hoặc bằng (<=)', 'jankx'), value: 'less_equal' },
                                { label: __('Trong danh sách (IN)', 'jankx'), value: 'in' },
                                { label: __('Không trong danh sách (NOT IN)', 'jankx'), value: 'not_in' },
                                { label: __('Tồn tại (EXISTS)', 'jankx'), value: 'exists' },
                                { label: __('Không tồn tại (NOT EXISTS)', 'jankx'), value: 'not_exists' }
                            ]}
                            onChange={(value) => {
                                // Map operator to WP_Query compare format
                                const compareMap = {
                                    'equals': '=',
                                    'not_equals': '!=',
                                    'contains': 'LIKE',
                                    'not_contains': 'NOT LIKE',
                                    'greater_than': '>',
                                    'greater_equal': '>=',
                                    'less_than': '<',
                                    'less_equal': '<=',
                                    'in': 'IN',
                                    'not_in': 'NOT IN',
                                    'exists': 'EXISTS',
                                    'not_exists': 'NOT EXISTS'
                                };
                                updateMetaFilter(index, 'operator', value);
                                updateMetaFilter(index, 'compare', compareMap[value] || '=');
                            }}
                        />
                        <TextControl
                            label={__('Giá trị', 'jankx')}
                            value={filter.value}
                            onChange={(value) => updateMetaFilter(index, 'value', value)}
                            placeholder={__('Giá trị mặc định', 'jankx')}
                        />
                        <ToggleControl
                            label={__('Kích hoạt', 'jankx')}
                            checked={filter.enabled}
                            onChange={(value) => updateMetaFilter(index, 'enabled', value)}
                        />
                    </CardBody>
                </Card>
            ))}
            <Button
                isPrimary
                onClick={addMetaFilter}
                style={{ marginTop: '10px' }}
            >
                {__('Thêm bộ lọc Meta', 'jankx')}
            </Button>
        </PanelBody>
    );

    return (
        <div className="jankx-advanced-filter-builder">
            {/* Hiển thị Post Type hiện tại */}
            {postType && (
                <PanelBody title={__('Post Type', 'jankx')} initialOpen={false}>
                    <Notice status="info" isDismissible={false}>
                        <p>
                            <strong>{__('Post Type:', 'jankx')}</strong> {postType}
                        </p>
                        {targetBlocks && targetBlocks.length > 0 && targetBlocks.some(t => t.enabled) ? (
                            <p style={{ fontSize: '12px', marginTop: '8px', marginBottom: 0 }}>
                                {__('Post type được tự động detect từ target blocks. Filters sẽ chỉ áp dụng cho post type này.', 'jankx')}
                            </p>
                        ) : (
                            <p style={{ fontSize: '12px', marginTop: '8px', marginBottom: 0, color: '#856404' }}>
                                {__('⚠️ Chưa có target blocks. Hãy chọn target blocks trong tab "Targets" để auto-detect post type.', 'jankx')}
                            </p>
                        )}
                    </Notice>
                </PanelBody>
            )}

            <PanelBody title={__('Loại bộ lọc', 'jankx')} initialOpen={true}>
                <SelectControl
                    label={__('Loại bộ lọc chính', 'jankx')}
                    value={filterType}
                    options={[
                        { label: __('Taxonomy', 'jankx'), value: 'taxonomy' },
                        { label: __('Meta Field', 'jankx'), value: 'meta' },
                        { label: __('Date Range', 'jankx'), value: 'date' },
                        { label: __('Price Range', 'jankx'), value: 'price' },
                        { label: __('Custom', 'jankx'), value: 'custom' }
                    ]}
                    onChange={(value) => setAttributes({ filterType: value })}
                />
            </PanelBody>

            {filterType === 'taxonomy' && renderTaxonomyConfig()}
            {renderCustomFilters()}
            {renderMetaFilters()}

            {/* Debug info (chỉ trong development) */}
            {process.env.NODE_ENV === 'development' && (
                <PanelBody title={__('Debug Info', 'jankx')} initialOpen={false}>
                    <div style={{ fontSize: '12px', color: '#666', fontFamily: 'monospace' }}>
                        <p><strong>Detected Post Type:</strong> {detectedPostType}</p>
                        <p><strong>Target Blocks:</strong> {targetBlocks?.length || 0}</p>
                        <p><strong>Available Taxonomies:</strong> {availableTaxonomies.length}</p>
                        <p><strong>Available Meta Keys:</strong> {availableMetaKeys.length}</p>
                    </div>
                </PanelBody>
            )}
        </div>
    );
};

export default FilterBuilder;
