import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent } from '@testing-library/react';
import Edit from '../index';
// Mock WordPress dependencies
jest.mock('@wordpress/block-editor', () => ({
    useBlockProps: jest.fn((props) => props),
    InspectorControls: ({ children }) => _jsx("div", { children: children }),
    InnerBlocks: ({ children }) => _jsx("div", { "data-testid": "inner-blocks", children: children }),
    useInnerBlocksProps: jest.fn((props, options) => ({
        ...props,
        ...options,
    })),
}));
jest.mock('@wordpress/components', () => ({
    PanelBody: ({ children }) => _jsx("div", { children: children }),
    CheckboxControl: ({ label, checked, onChange }) => (_jsxs("label", { children: [label, _jsx("input", { type: "checkbox", checked: checked, onChange: (e) => onChange(e.target.checked), "data-testid": `checkbox-${label.toLowerCase().replace(/\s+/g, '-')}` })] })),
    SelectControl: ({ label, value, options, onChange }) => (_jsxs("label", { children: [label, _jsx("select", { value: value, onChange: (e) => onChange(e.target.value), "data-testid": `select-${label.toLowerCase().replace(/\s+/g, '-')}`, children: options.map(opt => (_jsx("option", { value: opt.value, children: opt.label }, opt.value))) })] })),
    RangeControl: ({ label, value, onChange }) => (_jsxs("label", { children: [label, _jsx("input", { type: "range", value: value, onChange: (e) => onChange(parseInt(e.target.value)), "data-testid": `range-${label.toLowerCase().replace(/\s+/g, '-')}` })] })),
    ToggleControl: ({ label, checked, onChange }) => (_jsxs("label", { children: [label, _jsx("input", { type: "checkbox", checked: checked, onChange: (e) => onChange(e.target.checked), "data-testid": `toggle-${label.toLowerCase().replace(/\s+/g, '-')}` })] })),
    TextControl: ({ label, value, onChange }) => (_jsxs("label", { children: [label, _jsx("input", { type: "text", value: value, onChange: (e) => onChange(e.target.value), "data-testid": `text-${label.toLowerCase().replace(/\s+/g, '-')}` })] })),
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
        networks: ['facebook', 'twitter'],
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
        render(_jsx(Edit, { ...defaultProps }));
        expect(screen.getByTestId('inner-blocks')).toBeInTheDocument();
    });
    it('should toggle network when checkbox clicked', () => {
        const setAttributes = jest.fn();
        render(_jsx(Edit, { ...defaultProps, setAttributes: setAttributes }));
        const checkbox = screen.getByTestId('checkbox-facebook');
        fireEvent.change(checkbox, { target: { checked: false } });
        expect(setAttributes).toHaveBeenCalled();
    });
    it('should update iconSize when changed', () => {
        const setAttributes = jest.fn();
        render(_jsx(Edit, { ...defaultProps, setAttributes: setAttributes }));
        const range = screen.getByTestId('range-icon-size');
        fireEvent.change(range, { target: { value: '32' } });
        expect(setAttributes).toHaveBeenCalledWith({ iconSize: 32 });
    });
    it('should toggle showLabels', () => {
        const setAttributes = jest.fn();
        render(_jsx(Edit, { ...defaultProps, setAttributes: setAttributes }));
        const toggle = screen.getByTestId('toggle-show-labels');
        fireEvent.change(toggle, { target: { checked: false } });
        expect(setAttributes).toHaveBeenCalledWith({ showLabels: false });
    });
    it('should update style when changed', () => {
        const setAttributes = jest.fn();
        render(_jsx(Edit, { ...defaultProps, setAttributes: setAttributes }));
        const select = screen.getByTestId('select-style');
        fireEvent.change(select, { target: { value: 'rounded' } });
        expect(setAttributes).toHaveBeenCalledWith({ style: 'rounded' });
    });
    it('should update alignment when changed', () => {
        const setAttributes = jest.fn();
        render(_jsx(Edit, { ...defaultProps, setAttributes: setAttributes }));
        const select = screen.getByTestId('select-alignment');
        fireEvent.change(select, { target: { value: 'center' } });
        expect(setAttributes).toHaveBeenCalledWith({ alignment: 'center' });
    });
});
