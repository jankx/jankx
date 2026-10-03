/**
 * @jest-environment jsdom
 */

import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Edit } from '../index';

// Mock WordPress dependencies
jest.mock(
    '@wordpress/server-side-render',
    () => ({
        __esModule: true,
        default: ({ block }: { block: string }) => (
            <div data-testid="server-side-render">{block}</div>
        ),
    }),
    { virtual: true }
);

jest.mock('@wordpress/block-editor', () => ({
    useBlockProps: jest.fn((props) => props),
    InspectorControls: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    InnerBlocks: Object.assign(
        jest.fn(
            ({
                children,
                renderAppender,
            }: {
                children?: React.ReactNode;
                renderAppender?: () => React.ReactNode;
            }) => (
                <div data-testid="inner-blocks">
                    {children}
                    {renderAppender?.()}
                </div>
            )
        ),
        {
            Content: jest.fn(() => <div data-testid="inner-blocks-content" />),
            ButtonBlockAppender: jest.fn(() => <div data-testid="inner-blocks-appender" />),
        }
    ),
}));

// Mocked so the real package (and the store reducer chain it pulls in through
// `@wordpress/rich-text`) never has to load in jsdom.
jest.mock('@wordpress/blocks', () => ({
    registerBlockType: jest.fn(),
    createBlock: jest.fn((name: string, attributes: unknown) => ({ name, attributes })),
}));

// `Edit` reads inner filter blocks through `useSelect`, so the callback has to
// receive a `select` stub rather than running against an empty registry.
// `mock*` names are hoisted above the factory, so the tests can drive them.
let mockInnerBlocks: any[] = [];
let mockPageBlocks: any[] = [];

jest.mock('@wordpress/data', () => ({
    useSelect: jest.fn((mapSelect: (select: any) => any) =>
        mapSelect((store: string) =>
            store === 'core/block-editor'
                ? {
                    getBlock: () => ({ innerBlocks: mockInnerBlocks }),
                    getBlocks: () => mockPageBlocks,
                }
                : {}
        )
    ),
}));

jest.mock('@wordpress/components', () => ({
    PanelBody: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    ToggleControl: ({ label, checked, onChange, disabled }: { label: string; checked: boolean; onChange: (value: boolean) => void; disabled?: boolean }) => (
        <label>
            {label}
            <input
                type="checkbox"
                checked={checked}
                disabled={disabled}
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
    Placeholder: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="placeholder">{children}</div>
    ),
    Spinner: () => <div data-testid="spinner">Loading...</div>,
}));

jest.mock('@wordpress/api-fetch', () => ({
    __esModule: true,
    default: jest.fn(),
}));

