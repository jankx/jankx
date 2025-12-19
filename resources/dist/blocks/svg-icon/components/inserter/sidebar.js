import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * External dependencies
 */
import classnames from 'classnames';
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { MenuGroup, MenuItem, SearchControl } from '@wordpress/components';
import { useMemo } from '@wordpress/element';
/**
 * Internal dependencies
 */
import { simplifyCategories } from '../../utils';
const ALL_CATEGORY_PREFIX = 'all__';
export default function Sidebar(props) {
    const { iconsByType, currentCategory, onClickCategory, searchInput, setSearchInput, } = props;
    const preparedTypes = useMemo(() => {
        return iconsByType.map((type) => {
            const title = type?.title ?? type.type;
            const categoriesFull = type?.categories ?? [];
            const categories = simplifyCategories(categoriesFull);
            const allCategory = `${ALL_CATEGORY_PREFIX}${type.type}`;
            const iconsOfType = type?.icons ?? [];
            // Sort alphabetically and then add the "all" category.
            if (!categories.includes(allCategory)) {
                categories.sort().unshift(allCategory);
                categoriesFull.unshift({
                    name: allCategory,
                    title: __('All', 'icon-block'),
                });
            }
            return {
                type: type.type,
                title,
                categoriesFull,
                categories,
                count: iconsOfType.length,
            };
        });
    }, [iconsByType]);
    function renderIconTypeCategories(type) {
        return (_jsx(MenuGroup, { className: "icon-inserter__sidebar__category-type", label: type.title, children: type.categories.map((category) => {
                const isActive = currentCategory
                    ? category === currentCategory
                    : category === `${ALL_CATEGORY_PREFIX}${type.type}`;
                const categoryIcons = iconsByType
                    .find((t) => t.type === type.type)
                    ?.icons.filter((icon) => {
                    const iconCats = icon?.categories ?? [];
                    return iconCats.includes(category);
                }) ?? [];
                const categoryTitle = type.categoriesFull.find((c) => c.name === category)
                    ?.title ?? category;
                return (_jsxs(MenuItem, { className: classnames({
                        'is-active': isActive,
                    }), onClick: () => onClickCategory(category), isPressed: isActive, children: [categoryTitle, _jsx("span", { children: category ===
                                `${ALL_CATEGORY_PREFIX}${type.type}`
                                ? type.count
                                : categoryIcons.length })] }, `category-${category}`));
            }) }, `type-${type.type}`));
    }
    return (_jsxs("div", { className: "icon-inserter__sidebar", children: [_jsx("div", { className: "icon-inserter__sidebar__search", children: _jsx(SearchControl, { value: searchInput, onChange: setSearchInput, __nextHasNoMarginBottom: true }) }), preparedTypes.map((type) => renderIconTypeCategories(type))] }));
}
