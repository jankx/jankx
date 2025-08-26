import { useState, useEffect } from '@wordpress/element';
import {
    Modal,
    Button,
    TextControl,
    SelectControl,
    Spinner,
    Notice
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';

interface Icon {
    name: string;
    category?: string;
    prefixes?: string[];
}

interface IconPickerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (icon: Icon) => void;
    currentIcon?: Icon | null;
    iconType?: string;
    category?: string;
    onIconTypeChange?: (type: string) => void;
    onCategoryChange?: (category: string) => void;
}

const IconPickerModal = ({
    isOpen,
    onClose,
    onSelect,
    currentIcon,
    iconType = 'material',
    category = 'navigation',
    onIconTypeChange,
    onCategoryChange
}: IconPickerModalProps) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedIconType, setSelectedIconType] = useState(iconType);
    const [selectedCategory, setSelectedCategory] = useState(category);
    const [iconData, setIconData] = useState<Record<string, any>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

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
            } catch (err) {
                console.error('Failed to fetch icon data:', err);
                setError(__('Không thể tải danh sách icons', 'jankx'));
                setIconData({});
            } finally {
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

    const filteredIcons = icons.filter((icon: Icon) =>
        (!selectedCategory || icon.category === selectedCategory) &&
        icon.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleIconSelect = (icon: Icon) => {
        onSelect(icon);
        onClose();
        setSearchTerm('');
    };

    const handleIconTypeChange = (newIconType: string) => {
        setSelectedIconType(newIconType);
        const firstCategory = iconData[newIconType]?.categories?.[0] || '';
        setSelectedCategory(firstCategory);
        if (onIconTypeChange) onIconTypeChange(newIconType);
        if (onCategoryChange) onCategoryChange(firstCategory);
    };

    const handleCategoryChange = (newCategory: string) => {
        setSelectedCategory(newCategory);
        if (onCategoryChange) onCategoryChange(newCategory);
    };

    const renderIcon = (icon: Icon) => {
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

    const categoryOptions = categories.map((cat: string) => ({
        label: cat.charAt(0).toUpperCase() + cat.slice(1),
        value: cat
    }));

    return (
        <Modal
            isFullScreen={false}
            onRequestClose={onClose}
            title={__('Chọn Icon', 'jankx')}
            className="jankx-icon-picker-modal"
        >
            <div className="jankx-icon-picker-modal__content">
                {error && (
                    <Notice status="error" isDismissible={false}>
                        {error}
                    </Notice>
                )}

                {isLoading ? (
                    <div className="jankx-icon-picker-modal__loading">
                        <Spinner />
                        <p>{__('Đang tải danh sách icons...', 'jankx')}</p>
                    </div>
                ) : (
                    <>
                        <div className="jankx-icon-picker-modal__controls">
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
                        </div>

                        <div className="jankx-icon-picker-modal__grid">
                            {filteredIcons.map((icon: Icon) => (
                                <Button
                                    key={`${icon.name}-${icon.category}`}
                                    isSecondary
                                    className={`jankx-icon-picker-modal__icon-item ${
                                        currentIcon?.name === icon.name ? 'is-selected' : ''
                                    }`}
                                    onClick={() => handleIconSelect(icon)}
                                >
                                    {renderIcon(icon)}
                                    <span className="jankx-icon-picker-modal__icon-name">
                                        {icon.name}
                                    </span>
                                </Button>
                            ))}
                        </div>

                        {filteredIcons.length === 0 && (
                            <div className="jankx-icon-picker-modal__empty">
                                <p>{__('Không tìm thấy icon nào', 'jankx')}</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </Modal>
    );
};

export default IconPickerModal;
