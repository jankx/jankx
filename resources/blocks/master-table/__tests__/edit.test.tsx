/**
 * @jest-environment jsdom
 */

import { render, screen, fireEvent } from '@testing-library/react';
import Edit from '../edit';

// Mock WordPress dependencies
jest.mock('@wordpress/block-editor', () => ({
    useBlockProps: jest.fn((props) => props),
    InspectorControls: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    InnerBlocks: () => <div data-testid="inner-blocks">Inner Blocks</div>,
    BlockControls: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    useInnerBlocksProps: jest.fn((props, options) => ({
        ...props,
        ...options,
    })),
    __experimentalUseBorderProps: jest.fn(() => ({ className: '', style: {} })),
    __experimentalUseColorProps: jest.fn(() => ({ className: '', style: {} })),
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
    ToolbarGroup: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    ToolbarButton: ({ children }: { children: React.ReactNode }) => <button>{children}</button>,
}));

describe('MasterTable Edit', () => {
    const defaultAttributes = {
        hasFixedLayout: false,
        hasHeaderRow: false,
        hasFooterRow: false,
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

        expect(screen.getByTestId('inner-blocks')).toBeInTheDocument();
    });

    it('should toggle hasFixedLayout', () => {
        const setAttributes = jest.fn();
        render(<Edit {...defaultProps} setAttributes={setAttributes} />);

        const toggle = screen.getByTestId('toggle-fixed-table-layout') as HTMLInputElement;
        fireEvent.change(toggle, { target: { checked: true } });

        expect(setAttributes).toHaveBeenCalledWith({ hasFixedLayout: true });
    });

    it('should toggle hasHeaderRow', () => {
        const setAttributes = jest.fn();
        render(<Edit {...defaultProps} setAttributes={setAttributes} />);

        const toggle = screen.getByTestId('toggle-header-row') as HTMLInputElement;
        fireEvent.change(toggle, { target: { checked: true } });

        expect(setAttributes).toHaveBeenCalledWith({ hasHeaderRow: true });
    });

    it('should toggle hasFooterRow', () => {
        const setAttributes = jest.fn();
        render(<Edit {...defaultProps} setAttributes={setAttributes} />);

        const toggle = screen.getByTestId('toggle-footer-row') as HTMLInputElement;
        fireEvent.change(toggle, { target: { checked: true } });

        expect(setAttributes).toHaveBeenCalledWith({ hasFooterRow: true });
    });

    it('should apply fixed layout class when enabled', () => {
        const props = {
            ...defaultProps,
            attributes: {
                ...defaultAttributes,
                hasFixedLayout: true,
            },
        };

        render(<Edit {...props} />);

        // Check that the wrapper has the correct class
        const wrapper = document.querySelector('.has-fixed-layout');
        expect(wrapper).toBeTruthy();
    });
});
