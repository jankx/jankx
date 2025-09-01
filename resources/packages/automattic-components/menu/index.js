import { privateApis } from '@wordpress/components';
import { __dangerousOptInToUnstableAPIsOnlyForCoreModules } from '@wordpress/private-apis';
// TODO: When the component is publicly available, we should remove the private API usage and
// import it directly from @wordpress/components as it will cause a build error.
const { unlock } = __dangerousOptInToUnstableAPIsOnlyForCoreModules('I acknowledge private features are not for use in themes or plugins and doing so will break in the next version of WordPress.', '@wordpress/components');
const { Menu: CoreMenu } = unlock(privateApis);
/**
 * Menu is a collection of React components that combine to render
 * ARIA-compliant [menu](https://www.w3.org/WAI/ARIA/apg/patterns/menu/) and
 * [menu button](https://www.w3.org/WAI/ARIA/apg/patterns/menubutton/) patterns.
 *
 * `Menu` itself is a wrapper component and context provider.
 * It is responsible for managing the state of the menu and its items, and for
 * rendering the `Menu.TriggerButton` (or the `Menu.SubmenuTriggerItem`)
 * component, and the `Menu.Popover` component.
 */
export const Menu = Object.assign(CoreMenu, {
    Context: Object.assign(CoreMenu.Context, {
        displayName: 'Menu.Context',
    }),
    /**
     * Renders a menu item inside the `Menu.Popover` or `Menu.Group` components.
     *
     * It can optionally contain one instance of the `Menu.ItemLabel` component
     * and one instance of the `Menu.ItemHelpText` component.
     */
    Item: Object.assign(CoreMenu.Item, {
        displayName: 'Menu.Item',
    }),
    /**
     * Renders a radio menu item inside the `Menu.Popover` or `Menu.Group`
     * components.
     *
     * It can optionally contain one instance of the `Menu.ItemLabel` component
     * and one instance of the `Menu.ItemHelpText` component.
     */
    RadioItem: Object.assign(CoreMenu.RadioItem, {
        displayName: 'Menu.RadioItem',
    }),
    /**
     * Renders a checkbox menu item inside the `Menu.Popover` or `Menu.Group`
     * components.
     *
     * It can optionally contain one instance of the `Menu.ItemLabel` component
     * and one instance of the `Menu.ItemHelpText` component.
     */
    CheckboxItem: Object.assign(CoreMenu.CheckboxItem, {
        displayName: 'Menu.CheckboxItem',
    }),
    /**
     * Renders a group for menu items.
     *
     * It should contain one instance of `Menu.GroupLabel` and one or more
     * instances of `Menu.Item`, `Menu.RadioItem`, or `Menu.CheckboxItem`.
     */
    Group: Object.assign(CoreMenu.Group, {
        displayName: 'Menu.Group',
    }),
    /**
     * Renders a label in a menu group.
     *
     * This component should be wrapped with `Menu.Group` so the
     * `aria-labelledby` is correctly set on the group element.
     */
    GroupLabel: Object.assign(CoreMenu.GroupLabel, {
        displayName: 'Menu.GroupLabel',
    }),
    /**
     * Renders a divider between menu items or menu groups.
     */
    Separator: Object.assign(CoreMenu.Separator, {
        displayName: 'Menu.Separator',
    }),
    /**
     * Renders a menu item's label text. It should be wrapped with `Menu.Item`,
     * `Menu.RadioItem`, or `Menu.CheckboxItem`.
     */
    ItemLabel: Object.assign(CoreMenu.ItemLabel, {
        displayName: 'Menu.ItemLabel',
    }),
    /**
     * Renders a menu item's help text. It should be wrapped with `Menu.Item`,
     * `Menu.RadioItem`, or `Menu.CheckboxItem`.
     */
    ItemHelpText: Object.assign(CoreMenu.ItemHelpText, {
        displayName: 'Menu.ItemHelpText',
    }),
    /**
     * Renders a dropdown menu element that's controlled by a sibling
     * `Menu.TriggerButton` component. It renders a popover and automatically
     * focuses on items when the menu is shown.
     *
     * The only valid children of `Menu.Popover` are `Menu.Item`,
     * `Menu.RadioItem`, `Menu.CheckboxItem`, `Menu.Group`, `Menu.Separator`,
     * and `Menu` (for nested dropdown menus).
     */
    Popover: Object.assign(CoreMenu.Popover, {
        displayName: 'Menu.Popover',
    }),
    /**
     * Renders a menu button that toggles the visibility of a sibling
     * `Menu.Popover` component when clicked or when using arrow keys.
     */
    TriggerButton: Object.assign(CoreMenu.TriggerButton, {
        displayName: 'Menu.TriggerButton',
    }),
    /**
     * Renders a menu item that toggles the visibility of a sibling
     * `Menu.Popover` component when clicked or when using arrow keys.
     *
     * This component is used to create a nested dropdown menu.
     */
    SubmenuTriggerItem: Object.assign(CoreMenu.SubmenuTriggerItem, {
        displayName: 'Menu.SubmenuTriggerItem',
    }),
});
export default Menu;
//# sourceMappingURL=index.js.map