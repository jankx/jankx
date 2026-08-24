import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from '@wordpress/element';
import { Modal, Button, TextControl, SelectControl, Spinner, Notice } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
const IconPickerModal = ({ isOpen, onClose, onSelect, currentIcon, iconType = 'material', category = 'navigation', onIconTypeChange, onCategoryChange }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedIconType, setSelectedIconType] = useState(iconType);
    const [selectedCategory, setSelectedCategory] = useState(category);
    const [iconData, setIconData] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    // Fetch icon data
    useEffect(() => {
        const fetchIconData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await apiFetch({
                    path: '/jankx/v1/icons/available',
                    method: 'GET'
                });
                setIconData(response || {});
            }
            catch (err) {
                console.error('Failed to fetch icon data:', err);
                setError(__('Không thể tải danh sách icons', 'jankx'));
                setIconData({});
            }
            finally {
                setIsLoading(false);
            }
        };
        if (isOpen) {
            fetchIconData();
        }
    }, [isOpen]);
    const currentIconType = iconData[selectedIconType] || {};
    const categories = currentIconType.categories || [];
    const icons = currentIconType.icons || [];
    const filteredIcons = icons.filter((icon) => (!selectedCategory || icon.category === selectedCategory) &&
        icon.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const handleIconSelect = (icon) => {
        onSelect(icon);
        onClose();
        setSearchTerm('');
    };
    const handleIconTypeChange = (newIconType) => {
        setSelectedIconType(newIconType);
        const firstCategory = iconData[newIconType]?.categories?.[0] || '';
        setSelectedCategory(firstCategory);
        if (onIconTypeChange)
            onIconTypeChange(newIconType);
        if (onCategoryChange)
            onCategoryChange(firstCategory);
    };
    const handleCategoryChange = (newCategory) => {
        setSelectedCategory(newCategory);
        if (onCategoryChange)
            onCategoryChange(newCategory);
    };
    const renderIcon = (icon) => {
        if (selectedIconType === 'material') {
            return _jsx("span", { className: "material-icons", children: icon.name });
        }
        else if (selectedIconType === 'fontawesome') {
            const prefix = icon.prefixes?.[0] || 'fas';
            return _jsx("i", { className: `${prefix} fa-${icon.name}` });
        }
        else if (selectedIconType === 'custom') {
            return _jsx("span", { className: `icon icon-${icon.name}` });
        }
        return null;
    };
    const iconTypeOptions = Object.keys(iconData).map(key => ({
        label: iconData[key].name || key.charAt(0).toUpperCase() + key.slice(1),
        value: key
    }));
    const categoryOptions = categories.map((cat) => ({
        label: cat.charAt(0).toUpperCase() + cat.slice(1),
        value: cat
    }));
    return (_jsx(Modal, { isFullScreen: false, onRequestClose: onClose, title: __('Chọn Icon', 'jankx'), className: "jankx-icon-picker-modal", children: _jsxs("div", { className: "jankx-icon-picker-modal__content", children: [error && (_jsx(Notice, { status: "error", isDismissible: false, children: error })), isLoading ? (_jsxs("div", { className: "jankx-icon-picker-modal__loading", children: [_jsx(Spinner, {}), _jsx("p", { children: __('Đang tải danh sách icons...', 'jankx') })] })) : (_jsxs(_Fragment, { children: [_jsxs("div", { className: "jankx-icon-picker-modal__controls", children: [_jsx(SelectControl, { label: __('Thư viện Icon', 'jankx'), value: selectedIconType, options: iconTypeOptions, onChange: handleIconTypeChange }), categories.length > 0 && (_jsx(SelectControl, { label: __('Danh mục', 'jankx'), value: selectedCategory, options: categoryOptions, onChange: handleCategoryChange })), _jsx(TextControl, { label: __('Tìm kiếm', 'jankx'), value: searchTerm, onChange: setSearchTerm, placeholder: __('Nhập tên icon...', 'jankx') })] }), _jsx("div", { className: "jankx-icon-picker-modal__grid", children: filteredIcons.map((icon) => (_jsxs(Button, { isSecondary: true, className: `jankx-icon-picker-modal__icon-item ${currentIcon?.name === icon.name ? 'is-selected' : ''}`, onClick: () => handleIconSelect(icon), children: [renderIcon(icon), _jsx("span", { className: "jankx-icon-picker-modal__icon-name", children: icon.name })] }, `${icon.name}-${icon.category}`))) }), filteredIcons.length === 0 && (_jsx("div", { className: "jankx-icon-picker-modal__empty", children: _jsx("p", { children: __('Không tìm thấy icon nào', 'jankx') }) }))] }))] }) }));
};
export default IconPickerModal;
