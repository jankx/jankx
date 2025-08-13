import { useState, useEffect } from '@wordpress/element';
import {
    Popover,
    Button,
    TextControl,
    SelectControl,
    ColorPicker,
    RangeControl,
    ToggleControl,
    __experimentalBoxControl as BoxControl
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';

const IconPicker = ({
    value,
    onChange,
    iconType = 'material',
    category = 'navigation',
    onIconTypeChange,
    onCategoryChange
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedIconType, setSelectedIconType] = useState(iconType);
    const [selectedCategory, setSelectedCategory] = useState(category);
    const [iconData, setIconData] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    // Fetch icon data from Jankx Font Icons System
    useEffect(() => {
        const fetchIconData = async () => {
            setIsLoading(true);
            try {
                // Sử dụng Jankx Font Icons API endpoint
                const response = await apiFetch({
                    path: '/jankx/v1/icons/available',
                    method: 'GET'
                });
                setIconData(response || {});
            } catch (error) {
                console.error('Failed to fetch icon data:', error);
                setIconData({});
            } finally {
                setIsLoading(false);
            }
        };

        fetchIconData();
    }, []);

    const currentIconType = iconData[selectedIconType] || {};
    const categories = currentIconType.categories || [];
    const icons = currentIconType.icons || [];

    const filteredIcons = icons.filter(icon =>
        (!selectedCategory || icon.category === selectedCategory) &&
        icon.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleIconSelect = (icon) => {
        onChange(icon);
        setIsOpen(false);
        setSearchTerm('');
    };

    const handleIconTypeChange = (newIconType) => {
        setSelectedIconType(newIconType);
        const firstCategory = iconData[newIconType]?.categories?.[0] || '';
        setSelectedCategory(firstCategory);
        onIconTypeChange?.(newIconType);
        onCategoryChange?.(firstCategory);
    };

    const handleCategoryChange = (newCategory) => {
        setSelectedCategory(newCategory);
        onCategoryChange?.(newCategory);
    };

    const renderIcon = (icon) => {
        if (selectedIconType === 'material') {
            return <span className="material-icons">{icon.name}</span>;
        } else if (selectedIconType === 'fontawesome') {
            const prefix = icon.prefixes?.[0] || 'fas';
            return <i className={`${prefix} fa-${icon.name}`}></i>;
        } else if (selectedIconType === 'custom') {
            return <span className={`icon icon-${icon.name}`}></span>;
        }
        return null;
    };

    const iconTypeOptions = Object.keys(iconData).map(key => ({
        label: iconData[key].name || key.charAt(0).toUpperCase() + key.slice(1),
        value: key
    }));

    const categoryOptions = categories.map(cat => ({
        label: cat.charAt(0).toUpperCase() + cat.slice(1),
        value: cat
    }));

    return (
        <div className="jankx-icon-picker">
            <Button
                isSecondary
                onClick={() => setIsOpen(true)}
                className="jankx-icon-picker__button"
            >
                {value ? (
                    <span className="jankx-icon-picker__selected">
                        {renderIcon(value)}
                        <span className="jankx-icon-picker__name">{value.name}</span>
                    </span>
                ) : (
                    __('Chọn Icon', 'jankx')
                )}
            </Button>

            {isOpen && (
                <Popover
                    onClose={() => setIsOpen(false)}
                    className="jankx-icon-picker__popover"
                >
                    <div className="jankx-icon-picker__content">
                        <div className="jankx-icon-picker__header">
                            <h3>{__('Chọn Icon từ Jankx Font Icons', 'jankx')}</h3>

                            {isLoading ? (
                                <div className="jankx-icon-picker__loading">
                                    {__('Đang tải danh sách icons...', 'jankx')}
                                </div>
                            ) : (
                                <>
                                    <SelectControl
                                        label={__('Thư viện Icon', 'jankx')}
                                        value={selectedIconType}
                                        options={iconTypeOptions}
                                        onChange={handleIconTypeChange}
                                    />

                                    {categories.length > 0 && (
                                        <SelectControl
                                            label={__('Danh mục', 'jankx')}
                                            value={selectedCategory}
                                            options={categoryOptions}
                                            onChange={handleCategoryChange}
                                        />
                                    )}

                                    <TextControl
                                        label={__('Tìm kiếm', 'jankx')}
                                        value={searchTerm}
                                        onChange={setSearchTerm}
                                        placeholder={__('Nhập tên icon...', 'jankx')}
                                    />
                                </>
                            )}
                        </div>

                        {!isLoading && (
                            <div className="jankx-icon-picker__grid">
                                {filteredIcons.map((icon) => (
                                    <Button
                                        key={`${icon.name}-${icon.category}`}
                                        isSecondary
                                        className="jankx-icon-picker__icon-item"
                                        onClick={() => handleIconSelect(icon)}
                                    >
                                        {renderIcon(icon)}
                                        <span className="jankx-icon-picker__icon-name">
                                            {icon.name}
                                        </span>
                                    </Button>
                                ))}
                            </div>
                        )}

                        {!isLoading && filteredIcons.length === 0 && (
                            <div className="jankx-icon-picker__empty">
                                {__('Không tìm thấy icon nào', 'jankx')}
                            </div>
                        )}
                    </div>
                </Popover>
            )}
        </div>
    );
};

export default IconPicker;
