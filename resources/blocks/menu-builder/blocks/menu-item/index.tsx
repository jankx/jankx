/**
 * Menu Item Block - Main Entry Point
 * 
 * @package JankX\MenuBuilder\Blocks
 * @since 1.0.0
 */

import './style.scss';
import './editor.scss';

import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import { link, button } from '@wordpress/icons';
import { Icon } from '@wordpress/icons';

import Edit from './edit';
import Save from './save';

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

// Register the block
registerBlockType('jankx/menu-builder/menu-item', {
    title: 'Menu Item',
    category: 'jankx',
    parent: ['jankx/menu-builder'],
    description: 'Individual menu item with support for submenus and various display types',
    keywords: ['menu', 'item', 'link', 'button', 'submenu'],
    textdomain: 'jankx',
    icon: <Icon icon={link} />,
    attributes: {
        itemId: { type: 'string', default: '' },
        label: { type: 'string', default: 'Menu Item' },
        url: { type: 'string', default: '#' },
        type: { type: 'string', default: 'link' },
        submenuType: { type: 'string', default: 'none' },
        icon: { type: 'string', default: '' },
        target: { type: 'string', default: '_self' },
        rel: { type: 'string', default: '' },
        cssClass: { type: 'string', default: '' },
        megaMenuColumns: { type: 'number', default: 4 },
        megaMenuFullWidth: { type: 'boolean', default: true },
        flyoutPosition: { type: 'string', default: 'right' },
        flyoutWidth: { type: 'string', default: '300px' },
        multilevelMaxDepth: { type: 'number', default: 3 },
        isActive: { type: 'boolean', default: true },
        orderIndex: { type: 'number', default: 0 }
    },
    supports: {
        anchor: true,
        customClassName: true,
        html: false,
        multiple: false,
        reusable: false
    },
    edit: Edit,
    save: Save,
});
