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
    InnerBlocks: () => _jsx("div", { "data-testid": "inner-blocks", children: "Inner Blocks" }),
    BlockControls: ({ children }) => _jsx("div", { children: children }),
    useInnerBlocksProps: jest.fn((props, options) => ({
        ...props,
        ...options,
    })),
    __experimentalUseBorderProps: jest.fn(() => ({ className: '', style: {} })),
    __experimentalUseColorProps: jest.fn(() => ({ className: '', style: {} })),
}));
jest.mock('@wordpress/components', () => ({
    PanelBody: ({ children }) => _jsx("div", { children: children }),
    ToggleControl: ({ label, checked, onChange }) => (_jsxs("label", { children: [label, _jsx("input", { type: "checkbox", checked: checked, onChange: (e) => onChange(e.target.checked), "data-testid": `toggle-${label.toLowerCase().replace(/\s+/g, '-')}` })] })),
    ToolbarGroup: ({ children }) => _jsx("div", { children: children }),
    ToolbarButton: ({ children }) => _jsx("button", { children: children }),
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
        render(_jsx(Edit, { ...defaultProps }));
        expect(screen.getByTestId('inner-blocks')).toBeInTheDocument();
    });
    it('should toggle hasFixedLayout', () => {
        const setAttributes = jest.fn();
        render(_jsx(Edit, { ...defaultProps, setAttributes: setAttributes }));
        const toggle = screen.getByTestId('toggle-fixed-table-layout');
        fireEvent.change(toggle, { target: { checked: true } });
        expect(setAttributes).toHaveBeenCalledWith({ hasFixedLayout: true });
    });
    it('should toggle hasHeaderRow', () => {
        const setAttributes = jest.fn();
        render(_jsx(Edit, { ...defaultProps, setAttributes: setAttributes }));
        const toggle = screen.getByTestId('toggle-header-row');
        fireEvent.change(toggle, { target: { checked: true } });
        expect(setAttributes).toHaveBeenCalledWith({ hasHeaderRow: true });
    });
    it('should toggle hasFooterRow', () => {
        const setAttributes = jest.fn();
        render(_jsx(Edit, { ...defaultProps, setAttributes: setAttributes }));
        const toggle = screen.getByTestId('toggle-footer-row');
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
        render(_jsx(Edit, { ...props }));
        // Check that the wrapper has the correct class
        const wrapper = document.querySelector('.has-fixed-layout');
        expect(wrapper).toBeTruthy();
    });
});
