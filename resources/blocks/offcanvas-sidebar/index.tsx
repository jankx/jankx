import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import {
    useBlockProps,
    InspectorControls,
    RichText,
    InnerBlocks
} from '@wordpress/block-editor';
import {
    PanelBody,
    SelectControl,
    TextControl,
    ToggleControl,
    RangeControl,
    ColorPicker,
    Button,
    ButtonGroup
} from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';
import {
    menu,
    home,
    info,
    cog,
    envelope,
    plus,
    trash
} from '@wordpress/icons';

interface MenuItem {
    id: string;
    text: string;
    url: string;
    icon: string;
}

interface OffcanvasSidebarAttributes {
    sidebarPosition: 'left' | 'right';
    animationEffect: string;
    sidebarWidth: string;
    overlayColor: string;
    sidebarBackground: string;
    textColor: string;
    triggerText: string;
    triggerIcon: string;
    showOverlay: boolean;
    closeOnOverlayClick: boolean;
    closeOnEscape: boolean;
    autoClose: boolean;
    autoCloseDelay: number;
    menuItems: MenuItem[];
    className?: string;
}

interface OffcanvasSidebarEditProps {
    attributes: OffcanvasSidebarAttributes;
    setAttributes: (attributes: Partial<OffcanvasSidebarAttributes>) => void;
}

// Animation effects available
const ANIMATION_EFFECTS = [
    { label: 'Slide In', value: 'slide-in' }
];

// Icon options
const ICON_OPTIONS = [
    { label: 'Menu', value: 'menu' },
    { label: 'Home', value: 'home' },
    { label: 'Info', value: 'info' },
    { label: 'Cog', value: 'cog' },
    { label: 'Email', value: 'email' },
    { label: 'User', value: 'user' },
    { label: 'Search', value: 'search' },
    { label: 'Settings', value: 'settings' },
    { label: 'Heart', value: 'heart' },
    { label: 'Star', value: 'star' }
];

