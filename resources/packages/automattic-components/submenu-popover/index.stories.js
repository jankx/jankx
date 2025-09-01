import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import '@wordpress/components/build-style/style.css';
import { DropdownMenu, Icon, MenuGroup, MenuItem } from '@wordpress/components';
import { chevronRight } from '@wordpress/icons';
import SubmenuPopover, { useSubmenuPopoverProps } from '.';
export default { title: 'Unaudited/SubmenuPopover' };
export const Default = () => {
    const submenu = useSubmenuPopoverProps();
    const secondSubmenu = useSubmenuPopoverProps();
    return (_jsx(DropdownMenu, { label: "Menu", children: () => (_jsxs(MenuGroup, { children: [_jsx(MenuItem, { children: "Item 1" }), _jsxs("div", { ...submenu.parent, children: [_jsxs(MenuItem, { children: ["Item 2 ", _jsx(Icon, { icon: chevronRight })] }), _jsx(SubmenuPopover, { ...submenu.submenu, children: _jsxs(MenuGroup, { children: [_jsx(MenuItem, { children: "Item 2.1" }), _jsx(MenuItem, { children: "Item 2.2" }), _jsxs("div", { ...secondSubmenu.parent, children: [_jsxs(MenuItem, { children: ["Item 2.3 ", _jsx(Icon, { icon: chevronRight })] }), _jsx(SubmenuPopover, { ...secondSubmenu.submenu, children: _jsxs(MenuGroup, { children: [_jsx(MenuItem, { children: "Item 2.3.1" }), _jsx(MenuItem, { children: "Item 2.3.2" }), _jsx(MenuItem, { children: "Item 2.3.3" }), _jsx(MenuItem, { children: "Item 2.3.4" }), _jsx(MenuItem, { children: "Item 2.3.5" }), _jsx(MenuItem, { children: "Item 2.3.6" })] }) })] }), _jsx(MenuItem, { children: "Item 2.4" })] }) })] }), _jsx(MenuItem, { children: "Item 3" }), _jsx(MenuItem, { children: "Item 4" })] })) }));
};
//# sourceMappingURL=index.stories.js.map