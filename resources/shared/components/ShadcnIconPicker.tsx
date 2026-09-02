import { useState, useMemo, useCallback, useEffect } from '@wordpress/element';
import {
    Modal,
    Button,
    TextControl,
    Spinner,
    Notice,
    Flex,
    FlexItem
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import Fuse from 'fuse.js';

// Icon data structure
interface IconData {
    name: string;
    categories: string[];
    tags: string[];
    iconSet: string;
}

// Sample icon data with different icon sets
const sampleIconsData: IconData[] = [
    // Material Icons
    {
        name: "home",
        categories: ["navigation", "layout"],
        tags: ["house", "main", "start"],
        iconSet: "material"
    },
    {
        name: "user",
        categories: ["social", "people"],
        tags: ["person", "profile", "account"],
        iconSet: "material"
    },
    {
        name: "settings",
        categories: ["navigation", "system"],
        tags: ["gear", "config", "preferences"],
        iconSet: "material"
    },
    {
        name: "search",
        categories: ["navigation", "action"],
        tags: ["find", "lookup", "magnifier"],
        iconSet: "material"
    },
    {
        name: "heart",
        categories: ["social", "emotion"],
        tags: ["love", "like", "favorite"],
        iconSet: "material"
    },
    {
        name: "star",
        categories: ["social", "rating"],
        tags: ["favorite", "bookmark", "rating"],
        iconSet: "material"
    },
    {
        name: "mail",
        categories: ["communication", "social"],
        tags: ["email", "message", "contact"],
        iconSet: "material"
    },
    {
        name: "phone",
        categories: ["communication", "social"],
        tags: ["call", "contact", "telephone"],
        iconSet: "material"
    },
    {
        name: "calendar",
        categories: ["time", "date"],
        tags: ["schedule", "event", "date"],
        iconSet: "material"
    },
    {
        name: "clock",
        categories: ["time", "date"],
        tags: ["time", "hour", "schedule"],
        iconSet: "material"
    },
    // FontAwesome Icons
    {
        name: "home",
        categories: ["navigation", "layout"],
        tags: ["house", "main", "start"],
        iconSet: "fontawesome"
    },
    {
        name: "user",
        categories: ["social", "people"],
        tags: ["person", "profile", "account"],
        iconSet: "fontawesome"
    },
    {
        name: "cog",
        categories: ["navigation", "system"],
        tags: ["gear", "config", "preferences"],
        iconSet: "fontawesome"
    },
    {
        name: "search",
        categories: ["navigation", "action"],
        tags: ["find", "lookup", "magnifier"],
        iconSet: "fontawesome"
    },
    {
        name: "heart",
        categories: ["social", "emotion"],
        tags: ["love", "like", "favorite"],
        iconSet: "fontawesome"
    },
    {
        name: "star",
        categories: ["social", "rating"],
        tags: ["favorite", "bookmark", "rating"],
        iconSet: "fontawesome"
    },
    {
        name: "envelope",
        categories: ["communication", "social"],
        tags: ["email", "message", "contact"],
        iconSet: "fontawesome"
    },
    {
        name: "phone",
        categories: ["communication", "social"],
        tags: ["call", "contact", "telephone"],
        iconSet: "fontawesome"
    },
    {
        name: "calendar",
        categories: ["time", "date"],
        tags: ["schedule", "event", "date"],
        iconSet: "fontawesome"
    },
    {
        name: "clock",
        categories: ["time", "date"],
        tags: ["time", "hour", "schedule"],
        iconSet: "fontawesome"
    },
    // Dashicons
    {
        name: "admin-home",
        categories: ["navigation", "admin"],
        tags: ["home", "dashboard", "main"],
        iconSet: "dashicons"
    },
    {
        name: "admin-users",
        categories: ["social", "admin"],
        tags: ["users", "people", "admin"],
        iconSet: "dashicons"
    },
    {
        name: "admin-settings",
        categories: ["navigation", "admin"],
        tags: ["settings", "config", "admin"],
        iconSet: "dashicons"
    },
    {
        name: "search",
        categories: ["navigation", "action"],
        tags: ["find", "lookup", "search"],
        iconSet: "dashicons"
    },
    {
        name: "heart",
        categories: ["social", "emotion"],
        tags: ["love", "like", "favorite"],
        iconSet: "dashicons"
    },
    {
        name: "star-filled",
        categories: ["social", "rating"],
        tags: ["favorite", "bookmark", "rating"],
        iconSet: "dashicons"
    },
    {
        name: "email",
        categories: ["communication", "social"],
        tags: ["email", "message", "contact"],
        iconSet: "dashicons"
    },
    {
        name: "phone",
        categories: ["communication", "social"],
        tags: ["call", "contact", "telephone"],
        iconSet: "dashicons"
    },
    {
        name: "calendar-alt",
        categories: ["time", "date"],
        tags: ["schedule", "event", "date"],
        iconSet: "dashicons"
    },
    {
        name: "clock",
        categories: ["time", "date"],
        tags: ["time", "hour", "schedule"],
        iconSet: "dashicons"
    }
];

interface ShadcnIconPickerProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (icon: IconData) => void;
    currentIcon?: IconData | null;
    searchable?: boolean;
    categorized?: boolean;
}

