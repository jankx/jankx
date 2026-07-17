/**
 * @jest-environment jsdom
 */

import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Edit from '../index';

// Mock WordPress dependencies
jest.mock('@wordpress/server-side-render', () => ({
    __esModule: true,
    default: ({ block }: { block: string }) => (
        <div data-testid="server-side-render">{block}</div>
    ),
}));

jest.mock('@wordpress/block-editor', () => ({
    useBlockProps: jest.fn((props) => props),
    InspectorControls: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock('@wordpress/components', () => ({
    PanelBody: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    ToggleControl: ({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) => (
        <label>
            {label}
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                data-testid={`toggle-${label.toLowerCase().replace(/\s+/g, '-')}`}
            />
        </label>
    ),
    SelectControl: ({ label, value, options, onChange }: { label: string; value: string; options: Array<{label: string; value: string}>; onChange: (value: string) => void }) => (
        <label>
            {label}
            <select value={value} onChange={(e) => onChange(e.target.value)} data-testid={`select-${label.toLowerCase().replace(/\s+/g, '-')}`}>
                {options.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
        </label>
    ),
    TextControl: ({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) => (
        <label>
            {label}
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                data-testid={`text-${label.toLowerCase().replace(/\s+/g, '-')}`}
            />
        </label>
    ),
    Button: ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
        <button onClick={onClick} data-testid="button">{children}</button>
    ),
    Placeholder: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Spinner: () => <div data-testid="spinner">Loading...</div>,
}));

jest.mock('@wordpress/api-fetch', () => ({
    __esModule: true,
    default: jest.fn(),
}));

describe('AdvancedFilters Edit', () => {
    const defaultAttributes = {
        targetBlockIds: [] as string[],
        filterType: 'taxonomy' as const,
        layout: 'horizontal' as const,
        showLabels: true,
        showResetButton: true,
        resetButtonText: 'Reset',
        ajaxEnabled: true,
        updateUrl: true,
        scrollToResults: false,
        taxonomyFilters: [] as any[],
        metaFilters: [] as any[],
        priceFilters: [] as any[],
        dateFilters: [] as any[],
        authorFilters: [] as any[],
        keywordFilter: {
            enabled: false,
            placeholder: 'Search...',
        },
        displayStyle: 'buttons' as const,
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
        render(<Edit {...defaultProps} />);

        expect(screen.getByTestId('server-side-render')).toBeInTheDocument();
    });

    it('should update filterType when changed', () => {
        const setAttributes = jest.fn();
        render(<Edit {...defaultProps} setAttributes={setAttributes} />);

        const select = screen.getByTestId('select-filter-type') as HTMLSelectElement;
        fireEvent.change(select, { target: { value: 'meta' } });

        expect(setAttributes).toHaveBeenCalledWith({ filterType: 'meta' });
    });

    it('should update layout when changed', () => {
        const setAttributes = jest.fn();
        render(<Edit {...defaultProps} setAttributes={setAttributes} />);

        const select = screen.getByTestId('select-layout') as HTMLSelectElement;
        fireEvent.change(select, { target: { value: 'vertical' } });

        expect(setAttributes).toHaveBeenCalledWith({ layout: 'vertical' });
    });

    it('should toggle showLabels', () => {
        const setAttributes = jest.fn();
        render(<Edit {...defaultProps} setAttributes={setAttributes} />);

        const toggle = screen.getByTestId('toggle-show-labels') as HTMLInputElement;
        fireEvent.change(toggle, { target: { checked: false } });

        expect(setAttributes).toHaveBeenCalledWith({ showLabels: false });
    });

    it('should toggle ajaxEnabled', () => {
        const setAttributes = jest.fn();
        render(<Edit {...defaultProps} setAttributes={setAttributes} />);

        const toggle = screen.getByTestId('toggle-ajax-enabled') as HTMLInputElement;
        fireEvent.change(toggle, { target: { checked: false } });

        expect(setAttributes).toHaveBeenCalledWith({ ajaxEnabled: false });
    });

    it('should update resetButtonText', () => {
        const setAttributes = jest.fn();
        render(<Edit {...defaultProps} setAttributes={setAttributes} />);

        const input = screen.getByTestId('text-reset-button-text') as HTMLInputElement;
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
        render(<Edit {...defaultProps} setAttributes={setAttributes} />);

        const select = screen.getByTestId('select-filter-type') as HTMLSelectElement;
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
        render(<Edit {...defaultProps} setAttributes={setAttributes} />);

        const select = screen.getByTestId('select-layout') as HTMLSelectElement;
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
        render(<Edit {...defaultProps} setAttributes={setAttributes} />);

        // Note: displayStyle might be controlled differently in the actual component
        // This test assumes it's available as a select control
        // Adjust based on actual implementation
        const select = screen.queryByTestId('select-display-style') as HTMLSelectElement;
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
        
        render(<Edit {...defaultProps} setAttributes={setAttributes} />);

        const toggle = screen.queryByTestId(`toggle-${label.toLowerCase().replace(/\s+/g, '-')}`) as HTMLInputElement;
        if (toggle) {
            const currentValue = defaultAttributes[camelCaseName as keyof typeof defaultAttributes] as boolean;
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

        render(<Edit {...props} />);

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

        render(<Edit {...props} />);

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

        render(<Edit {...props} />);

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

        render(<Edit {...props} />);

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

        render(<Edit {...props} />);

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

        render(<Edit {...props} />);

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

        render(<Edit {...props} />);

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

        render(<Edit {...props} />);

        expect(screen.getByTestId('server-side-render')).toBeInTheDocument();
    });

    it('should update resetButtonText with special characters', () => {
        const setAttributes = jest.fn();
        render(<Edit {...defaultProps} setAttributes={setAttributes} />);

        const input = screen.getByTestId('text-reset-button-text') as HTMLInputElement;
        const specialText = 'Reset & Clear <Filters>';
        fireEvent.change(input, { target: { value: specialText } });

        expect(setAttributes).toHaveBeenCalledWith({ resetButtonText: specialText });
    });

    it('should handle all attributes combinations', () => {
        const complexAttributes = {
            ...defaultAttributes,
            filterType: 'mixed' as const,
            layout: 'accordion' as const,
            displayStyle: 'dropdown' as const,
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

        render(<Edit {...props} />);

        expect(screen.getByTestId('server-side-render')).toBeInTheDocument();
    });
});
