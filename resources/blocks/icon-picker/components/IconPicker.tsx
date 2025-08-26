import { useState } from '@wordpress/element';
import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import ShadcnIconPicker from './ShadcnIconPicker';

interface Icon {
    name: string;
    category?: string;
    categories?: string[];
    iconSet?: string;
}

interface IconPickerProps {
    value?: Icon | null;
    onChange: (icon: Icon) => void;
    iconType?: string;
    category?: string;
    onIconTypeChange?: (type: string) => void;
    onCategoryChange?: (category: string) => void;
}

const IconPicker = ({
    value,
    onChange,
    iconType = 'material',
    category = 'navigation',
    onIconTypeChange,
    onCategoryChange
}: IconPickerProps) => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const handleIconSelect = (icon: Icon): void => {
        onChange({
            name: icon.name,
            category: icon.categories?.[0] || category,
            iconSet: icon.iconSet || 'material'
        });
        // Không cần setIsModalOpen(false) ở đây vì ShadcnIconPicker sẽ gọi onClose
    };

    const handleClose = (): void => {
        setIsModalOpen(false);
    };

    const renderSelectedIcon = (): JSX.Element | string => {
        if (!value) {
            return __('Chọn Icon', 'jankx');
        }

        let iconElement;
        if (value.iconSet === 'material') {
            iconElement = <span className="material-icons">{value.name}</span>;
        } else if (value.iconSet === 'fontawesome') {
            iconElement = <i className={`fas fa-${value.name}`}></i>;
        } else if (value.iconSet === 'dashicons') {
            iconElement = <span className={`dashicons dashicons-${value.name}`}></span>;
        } else {
            iconElement = <span className="material-icons">{value.name}</span>;
        }

        return (
            <span className="jankx-icon-picker__selected">
                {iconElement}
                <span className="jankx-icon-picker__name">{value.name}</span>
            </span>
        );
    };

    return (
        <div className="jankx-icon-picker">
            <Button
                isSecondary
                onClick={() => setIsModalOpen(true)}
                className="jankx-icon-picker__button"
            >
                {renderSelectedIcon()}
            </Button>

            <ShadcnIconPicker
                isOpen={isModalOpen}
                onClose={handleClose}
                onSelect={handleIconSelect}
                currentIcon={value}
                searchable={true}
                categorized={true}
            />
        </div>
    );
};

export default IconPicker;