function OffcanvasSidebarEdit({ attributes, setAttributes }: OffcanvasSidebarEditProps): JSX.Element {
    const {
        sidebarPosition,
        animationEffect,
        sidebarWidth,
        overlayColor,
        sidebarBackground,
        textColor,
        triggerText,
        triggerIcon,
        showOverlay,
        closeOnOverlayClick,
        closeOnEscape,
        autoClose,
        autoCloseDelay,
        menuItems,
        className
    } = attributes;

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [editingMenuItem, setEditingMenuItem] = useState<string | null>(null);

    const blockProps = useBlockProps({
        className: `offcanvas-sidebar-block ${className || ''}`
    });

    // Get icon component
    const getIconComponent = (iconName: string) => {
        const iconMap: { [key: string]: any } = {
            menu,
            home,
            info,
            cog,
            envelope
        };
        return iconMap[iconName] || menu;
    };

    // Add new menu item
    const addMenuItem = () => {
        const newItem: MenuItem = {
            id: `item-${Date.now()}`,
            text: 'New Item',
            url: '#',
            icon: 'home'
        };
        setAttributes({
            menuItems: [...menuItems, newItem]
        });
    };

    // Remove menu item
    const removeMenuItem = (id: string) => {
        setAttributes({
            menuItems: menuItems.filter(item => item.id !== id)
        });
    };

    // Update menu item
    const updateMenuItem = (id: string, field: keyof MenuItem, value: string) => {
        setAttributes({
            menuItems: menuItems.map(item =>
                item.id === id ? { ...item, [field]: value } : item
            )
        });
    };

    // Render menu item editor
    const renderMenuItemEditor = (item: MenuItem) => {
        const isEditing = editingMenuItem === item.id;

        return (
            <div key={item.id} className="menu-item-editor">
                {isEditing ? (
                    <div className="menu-item-edit-form">
                        <TextControl
                            label={__('Text', 'jankx')}
                            value={item.text}
                            onChange={(value) => updateMenuItem(item.id, 'text', value)}
                        />
                        <TextControl
                            label={__('URL', 'jankx')}
                            value={item.url}
                            onChange={(value) => updateMenuItem(item.id, 'url', value)}
                        />
                        <SelectControl
                            label={__('Icon', 'jankx')}
                            value={item.icon}
                            options={ICON_OPTIONS}
                            onChange={(value) => updateMenuItem(item.id, 'icon', value)}
                        />
                        <div className="menu-item-actions">
                            <Button
                                variant="secondary"
                                onClick={() => setEditingMenuItem(null)}
                            >
                                {__('Done', 'jankx')}
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={() => removeMenuItem(item.id)}
                            >
                                {__('Remove', 'jankx')}
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="menu-item-preview">
                        <span className="menu-item-text">{item.text}</span>
                        <Button
                            variant="secondary"
                            size="small"
                            onClick={() => setEditingMenuItem(item.id)}
                        >
                            {__('Edit', 'jankx')}
                        </Button>
                    </div>
                )}
            </div>
        );
    };

    // Render sidebar preview
    const renderSidebarPreview = () => {
        const sidebarStyle = {
            width: sidebarWidth,
            backgroundColor: sidebarBackground,
            color: textColor,
            [sidebarPosition]: isOpen ? '0' : `-${sidebarWidth}`,
        };

        const overlayStyle = {
            backgroundColor: overlayColor,
            opacity: isOpen && showOverlay ? 1 : 0,
            visibility: isOpen && showOverlay ? 'visible' : 'hidden'
        };

        return (
            <div className={`offcanvas-sidebar-preview effect-${animationEffect} position-${sidebarPosition}`}>
                {/* Trigger Button - Removed, use separate Offcanvas Trigger block */}
                <div className="trigger-placeholder" style={{
                    padding: '20px',
                    textAlign: 'center',
                    color: '#666',
                    fontStyle: 'italic',
                    border: '2px dashed #ddd',
                    borderRadius: '8px',
                    marginBottom: '20px'
                }}>
                    <p>{__('Add "Offcanvas Trigger" block to open this sidebar', 'jankx')}</p>
                </div>

                {/* Overlay */}
                {showOverlay && (
                    <div
                        className="offcanvas-overlay"
                        style={overlayStyle}
                        onClick={() => closeOnOverlayClick && setIsOpen(false)}
                    />
                )}

                {/* Sidebar */}
                <div
                    className="offcanvas-sidebar"
                    style={sidebarStyle}
                >
                    <div className="sidebar-header">
                        <h3>{__('Navigation', 'jankx')}</h3>
                        <button
                            className="close-button"
                            onClick={() => setIsOpen(false)}
                        >
                            ×
                        </button>
                    </div>

                    <nav className="sidebar-menu">
                        <ul>
                            {menuItems.map(item => (
                                <li key={item.id}>
                                    <a href={item.url}>
                                        {getIconComponent(item.icon) && (
                                            <span className="menu-icon">
                                                {getIconComponent(item.icon)}
                                            </span>
                                        )}
                                        <span className="menu-text">{item.text}</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>

                                         <div className="sidebar-content">
                         <InnerBlocks
                             allowedBlocks={[
                                 'core/paragraph',
                                 'core/heading',
                                 'core/image',
                                 'core/gallery',
                                 'core/list',
                                 'core/quote',
                                 'core/buttons',
                                 'core/separator',
                                 'core/spacer',
                                 'core/social-links',
                                 'core/navigation',
                                 'core/search',
                                 'core/calendar',
                                 'core/latest-posts',
                                 'core/latest-comments',
                                 'core/rss',
                                 'core/audio',
                                 'core/video',
                                 'core/file',
                                 'core/code',
                                 'core/html',
                                 'core/preformatted',
                                 'core/pullquote',
                                 'core/table',
                                 'core/verse',
                                 'core/media-text',
                                 'core/columns',
                                 'core/group',
                                 'core/cover',
                                 'core/embed',
                                 'jankx/language-switcher',
                                 'jankx/icon-button',
                                 'jankx/offcanvas-sidebar'
                             ]}
                             template={[
                                 ['core/heading', { level: 3, content: __('Sidebar Content', 'jankx') }],
                                 ['core/paragraph', { content: __('Add your content here using any available blocks.', 'jankx') }]
                             ]}
                             templateLock={false}
                             renderAppender={() => (
                                 <div className="sidebar-content-appender">
                                     <p className="sidebar-content-hint">
                                         {__('Click the + button to add content blocks to your sidebar', 'jankx')}
                                     </p>
                                 </div>
                             )}
                         />
                     </div>
                </div>
            </div>
        );
    };

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Sidebar Settings', 'jankx')} initialOpen={true}>
                    <SelectControl
                        label={__('Position', 'jankx')}
                        value={sidebarPosition}
                        options={[
                            { label: __('Left', 'jankx'), value: 'left' },
                            { label: __('Right', 'jankx'), value: 'right' }
                        ]}
                        onChange={(value: 'left' | 'right') => setAttributes({ sidebarPosition: value })}
                    />

                    <SelectControl
                        label={__('Animation Effect', 'jankx')}
                        value={animationEffect}
                        options={ANIMATION_EFFECTS}
                        onChange={(value: string) => setAttributes({ animationEffect: value })}
                    />

                    <TextControl
                        label={__('Sidebar Width', 'jankx')}
                        value={sidebarWidth}
                        onChange={(value: string) => setAttributes({ sidebarWidth: value })}
                        help={__('e.g., 300px, 25vw, 20rem', 'jankx')}
                    />

                    <div className="color-controls">
                        <div className="color-picker-group">
                            <label>{__('Sidebar Background', 'jankx')}</label>
                            <ColorPicker
                                color={sidebarBackground}
                                onChange={(color: string) => setAttributes({ sidebarBackground: color })}
                            />
                        </div>

                        <div className="color-picker-group">
                            <label>{__('Text Color', 'jankx')}</label>
                            <ColorPicker
                                color={textColor}
                                onChange={(color: string) => setAttributes({ textColor: color })}
                            />
                        </div>

                        <div className="color-picker-group">
                            <label>{__('Overlay Color', 'jankx')}</label>
                            <ColorPicker
                                color={overlayColor}
                                onChange={(color: string) => setAttributes({ overlayColor: color })}
                            />
                        </div>
                    </div>
                </PanelBody>

                <PanelBody title={__('Trigger Button', 'jankx')} initialOpen={false}>
                    <TextControl
                        label={__('Button Text', 'jankx')}
                        value={triggerText}
                        onChange={(value: string) => setAttributes({ triggerText: value })}
                    />

                    <SelectControl
                        label={__('Button Icon', 'jankx')}
                        value={triggerIcon}
                        options={ICON_OPTIONS}
                        onChange={(value: string) => setAttributes({ triggerIcon: value })}
                    />
                </PanelBody>

                <PanelBody title={__('Behavior', 'jankx')} initialOpen={false}>
                    <ToggleControl
                        label={__('Show Overlay', 'jankx')}
                        checked={showOverlay}
                        onChange={(value: boolean) => setAttributes({ showOverlay: value })}
                    />

                    <ToggleControl
                        label={__('Close on Overlay Click', 'jankx')}
                        checked={closeOnOverlayClick}
                        onChange={(value: boolean) => setAttributes({ closeOnOverlayClick: value })}
                    />

                    <ToggleControl
                        label={__('Close on Escape Key', 'jankx')}
                        checked={closeOnEscape}
                        onChange={(value: boolean) => setAttributes({ closeOnEscape: value })}
                    />

                    <ToggleControl
                        label={__('Auto Close', 'jankx')}
                        checked={autoClose}
                        onChange={(value: boolean) => setAttributes({ autoClose: value })}
                    />

                    {autoClose && (
                        <RangeControl
                            label={__('Auto Close Delay (seconds)', 'jankx')}
                            value={autoCloseDelay / 1000}
                            onChange={(value: number) => setAttributes({ autoCloseDelay: value * 1000 })}
                            min={1}
                            max={30}
                            step={1}
                        />
                    )}
                </PanelBody>

                <PanelBody title={__('Menu Items', 'jankx')} initialOpen={false}>
                    <div className="menu-items-editor">
                        {menuItems.map(renderMenuItemEditor)}

                        <Button
                            variant="secondary"
                            onClick={addMenuItem}
                            className="add-menu-item"
                        >
                            <span className="dashicons dashicons-plus"></span>
                            {__('Add Menu Item', 'jankx')}
                        </Button>
                    </div>
                </PanelBody>
            </InspectorControls>

            <div {...blockProps}>
                {renderSidebarPreview()}
            </div>
        </>
    );
}

function OffcanvasSidebarSave(): null {
    return null; // Dynamic block
}

registerBlockType('jankx/offcanvas-sidebar', {
    title: 'Offcanvas Sidebar',
    category: 'widgets',
    attributes: {
        sidebarPosition: { type: 'string', default: 'left' },
        animationEffect: { type: 'string', default: 'slide-in' },
        sidebarWidth: { type: 'string', default: '300px' },
        overlayColor: { type: 'string', default: 'rgba(0,0,0,0.2)' },
        sidebarBackground: { type: 'string', default: '#48a770' },
        textColor: { type: 'string', default: '#f3efe0' },
        triggerText: { type: 'string', default: 'Menu' },
        triggerIcon: { type: 'string', default: 'menu' },
        showOverlay: { type: 'boolean', default: true },
        closeOnOverlayClick: { type: 'boolean', default: true },
        closeOnEscape: { type: 'boolean', default: true },
        autoClose: { type: 'boolean', default: false },
        autoCloseDelay: { type: 'number', default: 5000 },
        menuItems: {
            type: 'array',
            default: [
                { id: 'home', text: 'Home', url: '#', icon: 'home' },
                { id: 'about', text: 'About', url: '#', icon: 'info' },
                { id: 'services', text: 'Services', url: '#', icon: 'cog' },
                { id: 'contact', text: 'Contact', url: '#', icon: 'email' }
            ]
        },
        className: { type: 'string' }
    },
    edit: OffcanvasSidebarEdit,
    save: OffcanvasSidebarSave,
});