const ShadcnIconPicker = ({
    isOpen,
    onClose,
    onSelect,
    currentIcon,
    searchable = true,
    categorized = true
}: ShadcnIconPickerProps) => {
    const [search, setSearch] = useState('');
    const [selectedIconSet, setSelectedIconSet] = useState('material');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Reset search when modal opens/closes
    useEffect(() => {
        if (!isOpen) {
            setSearch('');
            setSelectedCategory('all');
        }
    }, [isOpen]);

    // Get available icon sets
    const iconSets = useMemo(() => {
        const sets = new Set(sampleIconsData.map(icon => icon.iconSet));
        return Array.from(sets).map(set => ({
            name: set.charAt(0).toUpperCase() + set.slice(1),
            value: set
        }));
    }, []);

    // Get available categories for current icon set
    const categories = useMemo(() => {
        const iconSetIcons = sampleIconsData.filter(icon => icon.iconSet === selectedIconSet);
        const cats = new Set(iconSetIcons.flatMap(icon => icon.categories));
        return Array.from(cats).map(cat => ({
            name: cat.charAt(0).toUpperCase() + cat.slice(1),
            value: cat
        }));
    }, [selectedIconSet]);

    // Fuse.js for fuzzy search
    const fuseInstance = useMemo(() => {
        const iconSetIcons = sampleIconsData.filter(icon => icon.iconSet === selectedIconSet);
        return new Fuse(iconSetIcons, {
            keys: ['name', 'tags', 'categories'],
            threshold: 0.3,
            ignoreLocation: true,
            includeScore: true,
        });
    }, [selectedIconSet]);

    // Filter icons based on search and category
    const filteredIcons = useMemo(() => {
        let icons = sampleIconsData.filter(icon => icon.iconSet === selectedIconSet);

        // Filter by category
        if (selectedCategory !== 'all') {
            icons = icons.filter(icon => icon.categories.includes(selectedCategory));
        }

        // Filter by search
        if (search.trim() !== '') {
            const results = fuseInstance.search(search.toLowerCase().trim());
            const searchResults = results.map(result => result.item);
            icons = icons.filter(icon => searchResults.some(result => result.name === icon.name));
        }

        return icons;
    }, [search, selectedIconSet, selectedCategory, fuseInstance]);

    // Categorize icons for display
    const categorizedIcons = useMemo(() => {
        if (!categorized || search.trim() !== '' || selectedCategory !== 'all') {
            return [{ name: 'All Icons', icons: filteredIcons }];
        }

        const categories = new Map<string, IconData[]>();

        filteredIcons.forEach(icon => {
            if (icon.categories && icon.categories.length > 0) {
                icon.categories.forEach(category => {
                    if (!categories.has(category)) {
                        categories.set(category, []);
                    }
                    categories.get(category)!.push(icon);
                });
            } else {
                const category = 'Other';
                if (!categories.has(category)) {
                    categories.set(category, []);
                }
                categories.get(category)!.push(icon);
            }
        });

        return Array.from(categories.entries())
            .map(([name, icons]) => ({ name, icons }))
            .sort((a, b) => a.name.localeCompare(b.name));
    }, [filteredIcons, categorized, search, selectedCategory]);

    const handleIconSelect = useCallback((icon: IconData) => {
        onSelect(icon);
        onClose();
    }, [onSelect, onClose]);

    const handleSearchChange = useCallback((value: string) => {
        setSearch(value);
    }, []);

    const handleIconSetChange = useCallback((iconSet: string) => {
        setSelectedIconSet(iconSet);
        setSelectedCategory('all');
        setSearch('');
    }, []);

    const handleCategoryChange = useCallback((category: string) => {
        setSelectedCategory(category);
    }, []);

    const handleClose = useCallback(() => {
        onClose();
    }, [onClose]);

    const renderIcon = useCallback((icon: IconData) => {
        let iconElement;

        if (icon.iconSet === 'material') {
            iconElement = <span className="material-icons">{icon.name}</span>;
        } else if (icon.iconSet === 'fontawesome') {
            iconElement = <i className={`fas fa-${icon.name}`}></i>;
        } else if (icon.iconSet === 'dashicons') {
            iconElement = <span className={`dashicons dashicons-${icon.name}`}></span>;
        } else {
            iconElement = <span className="material-icons">{icon.name}</span>;
        }

        return (
            <Button
                key={`${icon.iconSet}-${icon.name}`}
                isSecondary
                className={`jankx-icon-picker-modal__icon-item ${
                    currentIcon?.name === icon.name && currentIcon?.iconSet === icon.iconSet ? 'is-selected' : ''
                }`}
                onClick={() => handleIconSelect(icon)}
            >
                {iconElement}
                <span className="jankx-icon-picker-modal__icon-name">
                    {icon.name}
                </span>
            </Button>
        );
    }, [handleIconSelect, currentIcon]);

    if (!isOpen) {
        return null;
    }

    return (
        <Modal
            isFullScreen={false}
            onRequestClose={handleClose}
            title={__('Chọn Icon', 'jankx')}
            className="jankx-icon-picker-modal"
            overlayClassName="jankx-icon-picker-modal-overlay"
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
                    <Flex className="jankx-icon-picker-modal__layout">
                        {/* Left Sidebar - Icon Sets */}
                        <FlexItem className="jankx-icon-picker-modal__sidebar">
                            <div className="jankx-icon-picker-modal__sidebar-header">
                                <h3>{__('Icon Sets', 'jankx')}</h3>
                            </div>
                            <div className="jankx-icon-picker-modal__icon-sets">
                                {iconSets.map((iconSet) => (
                                    <Button
                                        key={iconSet.value}
                                        isSecondary
                                        className={`jankx-icon-picker-modal__icon-set-item ${
                                            selectedIconSet === iconSet.value ? 'is-selected' : ''
                                        }`}
                                        onClick={() => handleIconSetChange(iconSet.value)}
                                    >
                                        {iconSet.name}
                                    </Button>
                                ))}
                            </div>
                        </FlexItem>

                        {/* Right Main Panel - Icon Grid */}
                        <FlexItem className="jankx-icon-picker-modal__main-panel">
                            <div className="jankx-icon-picker-modal__controls">
                                <Flex gap={2} align="center">
                                    <FlexItem>
                                        <select
                                            value={selectedCategory}
                                            onChange={(e) => handleCategoryChange(e.target.value)}
                                            className="jankx-icon-picker-modal__category-select"
                                        >
                                            <option value="all">{__('All Categories', 'jankx')}</option>
                                            {categories.map((category) => (
                                                <option key={category.value} value={category.value}>
                                                    {category.name}
                                                </option>
                                            ))}
                                        </select>
                                    </FlexItem>
                                    <FlexItem>
                                        {searchable && (
                                            <TextControl
                                                value={search}
                                                onChange={handleSearchChange}
                                                placeholder={__('Search icons...', 'jankx')}
                                                className="jankx-icon-picker-modal__search"
                                            />
                                        )}
                                    </FlexItem>
                                </Flex>
                            </div>

                            <div className="jankx-icon-picker-modal__scroll-container">
                                {filteredIcons.length === 0 ? (
                                    <div className="jankx-icon-picker-modal__empty">
                                        <p>{__('Không tìm thấy icon nào', 'jankx')}</p>
                                    </div>
                                ) : (
                                    <>
                                        {categorizedIcons.map((category) => (
                                            <div key={category.name} className="jankx-icon-picker-modal__category">
                                                <h3 className="jankx-icon-picker-modal__category-title">
                                                    {category.name}
                                                </h3>
                                                <div className="jankx-icon-picker-modal__icon-grid">
                                                    {category.icons.map(renderIcon)}
                                                </div>
                                            </div>
                                        ))}
                                    </>
                                )}
                            </div>
                        </FlexItem>
                    </Flex>
                )}
            </div>
        </Modal>
    );
};

export default ShadcnIconPicker;
