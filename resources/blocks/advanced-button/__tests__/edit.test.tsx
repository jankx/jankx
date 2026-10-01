/**
 * @jest-environment jsdom
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Edit from '../edit';

jest.mock('@wordpress/data', () => ({
    useSelect: jest.fn((callback: (select: (scope: string) => any) => unknown) =>
        callback((scope: string) => {
            if (scope === 'core/block-editor') {
                return {
                    getBlockCount: () => 0,
                    getBlockParents: () => [],
                    getBlock: () => undefined,
                    getBlocks: () => [],
                };
            }
            if (scope === 'core') {
                return {
                    getPostTypes: () => [{ slug: 'post', name: 'Posts' }],
                };
            }
            return {};
        })
    ),
    useDispatch: jest.fn(() => ({})),
}));

// Mock WordPress dependencies
jest.mock('@wordpress/block-editor', () => ({
    useBlockProps: jest.fn((props) => props),
    InnerBlocks: Object.assign(
        ({ children }: { children?: React.ReactNode }) => <div data-testid="inner-blocks">{children}</div>,
        { ButtonBlockAppender: () => <button data-testid="block-appender">Add Block</button> }
    ),
    InspectorControls: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    BlockControls: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    RichText: ({ value, onChange, tagName: Tag = 'span' }: { value: string; onChange: (value: string) => void; tagName?: string }) => (
        <Tag
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => onChange(e.currentTarget.textContent || '')}
            data-testid="rich-text"
        >
            {value}
        </Tag>
    ),
    ButtonBlockAppender: () => <button data-testid="block-appender">Add Block</button>,
    // The real HOC injects resolved color objects; the block only reads
    // `.slug`/`.color` defensively, so a pass-through is enough here.
    withColors: () => (Component: React.ComponentType<any>) => Component,
    __experimentalLinkControl: ({ value, onChange }: any) => (
        <input
            data-testid="link-control"
            value={value?.url || ''}
            onChange={(e) => onChange({ url: e.target.value })}
        />
    ),
    __experimentalGetBorderClassesAndStyles: () => ({ className: undefined, style: {} }),
    useBlockEditingMode: () => 'visual',
    BlockEdit: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock('@wordpress/components', () => ({
    ExternalLink: () => <span>External</span>,
    SelectControl: ({ label, value, options, onChange }: any) => (
        <label>
            {label}
            <select value={value} onChange={(e) => onChange(e.target.value)} data-testid={`select-${label}`}>
                {options.map((opt: any) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
        </label>
    ),
    TextControl: ({ label, value, onChange }: any) => (
        <label>
            {label}
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                data-testid={`text-${label}`}
            />
        </label>
    ),
    ToggleControl: ({ label, checked, onChange }: any) => (
        <label>
            {label}
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                data-testid={`toggle-${label}`}
            />
        </label>
    ),
    Popover: ({ children }: any) => <div data-testid="popover">{children}</div>,
    ToolbarButton: require('react').forwardRef(
        ({ title, onClick, children }: any, ref: any) => (
            <button ref={ref} type="button" onClick={onClick} data-testid={`toolbar-${title}`}>
                {children ?? title}
            </button>
        )
    ),
    __experimentalToolsPanel: ({ children }: any) => <div data-testid="tools-panel">{children}</div>,
    __experimentalToolsPanelItem: ({ children }: any) => <div data-testid="tools-panel-item">{children}</div>,
}));

describe('AdvancedButton Edit', () => {
    const defaultAttributes = {
        triggerType: 'link',
        buttonType: 'button',
        text: 'Button',
        url: '',
        title: '',
        linkTarget: '',
        rel: '',
        useIconBlocks: false,
        iconPosition: 'left',
        showLabel: true,
    };

    const defaultProps = {
        attributes: defaultAttributes,
        setAttributes: jest.fn(),
        isSelected: true,
        clientId: 'test-client-id',
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render with default attributes', () => {
        render(<Edit {...defaultProps} />);

        expect(screen.getByText('Button')).toBeInTheDocument();
    });

    it('should update text when RichText changes', () => {
        const setAttributes = jest.fn();
        render(<Edit {...defaultProps} setAttributes={setAttributes} />);

        const richText = screen.getByTestId('rich-text');
        fireEvent.blur(richText, { target: { textContent: 'New Button Text' } });

        expect(setAttributes).toHaveBeenCalledWith({ text: 'New Button Text' });
    });

    it('should change triggerType when selected', () => {
        const setAttributes = jest.fn();
        render(<Edit {...defaultProps} setAttributes={setAttributes} />);

        const select = screen.getByTestId('select-Trigger Type') as HTMLSelectElement;
        fireEvent.change(select, { target: { value: 'modal' } });

        expect(setAttributes).toHaveBeenCalledWith({ triggerType: 'modal' });
    });

    it('should render inner blocks when useIconBlocks is true', () => {
        const props = {
            ...defaultProps,
            attributes: {
                ...defaultAttributes,
                useIconBlocks: true,
            },
        };

        render(<Edit {...props} />);

        expect(screen.getByTestId('inner-blocks')).toBeInTheDocument();
    });

    it('should hide label when showLabel is false', () => {
        const props = {
            ...defaultProps,
            attributes: {
                ...defaultAttributes,
                showLabel: false,
            },
        };

        render(<Edit {...props} />);

        // Button text should not be visible
        expect(screen.queryByText('Button')).not.toBeInTheDocument();
    });
});
