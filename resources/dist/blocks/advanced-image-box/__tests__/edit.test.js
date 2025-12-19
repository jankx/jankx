import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent } from '@testing-library/react';
import Edit from '../edit';
// Mock WordPress dependencies
jest.mock('@wordpress/block-editor', () => ({
    useBlockProps: jest.fn((props) => props),
    InspectorControls: ({ children }) => _jsx("div", { children: children }),
    BlockControls: ({ children }) => _jsx("div", { children: children }),
    MediaReplaceFlow: () => _jsx("button", { "data-testid": "media-replace", children: "Replace" }),
    RichText: ({ value, onChange, tagName: Tag = 'span' }) => (_jsx(Tag, { contentEditable: true, suppressContentEditableWarning: true, onBlur: (e) => onChange(e.currentTarget.textContent || ''), "data-testid": "rich-text", children: value })),
    InnerBlocks: () => _jsx("div", { "data-testid": "inner-blocks", children: "Inner Blocks" }),
    __experimentalUseBorderProps: jest.fn(() => ({ className: '', style: {} })),
    __experimentalGetShadowClassesAndStyles: jest.fn(() => ({ className: '', style: {} })),
    useBlockEditingMode: jest.fn(() => 'default'),
    store: {
        getSettings: jest.fn(),
        getBlockRootClientId: jest.fn(),
    },
}));
jest.mock('@wordpress/components', () => ({
    PanelBody: ({ children }) => _jsx("div", { children: children }),
    SelectControl: ({ label, value, options, onChange, }) => (_jsxs("label", { children: [label, _jsx("select", { value: value, onChange: (e) => onChange(e.target.value), "data-testid": `select-${label}`, children: options.map((opt) => (_jsx("option", { value: opt.value, children: opt.label }, opt.value))) })] })),
    RangeControl: ({ label, value, onChange, }) => (_jsxs("label", { children: [label, _jsx("input", { type: "range", value: value, onChange: (e) => onChange(parseInt(e.target.value)), "data-testid": `range-${label}` })] })),
    ToggleControl: ({ label, checked, onChange, }) => (_jsxs("label", { children: [label, _jsx("input", { type: "checkbox", checked: checked, onChange: (e) => onChange(e.target.checked), "data-testid": `toggle-${label}` })] })),
    ColorPicker: () => _jsx("div", { "data-testid": "color-picker", children: "Color Picker" }),
    ColorPalette: () => _jsx("div", { "data-testid": "color-palette", children: "Color Palette" }),
    Notice: ({ children }) => _jsx("div", { children: children }),
    Button: ({ children, onClick }) => _jsx("button", { onClick: onClick, children: children }),
    ToolbarGroup: ({ children }) => _jsx("div", { children: children }),
    ToolbarButton: ({ children }) => _jsx("button", { children: children }),
    __experimentalToolsPanel: ({ children }) => _jsx("div", { children: children }),
    __experimentalToolsPanelItem: ({ children }) => _jsx("div", { children: children }),
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
        render(_jsx(Edit, { ...defaultProps }));
        expect(screen.getByTestId('media-replace')).toBeInTheDocument();
    });
    it('should show remove image button when image set and call setAttributes on click', () => {
        const setAttributes = jest.fn();
        const propsWithImage = { ...defaultProps, attributes: { ...defaultAttributes, url: 'https://example.com/image.jpg', id: 123 } };
        render(_jsx(Edit, { ...propsWithImage, setAttributes: setAttributes }));
        // Remove image button should be in the inspector area and clickable
        const removeButton = screen.getByText('Remove image');
        expect(removeButton).toBeInTheDocument();
        removeButton && fireEvent.click(removeButton);
        expect(setAttributes).toHaveBeenCalledWith({ url: undefined, id: undefined, alt: undefined, title: undefined });
    });
    it('should toggle showOverlayOnHover', () => {
        const setAttributes = jest.fn();
        render(_jsx(Edit, { ...defaultProps, setAttributes: setAttributes }));
        const toggle = screen.getByTestId('toggle-Show Overlay on Hover');
        fireEvent.change(toggle, { target: { checked: true } });
        expect(setAttributes).toHaveBeenCalledWith({ showOverlayOnHover: true });
    });
    it('should display alt text in placeholder when no image is set', () => {
        const setAttributes = jest.fn();
        const propsWithAlt = { ...defaultProps, attributes: { ...defaultAttributes, alt: 'Sample alt text', url: '' } };
        render(_jsx(Edit, { ...propsWithAlt, setAttributes: setAttributes }));
        expect(screen.getByText('Sample alt text')).toBeInTheDocument();
    });
    it('placeholder should not have inline background or minHeight when no image', () => {
        const setAttributes = jest.fn();
        const { container } = render(_jsx(Edit, { ...defaultProps, setAttributes: setAttributes }));
        const placeholder = container.querySelector('.wp-block-jankx-advanced-image-box__placeholder');
        expect(placeholder).toBeInTheDocument();
        expect(placeholder.style.backgroundColor).toBe('');
        expect(placeholder.style.minHeight).toBe('');
    });
    it('should persist preset color option when opacity changed', () => {
        // Mock window presets
        window.jankxAdvancedImageBoxPresets = {
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
            attributes: { ...defaultAttributes, preset: 'bordered-frame', presetOptions: {} }
        };
        render(_jsx(Edit, { ...propsWithPreset, setAttributes: setAttributes }));
        // Opacity RangeControl is rendered with label 'Opacity' inside the color control
        const opacityRange = screen.getByTestId('range-Opacity');
        // Change to 0 (parseInt in mock will convert '0' correctly)
        fireEvent.change(opacityRange, { target: { value: '0' } });
        // Expect setAttributes called with combined rgba value for titleBackground
        expect(setAttributes).toHaveBeenCalledWith({ presetOptions: { titleBackground: 'rgba(255, 0, 0, 0)' } });
    });
    it('should update overlayAnimation when changed', () => {
        const setAttributes = jest.fn();
        render(_jsx(Edit, { ...defaultProps, setAttributes: setAttributes }));
        const select = screen.getByTestId('select-Overlay Animation');
        fireEvent.change(select, { target: { value: 'slideUp' } });
        expect(setAttributes).toHaveBeenCalledWith({ overlayAnimation: 'slideUp' });
    });
    it('should update overlayPosition when changed', () => {
        const setAttributes = jest.fn();
        render(_jsx(Edit, { ...defaultProps, setAttributes: setAttributes }));
        const select = screen.getByTestId('select-Overlay Position');
        fireEvent.change(select, { target: { value: 'top' } });
        expect(setAttributes).toHaveBeenCalledWith({ overlayPosition: 'top' });
    });
    it('should update imageHoverEffect when changed', () => {
        const setAttributes = jest.fn();
        render(_jsx(Edit, { ...defaultProps, setAttributes: setAttributes }));
        const select = screen.getByTestId('select-Image Hover Effect');
        fireEvent.change(select, { target: { value: 'zoom' } });
        expect(setAttributes).toHaveBeenCalledWith({ imageHoverEffect: 'zoom' });
    });
});
