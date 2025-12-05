/**
 * @jest-environment jsdom
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Edit from '../index';

// Mock WordPress dependencies
jest.mock('@wordpress/block-editor', () => ({
    useBlockProps: jest.fn((props) => props),
    InspectorControls: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    InnerBlocks: ({ children }: { children?: React.ReactNode }) => <div data-testid="inner-blocks">{children}</div>,
    useInnerBlocksProps: jest.fn((props, options) => ({
        ...props,
        ...options,
    })),
}));

jest.mock('@wordpress/components', () => ({
    PanelBody: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    CheckboxControl: ({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) => (
        <label>
            {label}
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                data-testid={`checkbox-${label.toLowerCase().replace(/\s+/g, '-')}`}
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
    RangeControl: ({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) => (
        <label>
            {label}
            <input
                type="range"
                value={value}
                onChange={(e) => onChange(parseInt(e.target.value))}
                data-testid={`range-${label.toLowerCase().replace(/\s+/g, '-')}`}
            />
        </label>
    ),
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
}));

jest.mock('@wordpress/data', () => ({
    useDispatch: jest.fn(() => ({
        replaceInnerBlocks: jest.fn(),
    })),
    useSelect: jest.fn(() => []),
}));

jest.mock('@wordpress/blocks', () => ({
    registerBlockType: jest.fn(),
    createBlock: jest.fn((name, attrs) => ({
        name,
        attributes: attrs,
    })),
}));

describe('SocialSharing Edit', () => {
    const defaultAttributes = {
        networks: ['facebook', 'twitter'] as string[],
        iconSize: 24,
        showLabels: true,
        style: 'default',
        alignment: 'left',
        showHeading: false,
        headingText: '',
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

    it('should toggle network when checkbox clicked', () => {
        const setAttributes = jest.fn();
        render(<Edit {...defaultProps} setAttributes={setAttributes} />);

        const checkbox = screen.getByTestId('checkbox-facebook') as HTMLInputElement;
        fireEvent.change(checkbox, { target: { checked: false } });

        expect(setAttributes).toHaveBeenCalled();
    });

    it('should update iconSize when changed', () => {
        const setAttributes = jest.fn();
        render(<Edit {...defaultProps} setAttributes={setAttributes} />);

        const range = screen.getByTestId('range-icon-size') as HTMLInputElement;
        fireEvent.change(range, { target: { value: '32' } });

        expect(setAttributes).toHaveBeenCalledWith({ iconSize: 32 });
    });

    it('should toggle showLabels', () => {
        const setAttributes = jest.fn();
        render(<Edit {...defaultProps} setAttributes={setAttributes} />);

        const toggle = screen.getByTestId('toggle-show-labels') as HTMLInputElement;
        fireEvent.change(toggle, { target: { checked: false } });

        expect(setAttributes).toHaveBeenCalledWith({ showLabels: false });
    });

    it('should update style when changed', () => {
        const setAttributes = jest.fn();
        render(<Edit {...defaultProps} setAttributes={setAttributes} />);

        const select = screen.getByTestId('select-style') as HTMLSelectElement;
        fireEvent.change(select, { target: { value: 'rounded' } });

        expect(setAttributes).toHaveBeenCalledWith({ style: 'rounded' });
    });

    it('should update alignment when changed', () => {
        const setAttributes = jest.fn();
        render(<Edit {...defaultProps} setAttributes={setAttributes} />);

        const select = screen.getByTestId('select-alignment') as HTMLSelectElement;
        fireEvent.change(select, { target: { value: 'center' } });

        expect(setAttributes).toHaveBeenCalledWith({ alignment: 'center' });
    });
});
