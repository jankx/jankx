import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import {
    useBlockProps,
    InspectorControls,
    RichText,
    PanelBody,
    ToggleControl,
    SelectControl,
    TextControl,
    RangeControl,
    ColorPalette,
    Button,
    ButtonGroup,
    __experimentalBoxControl as BoxControl,
    __experimentalUnitControl as UnitControl
} from '@wordpress/block-editor';
import { useState, useEffect } from '@wordpress/element';
import {
    menu,
    settings,
    color,
    typography,
    mobile,
    layout,
    plus,
    trash,
    edit,
    chevronDown,
    chevronRight,
    Icon
} from '@wordpress/icons';

/**
 * Mega Menu Block Editor Component
 *
 * Component này xử lý giao diện editor cho Mega Menu Block
 * với đầy đủ tính năng thiết kế trực quan
 */
function MegaMenuEdit({ attributes, setAttributes }) {
    const {
        menuId,
        menuLocation,
        menuStyle,
        mobileBreakpoint,
        showMobileToggle,
        mobileToggleText,
        megaMenuWidth,
        megaMenuAlignment,
        enableAccordion,
        enableFlyout,
        flyoutDirection,
        customIcons,
        iconLibrary,
        menuItems,
        backgroundColor,
        textColor,
        hoverBackgroundColor,
        hoverTextColor,
        borderColor,
        borderRadius,
        fontFamily,
        fontSize,
        fontWeight,
        lineHeight,
        letterSpacing,
        textTransform,
        className
    } = attributes;

    const [activeTab, setActiveTab] = useState('general');
    const [editingItem, setEditingItem] = useState(null);
    const [availableMenus, setAvailableMenus] = useState([]);

    const blockProps = useBlockProps({
        className: `mega-menu-block ${className || ''}`,
        style: {
            backgroundColor: backgroundColor || undefined,
            color: textColor || undefined,
            borderRadius: borderRadius ? `${borderRadius}px` : undefined,
            fontFamily: fontFamily !== 'inherit' ? fontFamily : undefined,
            fontSize: fontSize ? `${fontSize}px` : undefined,
            fontWeight: fontWeight !== '400' ? fontWeight : undefined,
            lineHeight: lineHeight !== 1.5 ? lineHeight : undefined,
            letterSpacing: letterSpacing ? `${letterSpacing}px` : undefined,
            textTransform: textTransform !== 'none' ? textTransform : undefined
        }
    });

    // Fetch available menus on component mount
    useEffect(() => {
        const fetchMenus = async () => {
            try {
                const response = await wp.apiFetch({
                    path: '/wp/v2/menus'
                });
                setAvailableMenus(response || []);
            } catch (error) {
                console.error('Failed to fetch menus:', error);
                setAvailableMenus([]);
            }
        };

        fetchMenus();
    }, []);

    // Menu style options
    const menuStyleOptions = [
        { label: __('Horizontal', 'jankx'), value: 'horizontal' },
        { label: __('Vertical', 'jankx'), value: 'vertical' },
        { label: __('Dropdown', 'jankx'), value: 'dropdown' }
    ];

    // Width options
    const widthOptions = [
        { label: __('Container', 'jankx'), value: 'container' },
        { label: __('Full Width', 'jankx'), value: 'full' },
        { label: __('Custom', 'jankx'), value: 'custom' }
    ];

    // Alignment options
    const alignmentOptions = [
        { label: __('Left', 'jankx'), value: 'left' },
        { label: __('Center', 'jankx'), value: 'center' },
        { label: __('Right', 'jankx'), value: 'right' }
    ];

    // Flyout direction options
    const flyoutDirectionOptions = [
        { label: __('Right', 'jankx'), value: 'right' },
        { label: __('Left', 'jankx'), value: 'left' },
        { label: __('Up', 'jankx'), value: 'up' },
        { label: __('Down', 'jankx'), value: 'down' }
    ];

    // Icon library options
    const iconLibraryOptions = [
        { label: __('Font Awesome', 'jankx'), value: 'fontawesome' },
        { label: __('Dashicons', 'jankx'), value: 'dashicons' },
        { label: __('Custom SVG', 'jankx'), value: 'custom' }
    ];

    // Add new menu item
    const addMenuItem = () => {
        const newItem = {
            id: Date.now(),
            title: __('New Menu Item', 'jankx'),
            url: '#',
            target: '_self',
            icon: '',
            hasChildren: false,
            children: [],
            isMegaMenu: false,
            megaMenuColumns: 3,
            megaMenuContent: '',
            customClasses: '',
            customStyles: {}
        };

        setAttributes({
            menuItems: [...menuItems, newItem]
        });
    };

    // Update menu item
    const updateMenuItem = (itemId, updates) => {
        const updatedItems = menuItems.map(item =>
            item.id === itemId ? { ...item, ...updates } : item
        );
        setAttributes({ menuItems: updatedItems });
    };

    // Delete menu item
    const deleteMenuItem = (itemId) => {
        const updatedItems = menuItems.filter(item => item.id !== itemId);
        setAttributes({ menuItems: updatedItems });
        setEditingItem(null);
    };

    // Add child menu item
    const addChildItem = (parentId) => {
        const newChild = {
            id: Date.now(),
            title: __('New Child Item', 'jankx'),
            url: '#',
            target: '_self',
            icon: '',
            hasChildren: false,
            children: [],
            customClasses: '',
            customStyles: {}
        };

        const updatedItems = menuItems.map(item => {
            if (item.id === parentId) {
                return {
                    ...item,
                    hasChildren: true,
                    children: [...(item.children || []), newChild]
                };
            }
            return item;
        });

        setAttributes({ menuItems: updatedItems });
    };

    // Render menu item editor
    const renderMenuItemEditor = (item, depth = 0) => {
        const isEditing = editingItem === item.id;
        const hasChildren = item.children && item.children.length > 0;

        return (
            <div key={item.id} className={`menu-item-editor depth-${depth}`}>
                <div className="menu-item-header">
                    <Button
                        icon={hasChildren ? chevronDown : chevronRight}
                        onClick={() => updateMenuItem(item.id, { hasChildren: !hasChildren })}
                        className="toggle-children"
                    />

                    <RichText
                        tagName="span"
                        value={item.title}
                        onChange={(title) => updateMenuItem(item.id, { title })}
                        placeholder={__('Menu Item Title', 'jankx')}
                        className="menu-item-title"
                    />

                    <div className="menu-item-actions">
                        <Button
                            icon={edit}
                            onClick={() => setEditingItem(isEditing ? null : item.id)}
                            className="edit-item"
                        />
                        <Button
                            icon={trash}
                            onClick={() => deleteMenuItem(item.id)}
                            className="delete-item"
                            isDestructive
                        />
                    </div>
                </div>

                {isEditing && (
                    <div className="menu-item-settings">
                        <TextControl
                            label={__('URL', 'jankx')}
                            value={item.url}
                            onChange={(url) => updateMenuItem(item.id, { url })}
                        />

                        <SelectControl
                            label={__('Target', 'jankx')}
                            value={item.target}
                            options={[
                                { label: __('Same Window', 'jankx'), value: '_self' },
                                { label: __('New Window', 'jankx'), value: '_blank' }
                            ]}
                            onChange={(target) => updateMenuItem(item.id, { target })}
                        />

                        {customIcons && (
                            <TextControl
                                label={__('Icon Class', 'jankx')}
                                value={item.icon}
                                onChange={(icon) => updateMenuItem(item.id, { icon })}
                                help={__('Enter icon class (e.g., fas fa-home)', 'jankx')}
                            />
                        )}

                        <TextControl
                            label={__('Custom Classes', 'jankx')}
                            value={item.customClasses}
                            onChange={(customClasses) => updateMenuItem(item.id, { customClasses })}
                        />

                        {depth === 0 && (
                            <>
                                <ToggleControl
                                    label={__('Enable Mega Menu', 'jankx')}
                                    checked={item.isMegaMenu}
                                    onChange={(isMegaMenu) => updateMenuItem(item.id, { isMegaMenu })}
                                />

                                {item.isMegaMenu && (
                                    <>
                                        <RangeControl
                                            label={__('Mega Menu Columns', 'jankx')}
                                            value={item.megaMenuColumns}
                                            onChange={(megaMenuColumns) => updateMenuItem(item.id, { megaMenuColumns })}
                                            min={1}
                                            max={6}
                                        />

                                        <RichText
                                            tagName="div"
                                            value={item.megaMenuContent}
                                            onChange={(megaMenuContent) => updateMenuItem(item.id, { megaMenuContent })}
                                            placeholder={__('Mega Menu Content (HTML allowed)', 'jankx')}
                                        />
                                    </>
                                )}
                            </>
                        )}
                    </div>
                )}

                {hasChildren && (
                    <div className="menu-item-children">
                        {item.children.map(child => renderMenuItemEditor(child, depth + 1))}
                        <Button
                            icon={plus}
                            onClick={() => addChildItem(item.id)}
                            className="add-child-item"
                        >
                            {__('Add Child Item', 'jankx')}
                        </Button>
                    </div>
                )}
            </div>
        );
    };

    // Render menu preview
    const renderMenuPreview = () => {
        if (menuItems.length === 0) {
            return (
                <div className="menu-preview-empty">
                    <p>{__('No menu items yet. Add some items to see the preview.', 'jankx')}</p>
                </div>
            );
        }

        return (
            <nav className={`mega-menu-preview ${menuStyle} ${megaMenuWidth} align-${megaMenuAlignment}`}>
                <ul className="mega-menu-list">
                    {menuItems.map(item => (
                        <li key={item.id} className={`mega-menu-item ${item.isMegaMenu ? 'has-mega-menu' : ''} ${item.customClasses}`}>
                            <a href={item.url} target={item.target} className="mega-menu-link">
                                {item.icon && <i className={item.icon}></i>}
                                <span>{item.title}</span>
                                {hasChildren && <Icon icon={chevronDown} className="dropdown-arrow" />}
                            </a>

                            {item.isMegaMenu && (
                                <div className="mega-menu-panel" style={{ gridTemplateColumns: `repeat(${item.megaMenuColumns}, 1fr)` }}>
                                    <div className="mega-menu-content" dangerouslySetInnerHTML={{ __html: item.megaMenuContent }} />
                                </div>
                            )}

                            {hasChildren && !item.isMegaMenu && (
                                <ul className="sub-menu">
                                    {item.children.map(child => (
                                        <li key={child.id} className="sub-menu-item">
                                            <a href={child.url} target={child.target} className="sub-menu-link">
                                                {child.icon && <i className={child.icon}></i>}
                                                <span>{child.title}</span>
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    ))}
                </ul>

                {showMobileToggle && (
                    <button className="mobile-menu-toggle">
                        <span>{mobileToggleText}</span>
                        <Icon icon={chevronDown} />
                    </button>
                )}
            </nav>
        );
    };

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('General Settings', 'jankx')} initialOpen={true}>
                    <SelectControl
                        label={__('Menu', 'jankx')}
                        value={menuId}
                        options={[
                            { label: __('Select a menu', 'jankx'), value: '' },
                            ...availableMenus.map(menu => ({
                                label: menu.name,
                                value: menu.id
                            }))
                        ]}
                        onChange={(menuId) => setAttributes({ menuId })}
                    />

                    <SelectControl
                        label={__('Menu Location', 'jankx')}
                        value={menuLocation}
                        options={[
                            { label: __('Primary', 'jankx'), value: 'primary' },
                            { label: __('Secondary', 'jankx'), value: 'secondary' },
                            { label: __('Footer', 'jankx'), value: 'footer' }
                        ]}
                        onChange={(menuLocation) => setAttributes({ menuLocation })}
                    />

                    <SelectControl
                        label={__('Menu Style', 'jankx')}
                        value={menuStyle}
                        options={menuStyleOptions}
                        onChange={(menuStyle) => setAttributes({ menuStyle })}
                    />

                    <ToggleControl
                        label={__('Show Mobile Toggle', 'jankx')}
                        checked={showMobileToggle}
                        onChange={(showMobileToggle) => setAttributes({ showMobileToggle })}
                    />

                    {showMobileToggle && (
                        <TextControl
                            label={__('Mobile Toggle Text', 'jankx')}
                            value={mobileToggleText}
                            onChange={(mobileToggleText) => setAttributes({ mobileToggleText })}
                        />
                    )}

                    <RangeControl
                        label={__('Mobile Breakpoint (px)', 'jankx')}
                        value={mobileBreakpoint}
                        onChange={(mobileBreakpoint) => setAttributes({ mobileBreakpoint })}
                        min={320}
                        max={1200}
                        step={1}
                    />
                </PanelBody>

                <PanelBody title={__('Mega Menu Settings', 'jankx')}>
                    <SelectControl
                        label={__('Mega Menu Width', 'jankx')}
                        value={megaMenuWidth}
                        options={widthOptions}
                        onChange={(megaMenuWidth) => setAttributes({ megaMenuWidth })}
                    />

                    <SelectControl
                        label={__('Mega Menu Alignment', 'jankx')}
                        value={megaMenuAlignment}
                        options={alignmentOptions}
                        onChange={(megaMenuAlignment) => setAttributes({ megaMenuAlignment })}
                    />

                    <ToggleControl
                        label={__('Enable Accordion', 'jankx')}
                        checked={enableAccordion}
                        onChange={(enableAccordion) => setAttributes({ enableAccordion })}
                        help={__('Use accordion style for mobile menu', 'jankx')}
                    />

                    <ToggleControl
                        label={__('Enable Flyout', 'jankx')}
                        checked={enableFlyout}
                        onChange={(enableFlyout) => setAttributes({ enableFlyout })}
                        help={__('Enable flyout submenu effect', 'jankx')}
                    />

                    {enableFlyout && (
                        <SelectControl
                            label={__('Flyout Direction', 'jankx')}
                            value={flyoutDirection}
                            options={flyoutDirectionOptions}
                            onChange={(flyoutDirection) => setAttributes({ flyoutDirection })}
                        />
                    )}
                </PanelBody>

                <PanelBody title={__('Icon Settings', 'jankx')}>
                    <ToggleControl
                        label={__('Enable Custom Icons', 'jankx')}
                        checked={customIcons}
                        onChange={(customIcons) => setAttributes({ customIcons })}
                    />

                    {customIcons && (
                        <SelectControl
                            label={__('Icon Library', 'jankx')}
                            value={iconLibrary}
                            options={iconLibraryOptions}
                            onChange={(iconLibrary) => setAttributes({ iconLibrary })}
                        />
                    )}
                </PanelBody>

                <PanelBody title={__('Colors', 'jankx')}>
                    <div className="components-base-control">
                        <label className="components-base-control__label">
                            {__('Background Color', 'jankx')}
                        </label>
                        <ColorPalette
                            value={backgroundColor}
                            onChange={(backgroundColor) => setAttributes({ backgroundColor })}
                        />
                    </div>

                    <div className="components-base-control">
                        <label className="components-base-control__label">
                            {__('Text Color', 'jankx')}
                        </label>
                        <ColorPalette
                            value={textColor}
                            onChange={(textColor) => setAttributes({ textColor })}
                        />
                    </div>

                    <div className="components-base-control">
                        <label className="components-base-control__label">
                            {__('Hover Background Color', 'jankx')}
                        </label>
                        <ColorPalette
                            value={hoverBackgroundColor}
                            onChange={(hoverBackgroundColor) => setAttributes({ hoverBackgroundColor })}
                        />
                    </div>

                    <div className="components-base-control">
                        <label className="components-base-control__label">
                            {__('Hover Text Color', 'jankx')}
                        </label>
                        <ColorPalette
                            value={hoverTextColor}
                            onChange={(hoverTextColor) => setAttributes({ hoverTextColor })}
                        />
                    </div>

                    <div className="components-base-control">
                        <label className="components-base-control__label">
                            {__('Border Color', 'jankx')}
                        </label>
                        <ColorPalette
                            value={borderColor}
                            onChange={(borderColor) => setAttributes({ borderColor })}
                        />
                    </div>
                </PanelBody>

                <PanelBody title={__('Typography', 'jankx')}>
                    <TextControl
                        label={__('Font Family', 'jankx')}
                        value={fontFamily}
                        onChange={(fontFamily) => setAttributes({ fontFamily })}
                    />

                    <RangeControl
                        label={__('Font Size (px)', 'jankx')}
                        value={fontSize}
                        onChange={(fontSize) => setAttributes({ fontSize })}
                        min={12}
                        max={72}
                        step={1}
                    />

                    <SelectControl
                        label={__('Font Weight', 'jankx')}
                        value={fontWeight}
                        options={[
                            { label: __('Normal', 'jankx'), value: '400' },
                            { label: __('Bold', 'jankx'), value: '700' },
                            { label: __('Light', 'jankx'), value: '300' }
                        ]}
                        onChange={(fontWeight) => setAttributes({ fontWeight })}
                    />

                    <RangeControl
                        label={__('Line Height', 'jankx')}
                        value={lineHeight}
                        onChange={(lineHeight) => setAttributes({ lineHeight })}
                        min={1}
                        max={3}
                        step={0.1}
                    />

                    <RangeControl
                        label={__('Letter Spacing (px)', 'jankx')}
                        value={letterSpacing}
                        onChange={(letterSpacing) => setAttributes({ letterSpacing })}
                        min={-2}
                        max={5}
                        step={0.1}
                    />

                    <SelectControl
                        label={__('Text Transform', 'jankx')}
                        value={textTransform}
                        options={[
                            { label: __('None', 'jankx'), value: 'none' },
                            { label: __('Uppercase', 'jankx'), value: 'uppercase' },
                            { label: __('Lowercase', 'jankx'), value: 'lowercase' },
                            { label: __('Capitalize', 'jankx'), value: 'capitalize' }
                        ]}
                        onChange={(textTransform) => setAttributes({ textTransform })}
                    />
                </PanelBody>

                <PanelBody title={__('Layout', 'jankx')}>
                    <RangeControl
                        label={__('Border Radius (px)', 'jankx')}
                        value={borderRadius}
                        onChange={(borderRadius) => setAttributes({ borderRadius })}
                        min={0}
                        max={50}
                        step={1}
                    />
                </PanelBody>
            </InspectorControls>

            <div {...blockProps}>
                <div className="mega-menu-editor">
                    <div className="mega-menu-toolbar">
                        <ButtonGroup>
                            <Button
                                icon={menu}
                                onClick={() => setActiveTab('general')}
                                isPressed={activeTab === 'general'}
                            >
                                {__('General', 'jankx')}
                            </Button>
                            <Button
                                icon={settings}
                                onClick={() => setActiveTab('settings')}
                                isPressed={activeTab === 'settings'}
                            >
                                {__('Settings', 'jankx')}
                            </Button>
                            <Button
                                icon={color}
                                onClick={() => setActiveTab('colors')}
                                isPressed={activeTab === 'colors'}
                            >
                                {__('Colors', 'jankx')}
                            </Button>
                            <Button
                                icon={typography}
                                onClick={() => setActiveTab('typography')}
                                isPressed={activeTab === 'typography'}
                            >
                                {__('Typography', 'jankx')}
                            </Button>
                            <Button
                                icon={mobile}
                                onClick={() => setActiveTab('mobile')}
                                isPressed={activeTab === 'mobile'}
                            >
                                {__('Mobile', 'jankx')}
                            </Button>
                        </ButtonGroup>
                    </div>

                    <div className="mega-menu-content">
                        <div className="mega-menu-items-editor">
                            <div className="mega-menu-items-header">
                                <h3>{__('Menu Items', 'jankx')}</h3>
                                <Button
                                    icon={plus}
                                    onClick={addMenuItem}
                                    isPrimary
                                >
                                    {__('Add Menu Item', 'jankx')}
                                </Button>
                            </div>

                            <div className="mega-menu-items-list">
                                {menuItems.map(item => renderMenuItemEditor(item))}
                                {menuItems.length === 0 && (
                                    <div className="no-menu-items">
                                        <p>{__('No menu items yet. Click "Add Menu Item" to get started.', 'jankx')}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mega-menu-preview-container">
                            <h3>{__('Menu Preview', 'jankx')}</h3>
                            {renderMenuPreview()}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

/**
 * Đăng ký Mega Menu Block
 *
 * Block này cho phép người dùng tạo mega menu với giao diện thiết kế trực quan
 * bao gồm tất cả các tính năng: accordion, flyout, custom icons, typography, colors
 */
registerBlockType('jankx/mega-menu', {
    edit: MegaMenuEdit,

    // Không cần save function vì đây là dynamic block
    // Nội dung sẽ được render server-side
});
