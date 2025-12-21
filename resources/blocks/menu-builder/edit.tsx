/**
 * Menu Builder Block - Edit Component
 * Responsive menu with mmenu integration for JankX theme
 */

import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, InnerBlocks } from '@wordpress/block-editor';
import { PanelBody, TextControl, SelectControl, CheckboxControl, Button, RangeControl, ToggleControl, Card, CardBody } from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';
import { plus, trash, pencil, arrowUp, arrowDown, menu } from '@wordpress/icons';
import { Icon } from '@wordpress/icons';
import metadata from './block.json';

// Global variable declaration
declare global {
    interface Window {
        jankxMenuBuilderAdmin: {
            apiUrl: string;
            nonce: string;
            menuTypes: Record<string, string>;
            submenuTypes: Record<string, string>;
            defaultSettings: any;
        };
    }
}

// Types
interface MenuItem {
    id: string;
    label: string;
    url: string;
    type: 'link' | 'button';
    children?: MenuItem[];
    submenuType?: 'multilevel' | 'mega' | 'flyout';
    megaMenuColumns?: number;
    megaMenuFullWidth?: boolean;
    flyoutPosition?: 'left' | 'right';
    flyoutWidth?: string;
    multilevelMaxDepth?: number;
    icon?: string;
    target?: '_self' | '_blank';
    rel?: string;
    cssClass?: string;
    isActive?: boolean;
    orderIndex?: number;
}

interface BlockAttributes {
    menuItems: MenuItem[];
    mobileBreakpoint: number;
    desktopBreakpoint: number;
    enableMobileMenu: boolean;
    enableDesktopMenu: boolean;
    mobileMenuOptions: {
        slidingSubmenus: boolean;
        theme: string;
        position: string;
        zposition: string;
    };
    desktopMenuOptions: {
        dropdownAnimation: string;
        hoverDelay: number;
        submenuTrigger: string;
    };
    menuId: string;
    menuClass: string;
    mobileMenuIcon: string;
    mobileMenuPosition: string;
    submenuTypes: {
        mega: {
            enabled: boolean;
            columns: number;
            fullWidth: boolean;
        };
        flyout: {
            enabled: boolean;
            position: string;
            animation: string;
        };
        multilevel: {
            enabled: boolean;
            maxDepth: number;
        };
    };
    megaMenuSettings: {
        containerWidth: string;
        columnGap: string;
        padding: string;
    };
    flyoutMenuSettings: {
        width: string;
        animation: string;
        position: string;
    };
    multilevelMenuSettings: {
        maxDepth: number;
        indicator: boolean;
        animation: string;
    };
}

