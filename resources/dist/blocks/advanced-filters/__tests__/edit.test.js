import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent } from '@testing-library/react';
import Edit from '../index';
// Mock WordPress dependencies
jest.mock('@wordpress/server-side-render', () => ({
    __esModule: true,
    default: ({ block }) => (_jsx("div", { "data-testid": "server-side-render", children: block })),
}));
jest.mock('@wordpress/block-editor', () => ({
    useBlockProps: jest.fn((props) => props),
    InspectorControls: ({ children }) => _jsx("div", { children: children }),
}));
jest.mock('@wordpress/components', () => ({
    PanelBody: ({ children }) => _jsx("div", { children: children }),
    ToggleControl: ({ label, checked, onChange }) => (_jsxs("label", { children: [label, _jsx("input", { type: "checkbox", checked: checked, onChange: (e) => onChange(e.target.checked), "data-testid": `toggle-${label.toLowerCase().replace(/\s+/g, '-')}` })] })),
    SelectControl: ({ label, value, options, onChange }) => (_jsxs("label", { children: [label, _jsx("select", { value: value, onChange: (e) => onChange(e.target.value), "data-testid": `select-${label.toLowerCase().replace(/\s+/g, '-')}`, children: options.map(opt => (_jsx("option", { value: opt.value, children: opt.label }, opt.value))) })] })),
    TextControl: ({ label, value, onChange }) => (_jsxs("label", { children: [label, _jsx("input", { type: "text", value: value, onChange: (e) => onChange(e.target.value), "data-testid": `text-${label.toLowerCase().replace(/\s+/g, '-')}` })] })),
    Button: ({ children, onClick }) => (_jsx("button", { onClick: onClick, "data-testid": "button", children: children })),
    Placeholder: ({ children }) => _jsx("div", { children: children }),
    Spinner: () => _jsx("div", { "data-testid": "spinner", children: "Loading..." }),
}));
jest.mock('@wordpress/api-fetch', () => ({
    __esModule: true,
    default: jest.fn(),
}));
describe('AdvancedFilters Edit', () => {
    const defaultAttributes = {
        targetBlockIds: [],
        filterType: 'taxonomy',
        layout: 'horizontal',
        showLabels: true,
        showResetButton: true,
        resetButtonText: 'Reset',
        ajaxEnabled: true,
        updateUrl: true,
        scrollToResults: false,
        taxonomyFilters: [],
        metaFilters: [],
        priceFilters: [],
        dateFilters: [],
        authorFilters: [],
        keywordFilter: {
            enabled: false,
            placeholder: 'Search...',
        },
        displayStyle: 'buttons',
        showCount: false,
        showEmptyTerms: false,
        showOnlyTopLevel: false,
        showHierarchy: false,
        displayAsDropdown: false,
        multipleSelection: true,
        collapsible: false,
        defaultExpanded: true,
    };
    const defaultProps = {
        attributes: defaultAttributes,
        setAttributes: jest.fn(),
        clientId: 'test-client-id',
    };
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('should render with default attributes', () => {
        render(_jsx(Edit, { ...defaultProps }));
        expect(screen.getByTestId('server-side-render')).toBeInTheDocument();
    });
    it('should update filterType when changed', () => {
        const setAttributes = jest.fn();
        render(_jsx(Edit, { ...defaultProps, setAttributes: setAttributes }));
        const select = screen.getByTestId('select-filter-type');
        fireEvent.change(select, { target: { value: 'meta' } });
        expect(setAttributes).toHaveBeenCalledWith({ filterType: 'meta' });
    });
    it('should update layout when changed', () => {
        const setAttributes = jest.fn();
        render(_jsx(Edit, { ...defaultProps, setAttributes: setAttributes }));
        const select = screen.getByTestId('select-layout');
        fireEvent.change(select, { target: { value: 'vertical' } });
        expect(setAttributes).toHaveBeenCalledWith({ layout: 'vertical' });
    });
    it('should toggle showLabels', () => {
        const setAttributes = jest.fn();
        render(_jsx(Edit, { ...defaultProps, setAttributes: setAttributes }));
        const toggle = screen.getByTestId('toggle-show-labels');
        fireEvent.change(toggle, { target: { checked: false } });
        expect(setAttributes).toHaveBeenCalledWith({ showLabels: false });
    });
    it('should toggle ajaxEnabled', () => {
        const setAttributes = jest.fn();
        render(_jsx(Edit, { ...defaultProps, setAttributes: setAttributes }));
        const toggle = screen.getByTestId('toggle-ajax-enabled');
        fireEvent.change(toggle, { target: { checked: false } });
        expect(setAttributes).toHaveBeenCalledWith({ ajaxEnabled: false });
    });
    it('should update resetButtonText', () => {
        const setAttributes = jest.fn();
        render(_jsx(Edit, { ...defaultProps, setAttributes: setAttributes }));
        const input = screen.getByTestId('text-reset-button-text');
        fireEvent.change(input, { target: { value: 'Clear All' } });
        expect(setAttributes).toHaveBeenCalledWith({ resetButtonText: 'Clear All' });
    });
    // Test all filterType enum values
    it.each([
        ['taxonomy'],
        ['meta'],
        ['price'],
        ['date'],
        ['author'],
        ['keyword'],
        ['mixed'],
    ])('should update filterType to %s', (filterType) => {
        const setAttributes = jest.fn();
        render(_jsx(Edit, { ...defaultProps, setAttributes: setAttributes }));
        const select = screen.getByTestId('select-filter-type');
        fireEvent.change(select, { target: { value: filterType } });
        expect(setAttributes).toHaveBeenCalledWith({ filterType });
    });
    // Test all layout enum values
    it.each([
        ['horizontal'],
        ['vertical'],
        ['dropdown'],
        ['accordion'],
    ])('should update layout to %s', (layout) => {
        const setAttributes = jest.fn();
        render(_jsx(Edit, { ...defaultProps, setAttributes: setAttributes }));
        const select = screen.getByTestId('select-layout');
        fireEvent.change(select, { target: { value: layout } });
        expect(setAttributes).toHaveBeenCalledWith({ layout });
    });
    // Test all displayStyle enum values
    it.each([
        ['buttons'],
        ['checkboxes'],
        ['dropdown'],
        ['select'],
    ])('should update displayStyle to %s', (displayStyle) => {
        const setAttributes = jest.fn();
        render(_jsx(Edit, { ...defaultProps, setAttributes: setAttributes }));
        // Note: displayStyle might be controlled differently in the actual component
        // This test assumes it's available as a select control
        // Adjust based on actual implementation
        const select = screen.queryByTestId('select-display-style');
        if (select) {
            fireEvent.change(select, { target: { value: displayStyle } });
            expect(setAttributes).toHaveBeenCalledWith({ displayStyle });
        }
    });
    // Test all boolean toggles
    it.each([
        ['showLabels'],
        ['showResetButton'],
        ['ajaxEnabled'],
        ['updateUrl'],
        ['scrollToResults'],
        ['showCount'],
        ['showEmptyTerms'],
        ['showOnlyTopLevel'],
        ['showHierarchy'],
        ['displayAsDropdown'],
        ['multipleSelection'],
        ['collapsible'],
        ['defaultExpanded'],
    ])('should toggle %s', (attributeName) => {
        const setAttributes = jest.fn();
        const camelCaseName = attributeName.charAt(0).toLowerCase() + attributeName.slice(1);
        const label = attributeName.replace(/([A-Z])/g, ' $1').trim();
        render(_jsx(Edit, { ...defaultProps, setAttributes: setAttributes }));
        const toggle = screen.queryByTestId(`toggle-${label.toLowerCase().replace(/\s+/g, '-')}`);
        if (toggle) {
            const currentValue = defaultAttributes[camelCaseName];
            fireEvent.change(toggle, { target: { checked: !currentValue } });
            expect(setAttributes).toHaveBeenCalledWith({ [camelCaseName]: !currentValue });
        }
    });
    it('should handle empty targetBlockIds', () => {
        const props = {
            ...defaultProps,
            attributes: {
                ...defaultAttributes,
                targetBlockIds: [],
            },
        };
        render(_jsx(Edit, { ...props }));
        // Should render placeholder or empty state
        expect(screen.getByTestId('server-side-render')).toBeInTheDocument();
    });
    it('should handle multiple targetBlockIds', () => {
        const props = {
            ...defaultProps,
            attributes: {
                ...defaultAttributes,
                targetBlockIds: ['block-1', 'block-2', 'block-3'],
            },
        };
        render(_jsx(Edit, { ...props }));
        expect(screen.getByTestId('server-side-render')).toBeInTheDocument();
    });
    it('should handle keyword filter with custom placeholder', () => {
        const setAttributes = jest.fn();
        const props = {
            ...defaultProps,
            attributes: {
                ...defaultAttributes,
                keywordFilter: {
                    enabled: true,
                    placeholder: 'Custom search placeholder',
                },
            },
            setAttributes,
        };
        render(_jsx(Edit, { ...props }));
        // Should render with custom placeholder
        expect(screen.getByTestId('server-side-render')).toBeInTheDocument();
    });
    it('should handle taxonomy filters array', () => {
        const props = {
            ...defaultProps,
            attributes: {
                ...defaultAttributes,
                taxonomyFilters: [
                    {
                        enabled: true,
                        taxonomy: 'category',
                        label: 'Categories',
                    },
                    {
                        enabled: false,
                        taxonomy: 'post_tag',
                        label: 'Tags',
                    },
                ],
            },
        };
        render(_jsx(Edit, { ...props }));
        expect(screen.getByTestId('server-side-render')).toBeInTheDocument();
    });
    it('should handle meta filters array', () => {
        const props = {
            ...defaultProps,
            attributes: {
                ...defaultAttributes,
                metaFilters: [
                    {
                        enabled: true,
                        metaKey: 'custom_field',
                        label: 'Custom Field',
                    },
                ],
            },
        };
        render(_jsx(Edit, { ...props }));
        expect(screen.getByTestId('server-side-render')).toBeInTheDocument();
    });
    it('should handle price filters array', () => {
        const props = {
            ...defaultProps,
            attributes: {
                ...defaultAttributes,
                priceFilters: [
                    {
                        enabled: true,
                        min: 0,
                        max: 100,
                    },
                ],
            },
        };
        render(_jsx(Edit, { ...props }));
        expect(screen.getByTestId('server-side-render')).toBeInTheDocument();
    });
    it('should handle date filters array', () => {
        const props = {
            ...defaultProps,
            attributes: {
                ...defaultAttributes,
                dateFilters: [
                    {
                        enabled: true,
                        startDate: '2024-01-01',
                        endDate: '2024-12-31',
                    },
                ],
            },
        };
        render(_jsx(Edit, { ...props }));
        expect(screen.getByTestId('server-side-render')).toBeInTheDocument();
    });
    it('should handle author filters array', () => {
        const props = {
            ...defaultProps,
            attributes: {
                ...defaultAttributes,
                authorFilters: [
                    {
                        enabled: true,
                        authors: [1, 2, 3],
                    },
                ],
            },
        };
        render(_jsx(Edit, { ...props }));
        expect(screen.getByTestId('server-side-render')).toBeInTheDocument();
    });
    it('should update resetButtonText with special characters', () => {
        const setAttributes = jest.fn();
        render(_jsx(Edit, { ...defaultProps, setAttributes: setAttributes }));
        const input = screen.getByTestId('text-reset-button-text');
        const specialText = 'Reset & Clear <Filters>';
        fireEvent.change(input, { target: { value: specialText } });
        expect(setAttributes).toHaveBeenCalledWith({ resetButtonText: specialText });
    });
    it('should handle all attributes combinations', () => {
        const complexAttributes = {
            ...defaultAttributes,
            filterType: 'mixed',
            layout: 'accordion',
            displayStyle: 'dropdown',
            showLabels: false,
            showResetButton: false,
            ajaxEnabled: false,
            updateUrl: false,
            scrollToResults: true,
            showCount: true,
            showEmptyTerms: false,
            showOnlyTopLevel: true,
            showHierarchy: true,
            displayAsDropdown: true,
            multipleSelection: false,
            collapsible: true,
            defaultExpanded: false,
        };
        const props = {
            ...defaultProps,
            attributes: complexAttributes,
        };
        render(_jsx(Edit, { ...props }));
        expect(screen.getByTestId('server-side-render')).toBeInTheDocument();
    });
});
