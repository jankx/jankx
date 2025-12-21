/**
 * Menu Item Block - Save Component
 * 
 * @package JankX\MenuBuilder\Blocks
 * @since 1.0.0
 */

import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';

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

const Save = ({ attributes }: { attributes: MenuItemAttributes }) => {
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

    const blockProps = useBlockProps.save({
        className: `menu-item ${type === 'button' ? 'menu-item-button' : ''} ${submenuType !== 'none' ? 'has-children' : ''} ${!isActive ? 'menu-item-inactive' : ''} ${cssClass}`,
        'data-item-id': itemId,
        'data-submenu-type': submenuType,
        'data-mega-columns': megaMenuColumns,
        'data-mega-full-width': megaMenuFullWidth,
        'data-flyout-position': flyoutPosition,
        'data-flyout-width': flyoutWidth,
        'data-max-depth': multilevelMaxDepth,
        'data-order-index': orderIndex
    });

    const linkProps: any = {
        href: url || '#',
        className: 'menu-item-link'
    };

    if (target) {
        linkProps.target = target;
    }

    if (rel) {
        linkProps.rel = rel;
    }

    if (icon) {
        linkProps['data-icon'] = icon;
    }

    return (
        <li {...blockProps}>
            <a {...linkProps}>
                {icon && <span className="menu-item-icon" dangerouslySetInnerHTML={{ __html: icon }} />}
                <span className="menu-item-label">{label}</span>
            </a>
        </li>
    );
};

export default Save;
