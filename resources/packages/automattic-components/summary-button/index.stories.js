import { jsx as _jsx } from "react/jsx-runtime";
import { Icon } from '@wordpress/components';
import { envelope, receipt, backup } from '@wordpress/icons';
import SummaryButton from './index';
// Define field options for the controls.
const badgeOptions = {
    'Three Badges': [
        { text: 'Active', intent: 'success' },
        { text: 'Auto-renew on', intent: 'info' },
        { text: 'Primary', intent: 'default' },
    ],
    'Two Badges': [
        { text: 'Needs attention', intent: 'warning' },
        { text: 'Auto-renew off', intent: 'error' },
    ],
    'One Badge': [{ text: 'Coming soon', intent: 'info' }],
    'No Badges': [],
};
const meta = {
    title: 'SummaryButton',
    component: SummaryButton,
    argTypes: {
        decoration: {
            control: 'select',
            options: ['envelope', 'receipt', 'backup', 'image'],
            mapping: {
                envelope: _jsx(Icon, { icon: envelope }),
                receipt: _jsx(Icon, { icon: receipt }),
                backup: _jsx(Icon, { icon: backup }),
                image: _jsx("img", { src: "https://live.staticflickr.com/5725/21726228300_51333bd62c_b.jpg", alt: "" }),
            },
        },
        badges: {
            control: 'select',
            options: Object.keys(badgeOptions),
            mapping: badgeOptions,
            description: 'Pre-defined badge sets to display',
        },
    },
    parameters: {
        actions: { argTypesRegex: '^on.*' },
    },
};
export default meta;
export const Default = {
    args: {
        title: 'Domain Settings',
        description: 'Manage your domain settings, DNS, email, and more.',
        badges: badgeOptions['Two Badges'],
    },
};
export const LowDensity = {
    args: {
        title: 'Domain Settings',
        description: 'Manage your domain settings, DNS, email, and more.',
        strapline: 'Some settings require attention',
        density: 'low',
        decoration: _jsx(Icon, { icon: receipt }),
        badges: badgeOptions['Three Badges'],
    },
};
export const MediumDensity = {
    args: {
        title: 'Email Configuration',
        description: 'Setup email forwarding for your domain.',
        density: 'medium',
        decoration: _jsx(Icon, { icon: envelope }),
        badges: badgeOptions['Two Badges'],
    },
};
//# sourceMappingURL=index.stories.js.map