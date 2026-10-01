/**
 * @jest-environment jsdom
 */

import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Edit from '../edit';

// Mock WordPress dependencies
jest.mock('@wordpress/block-editor', () => ({
    useBlockProps: jest.fn((props) => props),
    InspectorControls: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    BlockControls: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    MediaReplaceFlow: () => <button data-testid="media-replace">Replace</button>,
    RichText: Object.assign(
        ({ value, onChange, tagName: Tag = 'span' }: { value: string; onChange: (value: string) => void; tagName?: string }) => (
            <Tag
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => onChange(e.currentTarget.textContent || '')}
                data-testid="rich-text"
            >
                {value}
            </Tag>
        ),
        // Mirrors the real helper: whitespace-only content counts as empty.
        { isEmpty: (value?: string) => !value || !value.replace(/<[^>]*>/g, '').trim() }
    ),
    InnerBlocks: () => <div data-testid="inner-blocks">Inner Blocks</div>,
    __experimentalUseBorderProps: jest.fn(() => ({ className: '', style: {} })),
    __experimentalGetShadowClassesAndStyles: jest.fn(() => ({ className: '', style: {} })),
    __experimentalLinkControl: ({ value, onChange }: any) => (
        <input
            data-testid="link-control"
            value={value?.url || ''}
            onChange={(e) => onChange({ url: e.target.value })}
        />
    ),
    useBlockEditingMode: jest.fn(() => 'default'),
    store: {
        getSettings: jest.fn(),
        getBlockRootClientId: jest.fn(),
    },
}));

jest.mock('@wordpress/components', () => ({
    PanelBody: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    SelectControl: ({
        label,
        value,
        options,
        onChange,
    }: {
        label: string;
        value: string | number;
        options: Array<{ label: string; value: string | number }>;
        onChange: (value: string | number) => void;
    }) => (
        <label>
            {label}
            <select value={value} onChange={(e) => onChange(e.target.value)} data-testid={`select-${label}`}>
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
        </label>
    ),
    RangeControl: ({
        label,
        value,
        onChange,
    }: {
        label: string;
        value: number;
        onChange: (value: number) => void;
    }) => (
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
    ToggleControl: ({
        label,
        checked,
        onChange,
    }: {
        label: string;
        checked: boolean;
        onChange: (value: boolean) => void;
    }) => (
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
    ColorPalette: () => <div data-testid="color-palette">Color Palette</div>,
    Notice: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Button: ({ children, onClick }: { children: React.ReactNode; onClick: () => void }) => <button onClick={onClick}>{children}</button>,
    ToolbarGroup: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
    ToolbarButton: require('react').forwardRef(
        ({ children, onClick }: any, ref: any) => (
            <button ref={ref} type="button" onClick={onClick}>{children}</button>
        )
    ),
    TextControl: ({ label, value, onChange }: any) => (
        <label>
            {label}
            <input
                type="text"
                value={value ?? ''}
                onChange={(e) => onChange(e.target.value)}
                data-testid={`text-${label}`}
            />
        </label>
    ),
    Popover: ({ children }: { children?: React.ReactNode }) => <div data-testid="popover">{children}</div>,
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

        // The editor renders the flow in the toolbar and in both inspector
        // panels, so more than one instance is expected.
        expect(screen.getAllByTestId('media-replace').length).toBeGreaterThan(0);
    });

    it('should show remove image button when image set and call setAttributes on click', () => {
        const setAttributes = jest.fn();
        const propsWithImage = { ...defaultProps, attributes: { ...defaultAttributes, url: 'https://example.com/image.jpg', id: 123 } };
        render(<Edit {...propsWithImage} setAttributes={setAttributes} />);

        // Remove image button should be in the inspector area and clickable
        const removeButton = screen.getByText('Remove image');
        expect(removeButton).toBeInTheDocument();

        removeButton && fireEvent.click(removeButton);
        expect(setAttributes).toHaveBeenCalledWith({ url: undefined, id: undefined, alt: undefined, title: undefined });
    });

    it('should toggle showOverlayOnHover', () => {
        const setAttributes = jest.fn();
        render(<Edit {...defaultProps} setAttributes={setAttributes} />);

        const toggle = screen.getByTestId('toggle-Show overlay on hover') as HTMLInputElement;
        // React normalises checkbox updates through click, not change.
        fireEvent.click(toggle);

        expect(setAttributes).toHaveBeenCalledWith({ showOverlayOnHover: true });
    });

    it('should display alt text in placeholder when no image is set', () => {
        const setAttributes = jest.fn();
        const propsWithAlt = { ...defaultProps, attributes: { ...defaultAttributes, alt: 'Sample alt text', url: '' } };
        render(<Edit {...propsWithAlt} setAttributes={setAttributes} />);

        // The alt text is echoed both in the preview overlay and the
        // placeholder, so match every occurrence.
        expect(screen.getAllByText('Sample alt text').length).toBeGreaterThan(0);
    });

    it('placeholder should not have inline background or minHeight when no image', () => {
        const setAttributes = jest.fn();
        const { container } = render(<Edit {...defaultProps} setAttributes={setAttributes} />);

        const placeholder = container.querySelector('.wp-block-jankx-advanced-image-box__placeholder') as HTMLElement;
        expect(placeholder).toBeInTheDocument();
        expect(placeholder.style.backgroundColor).toBe('');
        expect(placeholder.style.minHeight).toBe('');
    });

    it('should update overlayOpacity without rewriting preset colors', () => {
        // Mock window presets
        (window as any).jankxAdvancedImageBoxPresets = {
            'bordered-frame': {
                id: 'bordered-frame',
                label: 'Bordered Frame',
                options: [
                    { name: 'titleBackground', type: 'color', default: '#ff0000', label: 'Title Background' }
                ]
            }
        };

        const setAttributes = jest.fn();
        const propsWithPreset = {
            ...defaultProps,
            attributes: {
                ...defaultAttributes,
                preset: 'bordered-frame',
                presetOptions: {},
                showOverlayOnHover: true,
            }
        };

        render(<Edit {...propsWithPreset} setAttributes={setAttributes} />);

        const opacityRange = screen.getByTestId('range-Overlay Opacity') as HTMLInputElement;
        fireEvent.change(opacityRange, { target: { value: '0' } });

        // `overlayOpacity` is a standalone attribute applied to the overlay
        // style at render time; changing it must not bake the opacity into
        // the preset colours in the same update.
        expect(setAttributes).toHaveBeenCalledWith({ overlayOpacity: 0 });
        setAttributes.mock.calls.forEach(([update]: [Record<string, unknown>]) => {
            expect(
                'overlayOpacity' in update && 'presetOptions' in update
            ).toBe(false);
        });
    });

    it('should update overlayAnimation when changed', () => {
        const setAttributes = jest.fn();
        // The overlay controls only render once the overlay is enabled.
        const propsWithOverlay = {
            ...defaultProps,
            attributes: { ...defaultAttributes, showOverlayOnHover: true },
        };
        render(<Edit {...propsWithOverlay} setAttributes={setAttributes} />);

        const select = screen.getByTestId('select-Animation') as HTMLSelectElement;
        fireEvent.change(select, { target: { value: 'slideInUp' } });

        expect(setAttributes).toHaveBeenCalledWith({ overlayAnimation: 'slideInUp' });
    });

    it('should update overlayPosition when changed', () => {
        const setAttributes = jest.fn();
        const propsWithOverlay = {
            ...defaultProps,
            attributes: { ...defaultAttributes, showOverlayOnHover: true },
        };
        render(<Edit {...propsWithOverlay} setAttributes={setAttributes} />);

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
