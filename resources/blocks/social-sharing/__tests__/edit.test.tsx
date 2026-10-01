/**
 * @jest-environment jsdom
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Edit } from '../index';

// Mock WordPress dependencies
jest.mock('@wordpress/block-editor', () => ({
    // `Save` uses `useBlockProps.save`, so the mock needs both shapes.
    useBlockProps: Object.assign(jest.fn((props) => props), {
        save: jest.fn((props) => props),
    }),
    InspectorControls: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
    // `InnerBlocks.Content` is a static on the component; without it React gets
    // `undefined` as the element type and throws "Element type is invalid".
    InnerBlocks: Object.assign(
        jest.fn(({ children }: { children?: React.ReactNode }) => (
            <div data-testid="inner-blocks">{children}</div>
        )),
        { Content: jest.fn(() => <div data-testid="inner-blocks-content" />) }
    ),
    // `Edit` renders a plain div from `useInnerBlocksProps` props, so only the
    // first argument is returned; spreading the options too would leak
    // `allowedBlocks`/`template` onto the DOM node.
    useInnerBlocksProps: jest.fn((props) => props),
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
        iconSize: 'medium',
        showLabels: true,
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

        // The networks container comes from `useInnerBlocksProps`.
        expect(document.querySelector('.sharing-buttons')).toBeInTheDocument();
        expect(screen.getByTestId('checkbox-facebook')).toBeChecked();
        expect(screen.getByTestId('checkbox-twitter/x')).toBeChecked();
    });

    it('should toggle network when checkbox clicked', () => {
        const setAttributes = jest.fn();
        render(<Edit {...defaultProps} setAttributes={setAttributes} />);

        const checkbox = screen.getByTestId('checkbox-facebook') as HTMLInputElement;
        // React normalises checkbox updates through click, not change.
        fireEvent.click(checkbox);

        expect(setAttributes).toHaveBeenCalled();
    });

    it('should update iconSize when changed', () => {
        const setAttributes = jest.fn();
        render(<Edit {...defaultProps} setAttributes={setAttributes} />);

        // `iconSize` is a SelectControl with small/medium/large, not a range.
        const select = screen.getByTestId('select-kích-thước-icon') as HTMLSelectElement;
        fireEvent.change(select, { target: { value: 'large' } });

        expect(setAttributes).toHaveBeenCalledWith({ iconSize: 'large' });
    });

    it('should toggle showLabels', () => {
        const setAttributes = jest.fn();
        render(<Edit {...defaultProps} setAttributes={setAttributes} />);

        const toggle = screen.getByTestId('toggle-hiển-thị-nhãn') as HTMLInputElement;
        // React normalises checkbox updates through click, not change.
        fireEvent.click(toggle);

        expect(setAttributes).toHaveBeenCalledWith({ showLabels: false });
    });

    it('should toggle showHeading', () => {
        const setAttributes = jest.fn();
        render(<Edit {...defaultProps} setAttributes={setAttributes} />);

        const toggle = screen.getByTestId('toggle-hiển-thị-tiêu-đề') as HTMLInputElement;
        // React normalises checkbox updates through click, not change.
        fireEvent.click(toggle);

        expect(setAttributes).toHaveBeenCalledWith({ showHeading: true });
    });

    it('should update alignment when changed', () => {
        const setAttributes = jest.fn();
        render(<Edit {...defaultProps} setAttributes={setAttributes} />);

        const select = screen.getByTestId('select-căn-chỉnh') as HTMLSelectElement;
        fireEvent.change(select, { target: { value: 'center' } });

        expect(setAttributes).toHaveBeenCalledWith({ alignment: 'center' });
    });
});
