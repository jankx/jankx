import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from '@wordpress/element';
import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import ShadcnIconPicker from './ShadcnIconPicker';
const IconPicker = ({ value, onChange, iconType = 'material', category = 'navigation', onIconTypeChange, onCategoryChange }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleIconSelect = (icon) => {
        onChange({
            name: icon.name,
            category: icon.categories?.[0] || category,
            iconSet: icon.iconSet || 'material'
        });
        // Không cần setIsModalOpen(false) ở đây vì ShadcnIconPicker sẽ gọi onClose
    };
    const handleClose = () => {
        setIsModalOpen(false);
    };
    const renderSelectedIcon = () => {
        if (!value) {
            return __('Chọn Icon', 'jankx');
        }
        let iconElement;
        if (value.iconSet === 'material') {
            iconElement = _jsx("span", { className: "material-icons", children: value.name });
        }
        else if (value.iconSet === 'fontawesome') {
            iconElement = _jsx("i", { className: `fas fa-${value.name}` });
        }
        else if (value.iconSet === 'dashicons') {
            iconElement = _jsx("span", { className: `dashicons dashicons-${value.name}` });
        }
        else {
            iconElement = _jsx("span", { className: "material-icons", children: value.name });
        }
        return (_jsxs("span", { className: "jankx-icon-picker__selected", children: [iconElement, _jsx("span", { className: "jankx-icon-picker__name", children: value.name })] }));
    };
    return (_jsxs("div", { className: "jankx-icon-picker", children: [_jsx(Button, { isSecondary: true, onClick: () => setIsModalOpen(true), className: "jankx-icon-picker__button", children: renderSelectedIcon() }), _jsx(ShadcnIconPicker, { isOpen: isModalOpen, onClose: handleClose, onSelect: handleIconSelect, currentIcon: value, searchable: true, categorized: true })] }));
};
export default IconPicker;
