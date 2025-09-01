import { jsx as _jsx } from "react/jsx-runtime";
import { ExternalLink } from '@wordpress/components';
import { Button } from '../button';
import NoticeBanner from './index';
export default {
    title: 'Unaudited/Notice Banner',
    component: NoticeBanner,
    argTypes: {
        level: {
            control: {
                type: 'select',
                options: ['info', 'success', 'warning', 'error'],
            },
        },
        hideCloseButton: {
            control: {
                type: 'boolean',
            },
        },
    },
};
const Template = (args) => _jsx(NoticeBanner, { ...args });
export const _default = Template.bind({});
_default.args = {
    level: 'info',
    title: 'Improve your hovercraft',
    children: 'Make your hovercraft better with HoverPack; the best hovercraft upgrade kit on the market.',
    onClose: () => alert('Close clicked'),
    actions: [
        _jsx(Button, { primary: true, children: "Install now" }, "install"),
        _jsx(ExternalLink, { href: "https://en.wikipedia.org/wiki/Hovercraft", children: "Learn more" }, "learn-more"),
    ],
    hideCloseButton: false,
};
export const warning = Template.bind({});
warning.args = {
    level: 'warning',
    title: 'Your hovercraft is full of eels.',
    children: (_jsx("div", { children: "Either your vehicle needs to be cleared, or some kind of translation error has occurred." })),
    actions: [
        _jsx(Button, { primary: true, children: "Start Bailing" }, "bail"),
        _jsx(ExternalLink, { href: "https://en.wikipedia.org/wiki/Hovercraft", children: "Learn more" }, "learn-more"),
    ],
    hideCloseButton: false,
};
export const success = Template.bind({});
success.args = {
    level: 'success',
    title: 'Your hovercraft has been upgraded.',
    children: 'Please enjoy your newer, cooler hovercraft.',
    onClose: () => alert('Close clicked'),
    actions: [
        _jsx(Button, { isPrimary: true, children: "Start crafting" }, "start"),
    ],
    hideCloseButton: false,
};
export const error = Template.bind({});
error.args = {
    level: 'error',
    title: 'The eels have stolen your hovercraft.',
    children: 'We were unable to remove the eels from your hovercraft. Please contact the authorities, as the eels are armed and dangerous.',
    onClose: () => alert('Close clicked'),
    actions: [
        _jsx(ExternalLink, { href: "https://en.wikipedia.org/wiki/Eel", children: "Learn more" }, "learn-more"),
    ],
    hideCloseButton: false,
};
//# sourceMappingURL=notice-banner.stories.js.map