/**
 * Menu Builder Block - Save Component
 * Responsive menu with mmenu integration for JankX theme
 */

import { __ } from '@wordpress/i18n';
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import metadata from './block.json';

// Types
interface MenuItem {
    id: string;
    label: string;
    url: string;
    type: 'link' | 'button' | 'dropdown';
    submenuType?: 'multilevel' | 'mega' | 'flyout';
    children: MenuItem[];
    megaMenuColumns?: number;
    megaMenuFullWidth?: boolean;
    flyoutPosition?: 'left' | 'right';
    flyoutWidth?: string;
    target?: '_self' | '_blank';
    rel?: string;
    cssClass?: string;
    icon?: string;
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

const Save = ({ attributes }: { attributes: BlockAttributes }) => {
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

    const blockProps = useBlockProps.save({
        className: menuClass,
        id: menuId,
        'data-mobile-breakpoint': mobileBreakpoint,
        'data-desktop-breakpoint': desktopBreakpoint,
        'data-enable-mobile': enableMobileMenu,
        'data-enable-desktop': enableDesktopMenu,
        'data-mobile-options': JSON.stringify(mobileMenuOptions),
        'data-desktop-options': JSON.stringify(desktopMenuOptions),
        'data-mobile-icon': mobileMenuIcon,
        'data-mobile-position': mobileMenuPosition,
        'data-submenu-types': JSON.stringify(submenuTypes),
        'data-mega-menu-settings': JSON.stringify(megaMenuSettings),
        'data-flyout-menu-settings': JSON.stringify(flyoutMenuSettings),
        'data-multilevel-menu-settings': JSON.stringify(multilevelMenuSettings)
    });

    /**
     * Generate CSS classes for menu item
     */
    const generateMenuItemClasses = (item: MenuItem): string => {
        const classes = [
            'menu-item',
            `menu-item-type-${item.type}`,
            `menu-item-id-${item.id}`
        ];

        if (item.submenuType && item.children && item.children.length > 0) {
            classes.push(`submenu-type-${item.submenuType}`);
            classes.push('has-children');
        }

        if (item.cssClass) {
            classes.push(item.cssClass);
        }

        return classes.join(' ');
    };

    /**
     * Generate CSS classes for submenu
     */
    const generateSubmenuClasses = (item: MenuItem): string => {
        const classes = ['sub-menu'];

        if (item.submenuType) {
            classes.push(`submenu-${item.submenuType}`);
        }

        if (item.submenuType === 'mega') {
            classes.push('mega-menu');
            if (item.megaMenuFullWidth) {
                classes.push('mega-menu-full-width');
            }
            classes.push(`mega-menu-columns-${item.megaMenuColumns || 4}`);
        }

        if (item.submenuType === 'flyout') {
            classes.push('flyout-menu');
            classes.push(`flyout-position-${item.flyoutPosition || 'right'}`);
        }

        return classes.join(' ');
    };

    /**
     * Generate link attributes
     */
    const generateLinkAttributes = (item: MenuItem) => {
        const attrs: any = {
            href: item.url || '#',
            className: 'menu-item-link'
        };

        if (item.target) {
            attrs.target = item.target;
        }

        if (item.rel) {
            attrs.rel = item.rel;
        }

        if (item.icon) {
            attrs['data-icon'] = item.icon;
        }

        return attrs;
    };

    /**
     * Render menu structure recursively
     */
    const renderMenuStructure = (items: MenuItem[]): JSX.Element[] => {
        return items.map(item => (
            <li key={item.id} className={generateMenuItemClasses(item)}>
                <a {...generateLinkAttributes(item)}>
                    {item.icon && <span className="menu-item-icon" dangerouslySetInnerHTML={{ __html: item.icon }} />}
                    <span className="menu-item-label">{item.label}</span>
                </a>
                {item.children && item.children.length > 0 && (
                    <ul className={generateSubmenuClasses(item)}>
                        {renderMenuStructure(item.children)}
                    </ul>
                )}
            </li>
        ));
    };

    return (
        <nav {...blockProps}>
            {enableMobileMenu && (
                <button 
                    className={`mobile-menu-toggle mobile-menu-${mobileMenuPosition}`}
                    aria-label={__('Toggle Mobile Menu', 'jankx')}
                >
                    <span className={`mobile-menu-icon mobile-menu-icon-${mobileMenuIcon}`} />
                </button>
            )}
            <ul className="menu">
                <InnerBlocks.Content />
            </ul>
        </nav>
    );
};

export default Save;
