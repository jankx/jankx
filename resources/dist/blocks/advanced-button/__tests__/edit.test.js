import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent } from '@testing-library/react';
import Edit from '../edit';
// Mock WordPress dependencies
jest.mock('@wordpress/block-editor', () => ({
    useBlockProps: jest.fn((props) => props),
    InnerBlocks: ({ children }) => _jsx("div", { "data-testid": "inner-blocks", children: children }),
    InspectorControls: ({ children }) => _jsx("div", { children: children }),
    BlockControls: ({ children }) => _jsx("div", { children: children }),
    RichText: ({ value, onChange, tagName: Tag = 'span' }) => (_jsx(Tag, { contentEditable: true, suppressContentEditableWarning: true, onBlur: (e) => onChange(e.currentTarget.textContent || ''), "data-testid": "rich-text", children: value })),
    ButtonBlockAppender: () => _jsx("button", { "data-testid": "block-appender", children: "Add Block" }),
}));
jest.mock('@wordpress/components', () => ({
    ExternalLink: () => _jsx("span", { children: "External" }),
    SelectControl: ({ label, value, options, onChange }) => (_jsxs("label", { children: [label, _jsx("select", { value: value, onChange: (e) => onChange(e.target.value), "data-testid": `select-${label}`, children: options.map((opt) => (_jsx("option", { value: opt.value, children: opt.label }, opt.value))) })] })),
    TextControl: ({ label, value, onChange }) => (_jsxs("label", { children: [label, _jsx("input", { type: "text", value: value, onChange: (e) => onChange(e.target.value), "data-testid": `text-${label}` })] })),
    ToggleControl: ({ label, checked, onChange }) => (_jsxs("label", { children: [label, _jsx("input", { type: "checkbox", checked: checked, onChange: (e) => onChange(e.target.checked), "data-testid": `toggle-${label}` })] })),
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
        render(_jsx(Edit, { ...defaultProps }));
        expect(screen.getByText('Button')).toBeInTheDocument();
    });
    it('should update text when RichText changes', () => {
        const setAttributes = jest.fn();
        render(_jsx(Edit, { ...defaultProps, setAttributes: setAttributes }));
        const richText = screen.getByTestId('rich-text');
        fireEvent.blur(richText, { target: { textContent: 'New Button Text' } });
        expect(setAttributes).toHaveBeenCalledWith({ text: 'New Button Text' });
    });
    it('should change triggerType when selected', () => {
        const setAttributes = jest.fn();
        render(_jsx(Edit, { ...defaultProps, setAttributes: setAttributes }));
        const select = screen.getByTestId('select-Trigger Type');
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
        render(_jsx(Edit, { ...props }));
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
        render(_jsx(Edit, { ...props }));
        // Button text should not be visible
        expect(screen.queryByText('Button')).not.toBeInTheDocument();
    });
});
