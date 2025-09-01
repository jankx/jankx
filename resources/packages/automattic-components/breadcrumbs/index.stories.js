import { Breadcrumbs } from './';
const meta = {
    title: 'Breadcrumbs',
    component: Breadcrumbs,
    tags: ['autodocs'],
    parameters: {
        actions: { argTypesRegex: '^on.*' },
    },
};
export default meta;
export const Default = {
    args: {
        items: [
            { label: 'Home', href: 'javascript:void(0)' },
            { label: 'Products', href: 'javascript:void(0)' },
            { label: 'Electronics', href: 'javascript:void(0)' },
            { label: 'Computers', href: 'javascript:void(0)' },
        ],
    },
};
export const WithCurrentItemVisible = {
    args: {
        ...Default.args,
        showCurrentItem: true,
    },
};
export const WithLongPath = {
    args: {
        ...Default.args,
        items: [
            { label: 'Home', href: 'javascript:void(0)' },
            { label: 'Products', href: 'javascript:void(0)' },
            { label: 'Electronics', href: 'javascript:void(0)' },
            { label: 'Computers', href: 'javascript:void(0)' },
            { label: 'Laptops', href: 'javascript:void(0)' },
            { label: 'Gaming', href: 'javascript:void(0)' },
            { label: '17 inch', href: 'javascript:void(0)' },
            {
                label: 'Alienware X17',
                href: 'javascript:void(0)',
            },
        ],
    },
};
//# sourceMappingURL=index.stories.js.map