/**
 * @jest-environment jsdom
 */

import { render, screen, fireEvent } from '@testing-library/react';
import Edit from '../edit';

// Mock WordPress dependencies
jest.mock('@wordpress/block-editor', () => ({
    useBlockProps: jest.fn((props) => props),
    InspectorControls: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    BlockControls: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    MediaReplaceFlow: () => <button data-testid="media-replace">Replace</button>,
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
    InnerBlocks: () => <div data-testid="inner-blocks">Inner Blocks</div>,
    __experimentalUseBorderProps: jest.fn(() => ({ className: '', style: {} })),
    __experimentalGetShadowClassesAndStyles: jest.fn(() => ({ className: '', style: {} })),
    useBlockEditingMode: jest.fn(() => 'default'),
    store: {
        getSettings: jest.fn(),
        getBlockRootClientId: jest.fn(),
    },
}));

jest.mock('@wordpress/components', () => ({
    PanelBody: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
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
    RangeControl: ({ label, value, onChange }: any) => (
        <label>
            {label}
            <input
                type="range"
                value={value}
                onChange={(e) => onChange(parseInt(e.target.value))}
                data-testid={`range-${label}`}
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
    ColorPicker: () => <div data-testid="color-picker">Color Picker</div>,
    Notice: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Button: ({ children, onClick }: any) => <button onClick={onClick}>{children}</button>,
    ToolbarGroup: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    ToolbarButton: ({ children }: { children: React.ReactNode }) => <button>{children}</button>,
    __experimentalToolsPanel: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    __experimentalToolsPanelItem: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock('@wordpress/data', () => ({
    useSelect: jest.fn(() => ({
        getBlocks: jest.fn(() => []),
        getSettings: jest.fn(() => ({})),
        getBlockRootClientId: jest.fn(() => null),
    })),
    useDispatch: jest.fn(() => ({
        createErrorNotice: jest.fn(),
    })),
}));

jest.mock('@wordpress/blob', () => ({
    isBlobURL: jest.fn(() => false),
}));

describe('AdvancedImageBox Edit', () => {
    const defaultAttributes = {
        url: '',
        alt: '',
        title: '',
        id: 0,
        width: '',
        height: '',
        aspectRatio: '',
        scale: '',
        href: '',
        linkTarget: '',
        rel: '',
        caption: '',
        showOverlayOnHover: false,
        overlayAnimation: 'fadeIn',
        overlayAnimationDuration: 1000,
        overlayAnimationDelay: 0,
        overlayPosition: 'bottom',
        overlayBackground: 'rgba(0,0,0,0.5)',
        overlayOpacity: 1,
        imageHoverEffect: 'none',
        borderRadius: '0px',
    };

    const defaultProps = {
        attributes: defaultAttributes,
        setAttributes: jest.fn(),
        isSelected: true,
        className: '',
        clientId: 'test-client-id',
        context: {},
        onReplace: jest.fn(),
        insertBlocksAfter: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render with default attributes', () => {
        render(<Edit {...defaultProps} />);

        expect(screen.getByTestId('media-replace')).toBeInTheDocument();
    });

    it('should toggle showOverlayOnHover', () => {
        const setAttributes = jest.fn();
        render(<Edit {...defaultProps} setAttributes={setAttributes} />);

        const toggle = screen.getByTestId('toggle-Show Overlay on Hover') as HTMLInputElement;
        fireEvent.change(toggle, { target: { checked: true } });

        expect(setAttributes).toHaveBeenCalledWith({ showOverlayOnHover: true });
    });

    it('should update overlayAnimation when changed', () => {
        const setAttributes = jest.fn();
        render(<Edit {...defaultProps} setAttributes={setAttributes} />);

        const select = screen.getByTestId('select-Overlay Animation') as HTMLSelectElement;
        fireEvent.change(select, { target: { value: 'slideUp' } });

        expect(setAttributes).toHaveBeenCalledWith({ overlayAnimation: 'slideUp' });
    });

    it('should update overlayPosition when changed', () => {
        const setAttributes = jest.fn();
        render(<Edit {...defaultProps} setAttributes={setAttributes} />);

        const select = screen.getByTestId('select-Overlay Position') as HTMLSelectElement;
        fireEvent.change(select, { target: { value: 'top' } });

        expect(setAttributes).toHaveBeenCalledWith({ overlayPosition: 'top' });
    });

    it('should update imageHoverEffect when changed', () => {
        const setAttributes = jest.fn();
        render(<Edit {...defaultProps} setAttributes={setAttributes} />);

        const select = screen.getByTestId('select-Image Hover Effect') as HTMLSelectElement;
        fireEvent.change(select, { target: { value: 'zoom' } });

        expect(setAttributes).toHaveBeenCalledWith({ imageHoverEffect: 'zoom' });
    });
});
