/**
 * Menu Item Block - Edit Component
 * 
 * @package JankX\MenuBuilder\Blocks
 * @since 1.0.0
 */

import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, InnerBlocks } from '@wordpress/block-editor';
import { PanelBody, TextControl, SelectControl, ToggleControl, RangeControl, ButtonGroup, Button } from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { link, linkOff, button, plus, trash, pencil } from '@wordpress/icons';
import { Icon } from '@wordpress/icons';

// Types
interface MenuItemAttributes {
    itemId: string;
    label: string;
    url: string;
    type: 'link' | 'button';
    submenuType: 'none' | 'multilevel' | 'mega' | 'flyout';
    icon: string;
    target: '_self' | '_blank';
    rel: string;
    cssClass: string;
    megaMenuColumns: number;
    megaMenuFullWidth: boolean;
    flyoutPosition: 'left' | 'right';
    flyoutWidth: string;
    multilevelMaxDepth: number;
    isActive: boolean;
    orderIndex: number;
}

const Edit = (props: { attributes: MenuItemAttributes, setAttributes: (updates: Partial<MenuItemAttributes>) => void, clientId: string }) => {
    const { attributes, setAttributes, clientId } = props;
    const {
        itemId,
        label,
        url,
        type,
        submenuType,
        icon,
        target,
        rel,
        cssClass,
        megaMenuColumns,
        megaMenuFullWidth,
        flyoutPosition,
        flyoutWidth,
        multilevelMaxDepth,
        isActive,
        orderIndex
    } = attributes;

    const { insertBlock, removeBlock } = useDispatch('core/block-editor');

    // Generate unique item ID if not set
    useEffect(() => {
        if (!itemId) {
            setAttributes({
                itemId: 'menu-item-' + Math.random().toString(36).substr(2, 9)
            });
        }
    }, [itemId, setAttributes]);

    // Get inner blocks
    const { innerBlocks } = useSelect(
        (select: any) => {
            const store = select('core/block-editor');
            return {
                innerBlocks: store.getBlock(clientId)?.innerBlocks || []
            };
        },
        [clientId]
    );

    // Get parent block context
    const { parentClientId } = useSelect(
        (select: any) => {
            const store = select('core/block-editor');
            return {
                parentClientId: store.getBlockRootClientId(clientId)
            };
        },
        [clientId]
    );

    // Inner blocks setup
    const innerBlocksTemplate: any[] = [];

    // Add submenu item
    const addSubmenuItem = () => {
        const submenuBlock = (window as any).wp.blocks.createBlock('jankx/menu-builder/menu-item', {
            itemId: 'menu-item-' + Math.random().toString(36).substr(2, 9),
            label: __('New Submenu Item', 'jankx'),
            url: '#',
            type: 'link',
            submenuType: 'none',
            isActive: true,
            orderIndex: innerBlocks.length
        });

        insertBlock(submenuBlock, innerBlocks.length, clientId);
    };

    // Block props
    const blockProps = useBlockProps({
        className: `menu-item-block ${type === 'button' ? 'menu-item-button' : ''} ${submenuType !== 'none' ? 'has-children' : ''} ${!isActive ? 'menu-item-inactive' : ''}`
    });

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Menu Item Settings', 'jankx')} initialOpen={true}>
                    {/* Item ID */}
                    <div className="components-base-control">
                        <div className="components-base-control__field">
                            <label className="components-base-control__label">
                                {__('Item ID', 'jankx')}
                            </label>
                            <div className="components-flex components-h-stack">
                                <TextControl
                                    value={itemId}
                                    onChange={(value) => setAttributes({ itemId: value })}
                                    placeholder={__('Auto-generated', 'jankx')}
                                    className="components-flex-item"
                                />
                                <Button
                                    icon={pencil}
                                    label={__('Generate New ID', 'jankx')}
                                    onClick={() => setAttributes({
                                        itemId: 'menu-item-' + Math.random().toString(36).substr(2, 9)
                                    })}
                                    className="components-flex-item"
                                    isSmall
                                />
                            </div>
                        </div>
                    </div>

                    {/* Label */}
                    <TextControl
                        label={__('Label', 'jankx')}
                        value={label}
                        onChange={(value) => setAttributes({ label: value })}
                        placeholder={__('Menu Item', 'jankx')}
                    />

                    {/* URL */}
                    {type === 'link' && (
                        <TextControl
                            label={__('URL', 'jankx')}
                            value={url}
                            onChange={(value) => setAttributes({ url: value })}
                            placeholder={__('https://example.com', 'jankx')}
                            help={__('Enter the URL this menu item should link to.', 'jankx')}
                        />
                    )}

                    {/* Type */}
                    <div className="components-base-control">
                        <label className="components-base-control__label">
                            {__('Item Type', 'jankx')}
                        </label>
                        <ButtonGroup>
                            <Button
                                variant={type === 'link' ? 'primary' : 'secondary'}
                                icon={link}
                                onClick={() => setAttributes({ type: 'link' })}
                                label={__('Link', 'jankx')}
                            >
                                {__('Link', 'jankx')}
                            </Button>
                            <Button
                                variant={type === 'button' ? 'primary' : 'secondary'}
                                icon={button}
                                onClick={() => setAttributes({ type: 'button' })}
                                label={__('Button', 'jankx')}
                            >
                                {__('Button', 'jankx')}
                            </Button>
                        </ButtonGroup>
                    </div>

                    {/* Target */}
                    {type === 'link' && (
                        <SelectControl
                            label={__('Open in', 'jankx')}
                            value={target}
                            options={[
                                { label: __('Same window', 'jankx'), value: '_self' },
                                { label: __('New window', 'jankx'), value: '_blank' }
                            ]}
                            onChange={(value) => setAttributes({ target: value as '_self' | '_blank' })}
                        />
                    )}

                    {/* Rel */}
                    {type === 'link' && target === '_blank' && (
                        <TextControl
                            label={__('Rel Attribute', 'jankx')}
                            value={rel}
                            onChange={(value) => setAttributes({ rel: value })}
                            placeholder={__('noopener noreferrer', 'jankx')}
                            help={__('Relationship attribute for security and SEO.', 'jankx')}
                        />
                    )}

                    {/* CSS Class */}
                    <TextControl
                        label={__('CSS Class', 'jankx')}
                        value={cssClass}
                        onChange={(value) => setAttributes({ cssClass: value })}
                        placeholder={__('custom-class', 'jankx')}
                        help={__('Additional CSS classes for this menu item.', 'jankx')}
                    />

                    {/* Icon */}
                    <TextControl
                        label={__('Icon', 'jankx')}
                        value={icon}
                        onChange={(value) => setAttributes({ icon: value })}
                        placeholder={__('<i class="fas fa-home"></i>', 'jankx')}
                        help={__('HTML or text for the menu item icon.', 'jankx')}
                    />

                    {/* Active Status */}
                    <ToggleControl
                        label={__('Active', 'jankx')}
                        checked={isActive}
                        onChange={(checked) => setAttributes({ isActive: checked })}
                        help={__('Enable or disable this menu item.', 'jankx')}
                    />
                </PanelBody>

                {/* Submenu Settings */}
                <PanelBody 
                    title={__('Submenu Settings', 'jankx')} 
                    initialOpen={false}
                >
                    <SelectControl
                        label={__('Submenu Type', 'jankx')}
                        value={submenuType}
                        options={[
                            { label: __('No Submenu', 'jankx'), value: 'none' },
                            { label: __('Multilevel Menu', 'jankx'), value: 'multilevel' },
                            { label: __('Mega Menu', 'jankx'), value: 'mega' },
                            { label: __('Flyout Menu', 'jankx'), value: 'flyout' }
                        ]}
                        onChange={(value) => setAttributes({ submenuType: value as 'none' | 'multilevel' | 'mega' | 'flyout' })}
                    />

                    {submenuType === 'mega' && (
                        <>
                            <RangeControl
                                label={__('Columns', 'jankx')}
                                value={megaMenuColumns}
                                onChange={(value) => setAttributes({ megaMenuColumns: value || 4 })}
                                min={2}
                                max={6}
                                help={__('Number of columns in the mega menu.', 'jankx')}
                            />
                            <ToggleControl
                                label={__('Full Width', 'jankx')}
                                checked={megaMenuFullWidth}
                                onChange={(checked) => setAttributes({ megaMenuFullWidth: checked })}
                                help={__('Make mega menu span full width.', 'jankx')}
                            />
                        </>
                    )}

                    {submenuType === 'flyout' && (
                        <>
                            <SelectControl
                                label={__('Position', 'jankx')}
                                value={flyoutPosition}
                                options={[
                                    { label: __('Left', 'jankx'), value: 'left' },
                                    { label: __('Right', 'jankx'), value: 'right' }
                                ]}
                                onChange={(value) => setAttributes({ flyoutPosition: value as 'left' | 'right' })}
                            />
                            <TextControl
                                label={__('Width', 'jankx')}
                                value={flyoutWidth}
                                onChange={(value) => setAttributes({ flyoutWidth: value })}
                                placeholder={__('300px', 'jankx')}
                                help={__('Width of the flyout menu.', 'jankx')}
                            />
                        </>
                    )}

                    {submenuType === 'multilevel' && (
                        <RangeControl
                            label={__('Max Depth', 'jankx')}
                            value={multilevelMaxDepth}
                            onChange={(value) => setAttributes({ multilevelMaxDepth: value || 3 })}
                            min={1}
                            max={5}
                            help={__('Maximum number of submenu levels.', 'jankx')}
                        />
                    )}

                    {submenuType !== 'none' && (
                        <div className="components-base-control">
                            <div className="components-base-control__field">
                                <label className="components-base-control__label">
                                    {__('Submenu Items', 'jankx')}
                                </label>
                                <Button
                                    icon={plus}
                                    onClick={addSubmenuItem}
                                    variant="primary"
                                    className="is-compact"
                                >
                                    {__('Add Submenu Item', 'jankx')}
                                </Button>
                            </div>
                        </div>
                    )}
                </PanelBody>

                {/* Advanced Settings */}
                <PanelBody 
                    title={__('Advanced', 'jankx')} 
                    initialOpen={false}
                >
                    <TextControl
                        label={__('Order Index', 'jankx')}
                        value={orderIndex.toString()}
                        onChange={(value) => setAttributes({ orderIndex: parseInt(value) || 0 })}
                        type="number"
                        help={__('Order index for sorting menu items.', 'jankx')}
                    />
                </PanelBody>
            </InspectorControls>

            {/* Block Preview */}
            <div {...blockProps}>
                <div className="menu-item-preview">
                    <div className="menu-item-header">
                        <div className="menu-item-info">
                            <div className="menu-item-type-indicator">
                                {type === 'button' ? 
                                    <Button icon={button} disabled /> : 
                                    <Button icon={link} disabled />
                                }
                            </div>
                            <div className="menu-item-details">
                                <div className="menu-item-label-preview">
                                    {label || __('Menu Item', 'jankx')}
                                </div>
                                {type === 'link' && url && (
                                    <div className="menu-item-url-preview">
                                        {url}
                                    </div>
                                )}
                                {submenuType !== 'none' && (
                                    <div className="submenu-indicator">
                                        {__('Submenu:', 'jankx')} {submenuType}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="menu-item-status">
                            {!isActive && (
                                <span className="status-inactive">
                                    {__('Inactive', 'jankx')}
                                </span>
                            )}
                        </div>
                    </div>
                    
                    {/* Inner blocks for submenu items */}
                    {submenuType !== 'none' && (
                        <InnerBlocks
                            template={innerBlocksTemplate}
                            allowedBlocks={['jankx/menu-builder/menu-item']}
                            renderAppender={() => (
                                <button
                                    className="components-button block-list-appender"
                                    onClick={addSubmenuItem}
                                >
                                    <Icon icon={plus} />
                                    {__('Add Submenu Item', 'jankx')}
                                </button>
                            )}
                        />
                    )}
                </div>
            </div>
        </>
    );
};

export default Edit;
