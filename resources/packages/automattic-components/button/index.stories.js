import { jsx as _jsx } from "react/jsx-runtime";
import { fn } from '@storybook/test';
import { Button } from '.';
/**
 * This button has been deprecated due to aggressive and generic CSS that breaks many other buttons when imported.
 * Use the [`Button` component](https://wordpress.github.io/gutenberg/?path=/docs/components-button--docs)
 * from `@wordpress/components` instead.
 */
const meta = {
    title: 'Deprecated/Button',
    component: Button,
    args: {
        onClick: fn(),
    },
    parameters: {
        docs: {
            canvas: { sourceState: 'shown' },
        },
    },
};
export default meta;
export const Default = {
    args: {
        children: 'Hello World!',
    },
};
export const Compact = {
    ...Default,
    args: {
        ...Default.args,
        compact: true,
    },
};
export const Busy = {
    ...Default,
    args: {
        ...Default.args,
        busy: true,
    },
};
export const Scary = {
    ...Default,
    args: {
        ...Default.args,
        scary: true,
    },
};
export const Borderless = {
    ...Default,
    args: {
        ...Default.args,
        borderless: true,
    },
};
export const Disabled = {
    ...Default,
    args: {
        ...Default.args,
        disabled: true,
    },
};
export const Link = {
    ...Default,
    args: {
        ...Default.args,
        href: 'https://www.automattic.com/',
        target: '_blank',
    },
};
export const Plain = {
    ...Default,
    args: {
        ...Default.args,
        plain: true,
    },
};
export const Transparent = {
    ...Default,
    args: {
        ...Default.args,
        transparent: true,
        style: {
            '--transparent-button-text-color': '#eee',
            '--transparent-button-text-color-hover': '#00b9eb',
        },
    },
    decorators: [
        (Story) => (_jsx("div", { style: { padding: '20px', background: 'black' }, children: _jsx(Story, {}) })),
    ],
};
//# sourceMappingURL=index.stories.js.map