describe('AdvancedFilters Edit', () => {
    const defaultAttributes = {
        blockId: '',
        targetBlockIds: [] as string[],
        targetPostType: 'post',
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

    const layoutBlock = {
        clientId: 'layout-1',
        name: 'jankx/dynamic-data-layout',
        attributes: { postType: 'product' },
    };

    beforeEach(() => {
        jest.clearAllMocks();
        mockInnerBlocks = [];
        mockPageBlocks = [];
        (window as any).wp = {
            data: {
                select: () => ({
                    getBlocks: () => mockPageBlocks,
                    getBlock: () => undefined,
                }),
                subscribe: () => () => undefined,
            },
        };
    });

    afterEach(() => {
        delete (window as any).wp;
    });

    it('should render the inner filter blocks container', () => {
        render(<Edit {...defaultProps} />);

        expect(screen.getByTestId('inner-blocks')).toBeInTheDocument();
        expect(screen.getByTestId('inner-blocks-appender')).toBeInTheDocument();
    });

    it('should render the frontend preview even before a target block is selected', () => {
        render(<Edit {...defaultProps} />);

        // The canvas always mirrors the frontend; no placeholder text there.
        expect(screen.getByTestId('server-side-render')).toBeInTheDocument();
        expect(
            screen.queryByText(/Please select at least one target block to filter in the sidebar/i)
        ).not.toBeInTheDocument();
    });

    it('should render the server side preview once a target block is selected', () => {
        const props = {
            ...defaultProps,
            attributes: { ...defaultAttributes, targetBlockIds: ['layout-1'] },
        };
        render(<Edit {...props} />);

        expect(screen.getByTestId('server-side-render')).toBeInTheDocument();
    });

    it('should persist the client id as blockId', () => {
        const setAttributes = jest.fn();
        render(<Edit {...defaultProps} setAttributes={setAttributes} />);

        expect(setAttributes).toHaveBeenCalledWith({ blockId: 'test-client-id' });
    });

    it.each([
        ['Enable AJAX', 'ajaxEnabled', true],
        ['Update URL', 'updateUrl', true],
        ['Scroll to Results', 'scrollToResults', false],
    ])('should toggle %s', (label, attribute, current) => {
        const setAttributes = jest.fn();
        render(<Edit {...defaultProps} setAttributes={setAttributes} />);

        const toggle = screen.getByTestId(
            `toggle-${(label as string).toLowerCase().replace(/\s+/g, '-')}`
        ) as HTMLInputElement;
        // React normalises checkbox updates through click, not change.
        fireEvent.click(toggle);

        expect(setAttributes).toHaveBeenCalledWith({ [attribute as string]: !current });
    });

    it('should disable the URL and scroll toggles when ajax is off', () => {
        const props = {
            ...defaultProps,
            attributes: { ...defaultAttributes, ajaxEnabled: false },
        };
        render(<Edit {...props} />);

        expect(screen.getByTestId('toggle-update-url')).toBeDisabled();
        expect(screen.getByTestId('toggle-scroll-to-results')).toBeDisabled();
    });

    it('should toggle the reset button text field', () => {
        const setAttributes = jest.fn();
        const props = {
            ...defaultProps,
            attributes: { ...defaultAttributes, showResetButton: false },
        };
        render(<Edit {...props} setAttributes={setAttributes} />);

        // The text field is only rendered while the reset button is enabled.
        expect(screen.queryByTestId('text-reset-button-text')).not.toBeInTheDocument();

        fireEvent.click(screen.getByTestId('toggle-show-reset-button'));

        expect(setAttributes).toHaveBeenCalledWith({ showResetButton: true });
    });

    it('should update the reset button text', () => {
        const setAttributes = jest.fn();
        render(<Edit {...defaultProps} setAttributes={setAttributes} />);

        const input = screen.getByTestId('text-reset-button-text') as HTMLInputElement;
        fireEvent.change(input, { target: { value: 'Reset & Clear <Filters>' } });

        expect(setAttributes).toHaveBeenCalledWith({
            resetButtonText: 'Reset & Clear <Filters>',
        });
    });

    it('should list target blocks discovered on the current page', () => {
        mockPageBlocks = [layoutBlock];
        render(<Edit {...defaultProps} />);

        const select = screen.getByTestId('select-target-block(s)') as HTMLSelectElement;
        const values = Array.from(select.options).map((option) => option.value);
        expect(values).toEqual(['', 'layout-1']);
    });

    it('should warn when the page has no dynamic data layout block', () => {
        render(<Edit {...defaultProps} />);

        expect(
            screen.getByText(
                /No Dynamic Data Layout blocks found in this page/i
            )
        ).toBeInTheDocument();
    });

    it('should store the selected target block', () => {
        mockPageBlocks = [layoutBlock];
        const setAttributes = jest.fn();
        render(<Edit {...defaultProps} setAttributes={setAttributes} />);

        const select = screen.getByTestId('select-target-block(s)') as HTMLSelectElement;
        fireEvent.change(select, { target: { value: 'layout-1' } });

        expect(setAttributes).toHaveBeenCalledWith({ targetBlockIds: ['layout-1'] });
    });

    it('should clear the target block selection', () => {
        mockPageBlocks = [layoutBlock];
        const setAttributes = jest.fn();
        const props = {
            ...defaultProps,
            attributes: { ...defaultAttributes, targetBlockIds: ['layout-1'] },
        };
        render(<Edit {...props} setAttributes={setAttributes} />);

        const select = screen.getByTestId('select-target-block(s)') as HTMLSelectElement;
        fireEvent.change(select, { target: { value: '' } });

        expect(setAttributes).toHaveBeenCalledWith({ targetBlockIds: [] });
    });

    it('should group inner filter blocks into their typed attributes', () => {
        const taxonomyAttributes = { filterType: 'taxonomy', taxonomy: 'category' };
        const metaAttributes = { filterType: 'meta', metaKey: 'custom_field' };
        mockInnerBlocks = [
            { attributes: taxonomyAttributes },
            { attributes: metaAttributes },
        ];
        const setAttributes = jest.fn();
        render(<Edit {...defaultProps} setAttributes={setAttributes} />);

        expect(setAttributes).toHaveBeenCalledWith({
            taxonomyFilters: [taxonomyAttributes],
            metaFilters: [metaAttributes],
            priceFilters: [],
            dateFilters: [],
            authorFilters: [],
            keywordFilter: defaultAttributes.keywordFilter,
            targetPostType: 'post',
        });
    });

    it('should show the post type of the target block', async () => {
        mockPageBlocks = [layoutBlock];
        const props = {
            ...defaultProps,
            attributes: { ...defaultAttributes, targetBlockIds: ['layout-1'] },
        };
        render(<Edit {...props} />);

        // Blocks are collected in an effect, so the post type appears async.
        await waitFor(() => expect(screen.getByText('product')).toBeInTheDocument());
    });
});