const Edit = ({ attributes, setAttributes }: { attributes: BlockAttributes, setAttributes: (updates: Partial<BlockAttributes>) => void }) => {
    const {
        menuItems,
        mobileBreakpoint,
        desktopBreakpoint,
        enableMobileMenu,
        enableDesktopMenu,
        mobileMenuOptions,
        desktopMenuOptions,
        menuId,
        menuClass,
        mobileMenuIcon,
        mobileMenuPosition,
        submenuTypes,
        megaMenuSettings,
        flyoutMenuSettings,
        multilevelMenuSettings
    } = attributes;

    const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
    const [isAddingItem, setIsAddingItem] = useState(false);
    const [newItem, setNewItem] = useState<Partial<MenuItem>>({
        label: '',
        url: '',
        type: 'link',
        children: []
    });

    // Inner blocks template for menu items
    const innerBlocksTemplate = [
        ['jankx/menu-builder/menu-item', {}]
    ];

    // Generate unique menu ID if not set
    useEffect(() => {
        if (!menuId) {
            setAttributes({
                menuId: 'jankx-menu-' + Math.random().toString(36).substr(2, 9)
            });
        }
    }, [menuId]);

    /**
 * Add new menu item
 */
    const addMenuItem = () => {
        if (!newItem.label) return;

        const item: MenuItem = {
            id: 'item-' + Math.random().toString(36).substr(2, 9),
            label: newItem.label || '',
            url: newItem.url || '#',
            type: newItem.type as MenuItem['type'] || 'link',
            children: []
        };

        setAttributes({
            menuItems: [...menuItems, item]
        });

        // Reset form
        setNewItem({
            label: '',
            url: '',
            type: 'link',
            children: []
        });
        setIsAddingItem(false);

        // Save to database via API if menuId exists
        if (menuId) {
            saveMenuItemToDatabase(item);
        }
    };

    /**
     * Save menu item to database
     */
    const saveMenuItemToDatabase = async (item: MenuItem) => {
        try {
            if (!window.jankxMenuBuilderAdmin) {
                console.error('jankxMenuBuilderAdmin not available');
                return;
            }

            const response = await fetch(`${window.jankxMenuBuilderAdmin.apiUrl}/menus/${menuId}/items`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-WP-Nonce': window.jankxMenuBuilderAdmin.nonce
                },
                body: JSON.stringify({
                    label: item.label,
                    url: item.url,
                    type: item.type,
                    submenu_type: item.submenuType || 'multilevel',
                    parent_id: 0,
                    settings: {
                        megaMenuColumns: item.megaMenuColumns || 4,
                        megaMenuFullWidth: item.megaMenuFullWidth || true,
                        flyoutPosition: item.flyoutPosition || 'right',
                        flyoutWidth: item.flyoutWidth || '300px'
                    }
                })
            });

            if (response.ok) {
                const data = await response.json();
                // Update local item with database ID
                item.id = data.id.toString();
            }
        } catch (error) {
            console.error('Failed to save menu item:', error);
        }
    };

    /**
     * Update menu item recursively
     */
    const updateMenuItem = (itemId: string, updates: Partial<MenuItem>) => {
        const updateItemRecursive = (items: MenuItem[]): MenuItem[] => {
            return items.map(item => {
                if (item.id === itemId) {
                    return { ...item, ...updates };
                }
                if (item.children && item.children.length > 0) {
                    return {
                        ...item,
                        children: updateItemRecursive(item.children)
                    };
                }
                return item;
            });
        };

        setAttributes({
            menuItems: updateItemRecursive(menuItems)
        });
    };

    /**
     * Delete menu item recursively
     */
    const deleteMenuItem = (itemId: string) => {
        const deleteItemRecursive = (items: MenuItem[]): MenuItem[] => {
            return items.filter(item => {
                if (item.id === itemId) {
                    return false;
                }
                if (item.children && item.children.length > 0) {
                    item.children = deleteItemRecursive(item.children);
                }
                return true;
            });
        };

        setAttributes({
            menuItems: deleteItemRecursive(menuItems)
        });
        setSelectedItem(null);
    };

    /**
     * Move menu item up
     */
    const moveItemUp = (itemId: string) => {
        const moveUpRecursive = (items: MenuItem[]): MenuItem[] => {
            const newItems = [...items];
            for (let i = 0; i < newItems.length; i++) {
                if (newItems[i].id === itemId && i > 0) {
                    // Swap with previous item
                    const temp = newItems[i];
                    newItems[i] = newItems[i - 1];
                    newItems[i - 1] = temp;
                    return newItems;
                }
                // Check children
                if (newItems[i].children && newItems[i].children.length > 0) {
                            const updatedChildren = moveUpRecursive(newItems[i].children);
                            if (updatedChildren !== newItems[i].children) {
                                newItems[i] = {
                                    ...newItems[i],
                                    children: updatedChildren,
                                    id: newItems[i].id || ''
                                };
                                return newItems;
                            }
                        }
            }
            return newItems;
        };

        setAttributes({
            menuItems: moveUpRecursive(menuItems)
        });
    };

    /**
     * Move menu item down
     */
    const moveItemDown = (itemId: string) => {
        const moveDownRecursive = (items: MenuItem[]): MenuItem[] => {
            for (let i = 0; i < items.length; i++) {
                if (items[i].id === itemId && i < items.length - 1) {
                    // Swap with next item
                    const temp = items[i];
                    items[i] = items[i + 1];
                    items[i + 1] = temp;
                    return items;
                }
                if (items[i].children && items[i].children.length > 0) {
                    const result = moveDownRecursive(items[i].children);
                    if (result !== items[i].children) {
                        items[i].children = result;
                        return items;
                    }
                }
            }
            return items;
        };

        setAttributes({
            menuItems: moveDownRecursive([...menuItems])
        });
    };

    /**
     * Add submenu item
     */
    const addSubmenuItem = (parentItemId: string) => {
        const submenuItem: MenuItem = {
            id: 'item-' + Math.random().toString(36).substr(2, 9),
            label: __('New Submenu Item', 'jankx'),
            url: '#',
            type: 'link',
            children: []
        };

        const addSubmenuRecursive = (items: MenuItem[]): MenuItem[] => {
            return items.map(item => {
                if (item.id === parentItemId) {
                    return {
                        ...item,
                        children: [...(item.children || []), submenuItem]
                    };
                }
                if (item.children && item.children.length > 0) {
                    return {
                        ...item,
                        children: addSubmenuRecursive(item.children)
                    };
                }
                return item;
            });
        };

        setAttributes({
            menuItems: addSubmenuRecursive(menuItems)
        });
    };

    /**
     * Render menu items tree
     */
    const renderMenuItems = (items: MenuItem[], level = 0): JSX.Element[] => {
        return items.map(item => (
            <Card key={item.id} className={`menu-item level-${level}`}>
                <CardBody>
                    <div className="menu-item-header">
                        <div className="menu-item-info">
                            <div className="menu-item-label">{item.label}</div>
                            <div className="menu-item-url">{item.url}</div>
                            <div className="menu-item-type">{item.type}</div>
                            {item.submenuType && (
                                <div className="menu-item-submenu-type">
                                    <span className="submenu-type-badge">
                                        {item.submenuType === 'mega' && __('Mega', 'jankx')}
                                        {item.submenuType === 'flyout' && __('Flyout', 'jankx')}
                                        {item.submenuType === 'multilevel' && __('Multilevel', 'jankx')}
                                    </span>
                                </div>
                            )}
                        </div>
                        <div className="menu-item-actions">
                            <Button
                                icon={pencil}
                                label={__('Edit', 'jankx')}
                                onClick={() => setSelectedItem(item)}
                                isSmall
                            />
                            <Button
                                icon={plus}
                                label={__('Add Submenu', 'jankx')}
                                onClick={() => addSubmenuItem(item.id)}
                                isSmall
                            />
                            <Button
                                icon={arrowUp}
                                label={__('Move Up', 'jankx')}
                                onClick={() => moveItemUp(item.id)}
                                isSmall
                                disabled={level === 0 && menuItems[0]?.id === item.id}
                            />
                            <Button
                                icon={arrowDown}
                                label={__('Move Down', 'jankx')}
                                onClick={() => moveItemDown(item.id)}
                                isSmall
                                disabled={level === 0 && menuItems[menuItems.length - 1]?.id === item.id}
                            />
                            <Button
                                icon={trash}
                                label={__('Delete', 'jankx')}
                                onClick={() => deleteMenuItem(item.id)}
                                isSmall
                                isDestructive
                            />
                        </div>
                    </div>
                    {item.children && item.children.length > 0 && (
                        <div className="menu-item-children">
                            {renderMenuItems(item.children, level + 1)}
                        </div>
                    )}
                </CardBody>
            </Card>
        ));
    };

    /**
     * Render item editor
     */
    const renderItemEditor = (): JSX.Element | null => {
        if (!selectedItem) return null;

        return (
            <PanelBody title={__('Edit Menu Item', 'jankx')} initialOpen={true}>
                <TextControl
                    label={__('Label', 'jankx')}
                    value={selectedItem.label}
                    onChange={(label) => updateMenuItem(selectedItem.id, { label })}
                />
                <TextControl
                    label={__('URL', 'jankx')}
                    value={selectedItem.url}
                    onChange={(url) => updateMenuItem(selectedItem.id, { url })}
                />
                <SelectControl
                    label={__('Type', 'jankx')}
                    value={selectedItem.type}
                    options={[
                        { label: __('Link', 'jankx'), value: 'link' },
                        { label: __('Button', 'jankx'), value: 'button' }
                    ]}
                    onChange={(type) => updateMenuItem(selectedItem.id, { type: type as MenuItem['type'] })}
                />
                
                {selectedItem.children && selectedItem.children.length > 0 && (
                    <>
                        <SelectControl
                            label={__('Submenu Type', 'jankx')}
                            value={selectedItem.submenuType || 'multilevel'}
                            options={[
                                { label: __('Multilevel Menu', 'jankx'), value: 'multilevel' },
                                { label: __('Mega Menu', 'jankx'), value: 'mega' },
                                { label: __('Flyout Menu', 'jankx'), value: 'flyout' }
                            ]}
                            onChange={(submenuType) => updateMenuItem(selectedItem.id, { 
                                submenuType: submenuType as MenuItem['submenuType'] || 'multilevel'
                            })}
                        />
                        
                        {selectedItem.submenuType === 'mega' && (
                            <>
                                <RangeControl
                                    label={__('Columns', 'jankx')}
                                    value={selectedItem.megaMenuColumns || 4}
                                    onChange={(megaMenuColumns) => updateMenuItem(selectedItem.id, { 
                                        megaMenuColumns: megaMenuColumns || 4
                                    })}
                                    min={2}
                                    max={6}
                                />
                                <ToggleControl
                                    label={__('Full Width', 'jankx')}
                                    checked={selectedItem.megaMenuFullWidth || false}
                                    onChange={(megaMenuFullWidth) => updateMenuItem(selectedItem.id, { 
                                        megaMenuFullWidth 
                                    })}
                                />
                            </>
                        )}
                        
                        {selectedItem.submenuType === 'flyout' && (
                            <>
                                <SelectControl
                                    label={__('Position', 'jankx')}
                                    value={selectedItem.flyoutPosition || 'right'}
                                    options={[
                                        { label: __('Left', 'jankx'), value: 'left' },
                                        { label: __('Right', 'jankx'), value: 'right' }
                                    ]}
                                    onChange={(flyoutPosition) => updateMenuItem(selectedItem.id, { 
                                        flyoutPosition: flyoutPosition as MenuItem['flyoutPosition'] || 'right'
                                    })}
                                />
                                <TextControl
                                    label={__('Width', 'jankx')}
                                    value={selectedItem.flyoutWidth || '300px'}
                                    onChange={(flyoutWidth) => updateMenuItem(selectedItem.id, { 
                                        flyoutWidth 
                                    })}
                                />
                            </>
                        )}
                    </>
                )}
                
                <Button
                    isDestructive
                    onClick={() => deleteMenuItem(selectedItem.id)}
                >
                    {__('Delete Item', 'jankx')}
                </Button>
            </PanelBody>
        );
    };

    const blockProps = useBlockProps({
        className: menuClass,
        id: menuId
    });

    return (
        <div {...blockProps}>
            <InspectorControls>
                <PanelBody title={__('Responsive Settings', 'jankx')} initialOpen={true}>
                    <ToggleControl
                        label={__('Enable Mobile Menu', 'jankx')}
                        checked={enableMobileMenu}
                        onChange={(enableMobileMenu) => setAttributes({ enableMobileMenu })}
                    />
                    <ToggleControl
                        label={__('Enable Desktop Menu', 'jankx')}
                        checked={enableDesktopMenu}
                        onChange={(enableDesktopMenu) => setAttributes({ enableDesktopMenu })}
                    />
                    <RangeControl
                        label={__('Mobile Breakpoint', 'jankx')}
                        value={mobileBreakpoint}
                        onChange={(mobileBreakpoint) => setAttributes({ mobileBreakpoint: mobileBreakpoint || 768 })}
                        min={320}
                        max={1200}
                    />
                    <RangeControl
                        label={__('Desktop Breakpoint', 'jankx')}
                        value={desktopBreakpoint}
                        onChange={(desktopBreakpoint) => setAttributes({ desktopBreakpoint: desktopBreakpoint || 1024 })}
                        min={768}
                        max={1920}
                    />
                </PanelBody>

                <PanelBody title={__('Mobile Menu Options', 'jankx')} initialOpen={false}>
                    <ToggleControl
                        label={__('Sliding Submenus', 'jankx')}
                        checked={mobileMenuOptions.slidingSubmenus}
                        onChange={(slidingSubmenus) => 
                            setAttributes({
                                mobileMenuOptions: { ...mobileMenuOptions, slidingSubmenus }
                            })
                        }
                    />
                    <SelectControl
                        label={__('Theme', 'jankx')}
                        value={mobileMenuOptions.theme}
                        options={[
                            { label: __('Dark', 'jankx'), value: 'dark' },
                            { label: __('Light', 'jankx'), value: 'light' },
                            { label: __('Auto', 'jankx'), value: 'auto' }
                        ]}
                        onChange={(theme) => 
                            setAttributes({
                                mobileMenuOptions: { ...mobileMenuOptions, theme: theme as 'dark' | 'light' | 'auto' }
                            })
                        }
                    />
                    <SelectControl
                        label={__('Position', 'jankx')}
                        value={mobileMenuOptions.position}
                        options={[
                            { label: __('Left', 'jankx'), value: 'left' },
                            { label: __('Right', 'jankx'), value: 'right' }
                        ]}
                        onChange={(position) => 
                            setAttributes({
                                mobileMenuOptions: { ...mobileMenuOptions, position: position as 'left' | 'right' }
                            })
                        }
                    />
                </PanelBody>

                <PanelBody title={__('Desktop Menu Options', 'jankx')} initialOpen={false}>
                    <SelectControl
                        label={__('Dropdown Animation', 'jankx')}
                        value={desktopMenuOptions.dropdownAnimation}
                        options={[
                            { label: __('None', 'jankx'), value: 'none' },
                            { label: __('Fade', 'jankx'), value: 'fade' },
                            { label: __('Slide', 'jankx'), value: 'slide' }
                        ]}
                        onChange={(dropdownAnimation: string) => 
                            setAttributes({
                                desktopMenuOptions: { ...desktopMenuOptions, dropdownAnimation: dropdownAnimation as 'none' | 'fade' | 'slide' }
                            })
                        }
                    />
                    <RangeControl
                        label={__('Hover Delay (ms)', 'jankx')}
                        value={desktopMenuOptions.hoverDelay}
                        onChange={(hoverDelay) => 
                            setAttributes({
                                desktopMenuOptions: { ...desktopMenuOptions, hoverDelay }
                            })
                        }
                        min={0}
                        max={1000}
                    />
                    <SelectControl
                        label={__('Submenu Trigger', 'jankx')}
                        value={desktopMenuOptions.submenuTrigger}
                        options={[
                            { label: __('Hover', 'jankx'), value: 'hover' },
                            { label: __('Click', 'jankx'), value: 'click' }
                        ]}
                        onChange={(submenuTrigger) => 
                            setAttributes({
                                desktopMenuOptions: { ...desktopMenuOptions, submenuTrigger: submenuTrigger as 'hover' | 'click' }
                            })
                        }
                    />
                </PanelBody>

                <PanelBody title={__('Mega Menu Settings', 'jankx')} initialOpen={false}>
                    <TextControl
                        label={__('Container Width', 'jankx')}
                        value={megaMenuSettings.containerWidth}
                        onChange={(containerWidth) => 
                            setAttributes({
                                megaMenuSettings: { ...megaMenuSettings, containerWidth }
                            })
                        }
                    />
                    <TextControl
                        label={__('Column Gap', 'jankx')}
                        value={megaMenuSettings.columnGap}
                        onChange={(columnGap) => 
                            setAttributes({
                                megaMenuSettings: { ...megaMenuSettings, columnGap }
                            })
                        }
                    />
                    <TextControl
                        label={__('Padding', 'jankx')}
                        value={megaMenuSettings.padding}
                        onChange={(padding) => 
                            setAttributes({
                                megaMenuSettings: { ...megaMenuSettings, padding }
                            })
                        }
                    />
                </PanelBody>

                <PanelBody title={__('Flyout Menu Settings', 'jankx')} initialOpen={false}>
                    <TextControl
                        label={__('Width', 'jankx')}
                        value={flyoutMenuSettings.width}
                        onChange={(width) => 
                            setAttributes({
                                flyoutMenuSettings: { ...flyoutMenuSettings, width }
                            })
                        }
                    />
                    <SelectControl
                        label={__('Animation', 'jankx')}
                        value={flyoutMenuSettings.animation}
                        options={[
                            { label: __('Slide', 'jankx'), value: 'slide' },
                            { label: __('Fade', 'jankx'), value: 'fade' },
                            { label: __('Zoom', 'jankx'), value: 'zoom' }
                        ]}
                        onChange={(animation: string) => 
                            setAttributes({
                                flyoutMenuSettings: { ...flyoutMenuSettings, animation: animation as 'slide' | 'fade' | 'zoom' }
                            })
                        }
                    />
                    <SelectControl
                        label={__('Position', 'jankx')}
                        value={flyoutMenuSettings.position}
                        options={[
                            { label: __('Left', 'jankx'), value: 'left' },
                            { label: __('Right', 'jankx'), value: 'right' }
                        ]}
                        onChange={(position) => 
                            setAttributes({
                                flyoutMenuSettings: { ...flyoutMenuSettings, position }
                            })
                        }
                    />
                </PanelBody>

                <PanelBody title={__('Multilevel Menu Settings', 'jankx')} initialOpen={false}>
                    <RangeControl
                        label={__('Max Depth', 'jankx')}
                        value={multilevelMenuSettings.maxDepth}
                        onChange={(maxDepth) => 
                            setAttributes({
                                multilevelMenuSettings: { ...multilevelMenuSettings, maxDepth }
                            })
                        }
                        min={2}
                        max={5}
                    />
                    <ToggleControl
                        label={__('Show Indicator', 'jankx')}
                        checked={multilevelMenuSettings.indicator}
                        onChange={(indicator) => 
                            setAttributes({
                                multilevelMenuSettings: { ...multilevelMenuSettings, indicator }
                            })
                        }
                    />
                    <SelectControl
                        label={__('Animation', 'jankx')}
                        value={multilevelMenuSettings.animation}
                        options={[
                            { label: __('Fade', 'jankx'), value: 'fade' },
                            { label: __('Slide', 'jankx'), value: 'slide' },
                            { label: __('None', 'jankx'), value: 'none' }
                        ]}
                        onChange={(animation: string) => 
                            setAttributes({
                                multilevelMenuSettings: { ...multilevelMenuSettings, animation: animation as 'fade' | 'slide' | 'none' }
                            })
                        }
                    />
                </PanelBody>

                {renderItemEditor()}
            </InspectorControls>

            <div className="menu-builder-editor">
                <div className="menu-builder-header">
                    <h3>
                        <Icon icon={menu} />
                        {__('Responsive Menu Builder', 'jankx')}
                    </h3>
                    <Button
                        icon={plus}
                        onClick={() => setIsAddingItem(true)}
                        isPrimary
                    >
                        {__('Add Menu Item', 'jankx')}
                    </Button>
                </div>

                {isAddingItem && (
                    <Card className="add-menu-item-form">
                        <CardBody>
                            <TextControl
                                label={__('Label', 'jankx')}
                                value={newItem.label || ''}
                                onChange={(label) => setNewItem({ ...newItem, label })}
                            />
                            <TextControl
                                label={__('URL', 'jankx')}
                                value={newItem.url || ''}
                                onChange={(url) => setNewItem({ ...newItem, url })}
                            />
                            <SelectControl
                                label={__('Type', 'jankx')}
                                value={newItem.type || 'link'}
                                options={[
                                    { label: __('Link', 'jankx'), value: 'link' },
                                    { label: __('Button', 'jankx'), value: 'button' }
                                ]}
                                onChange={(type) => setNewItem({ ...newItem, type: type as MenuItem['type'] })}
                            />
                            <div className="form-actions">
                                <Button onClick={addMenuItem} isPrimary>
                                    {__('Add Item', 'jankx')}
                                </Button>
                                <Button onClick={() => setIsAddingItem(false)}>
                                    {__('Cancel', 'jankx')}
                                </Button>
                            </div>
                        </CardBody>
                    </Card>
                )}

                <div className="menu-items-tree">
                    <InnerBlocks
                        template={innerBlocksTemplate}
                        allowedBlocks={['jankx/menu-builder/menu-item']}
                        templateLock={false}
                        renderAppender={() => (
                            <div className="menu-items-appender">
                                <Button
                                    icon={plus}
                                    onClick={() => setIsAddingItem(true)}
                                    isPrimary
                                >
                                    {__('Add Menu Item', 'jankx')}
                                </Button>
                            </div>
                        )}
                    />
                </div>
            </div>
        </div>
    );
};

export default Edit;
