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
    Spinner
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { store as coreDataStore } from '@wordpress/core-data';

const FilterBuilder = ({ attributes, setAttributes, postType = 'post' }) => {
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

    // Lấy danh sách taxonomies
    const { taxonomies } = useSelect((select) => {
        const { getTaxonomies } = select(coreDataStore);
        return {
            taxonomies: getTaxonomies({ per_page: -1, post_type: postType })
        };
    }, [postType]);

    // Lấy danh sách meta keys
    useEffect(() => {
        const fetchMetaKeys = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(
                    `${window.ajaxurl}?action=jankx_get_meta_keys&post_type=${postType}`,
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
    }, [postType]);

    // Cập nhật available taxonomies
    useEffect(() => {
        if (taxonomies) {
            const filtered = taxonomies.filter(tax =>
                tax.types.includes(postType) && tax.visibility.public
            );
            setAvailableTaxonomies(filtered);
        }
    }, [taxonomies, postType]);

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
                            value={filter.operator}
                            options={[
                                { label: __('Bằng', 'jankx'), value: 'equals' },
                                { label: __('Chứa', 'jankx'), value: 'contains' },
                                { label: __('Lớn hơn', 'jankx'), value: 'greater_than' },
                                { label: __('Nhỏ hơn', 'jankx'), value: 'less_than' },
                                { label: __('Tồn tại', 'jankx'), value: 'exists' },
                                { label: __('Không tồn tại', 'jankx'), value: 'not_exists' }
                            ]}
                            onChange={(value) => updateMetaFilter(index, 'operator', value)}
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
        </div>
    );
};

export default FilterBuilder;
