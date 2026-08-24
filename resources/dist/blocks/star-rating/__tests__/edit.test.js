import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Edit from '../edit';
// Mock WordPress dependencies
jest.mock('@wordpress/element', () => {
    const React = require('react');
    return {
        ...React,
        useState: React.useState,
        useEffect: React.useEffect,
        useCallback: React.useCallback,
        useMemo: React.useMemo,
        useRef: React.useRef,
        Fragment: React.Fragment,
    };
});
jest.mock('@wordpress/block-editor', () => ({
    useBlockProps: jest.fn((props) => props),
    InspectorControls: ({ children }) => _jsx("div", { children: children }),
}));
jest.mock('@wordpress/i18n', () => ({
    __: (text) => text,
}));
jest.mock('@wordpress/components', () => ({
    PanelBody: ({ title, children }) => _jsxs("div", { children: [_jsx("h2", { children: title }), children] }),
    SelectControl: ({ label, value, options, onChange }) => (_jsxs("label", { children: [label, _jsx("select", { value: value, onChange: (e) => onChange(e.target.value), "data-testid": `select-${label}`, children: options.map((opt) => (_jsx("option", { value: opt.value, children: opt.label }, opt.value))) })] })),
    RangeControl: ({ label, value, onChange }) => (_jsxs("label", { children: [label, _jsx("input", { type: "number", value: value, onChange: (e) => onChange(parseInt(e.target.value)), "data-testid": `range-${label}` })] })),
    TextControl: ({ label, value, onChange }) => (_jsxs("label", { children: [label, _jsx("input", { type: "text", value: value, onChange: (e) => onChange(e.target.value), "data-testid": `text-${label}` })] })),
    ColorPalette: ({ value, onChange }) => (_jsxs("div", { "data-testid": "color-palette", children: [_jsx("button", { onClick: () => onChange('#ff0000'), children: "Red" }), _jsx("button", { onClick: () => onChange('#00ff00'), children: "Green" })] })),
    ToggleControl: ({ label, checked, onChange }) => (_jsxs("label", { children: [label, _jsx("input", { type: "checkbox", checked: checked, onChange: (e) => onChange(e.target.checked), "data-testid": `toggle-${label}` })] })),
    TextareaControl: ({ label, value, onChange }) => (_jsxs("label", { children: [label, _jsx("textarea", { value: value, onChange: (e) => onChange(e.target.value), "data-testid": `textarea-${label}` })] })),
}));
describe('StarRating Edit', () => {
    const defaultAttributes = {
        ratingSource: 'manual',
        manualRating: 5,
        metaKey: 'rating_score',
        crawlerTable: '',
        starSize: 16,
        starColor: '#f1c40f',
        starEmptyColor: '#dddddd',
        showCount: false,
        countMetaKey: 'rating_count',
        align: 'left',
        iconType: 'text',
        svgFull: '',
        svgHalf: '',
        svgEmpty: '',
    };
    const defaultProps = {
        attributes: defaultAttributes,
        setAttributes: jest.fn(),
    };
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('should render with default attributes', () => {
        render(_jsx(Edit, { ...defaultProps }));
        // Should show 5 stars by default
        const stars = document.getElementsByClassName('jankx-star full');
        expect(stars.length).toBe(5);
    });
    it('should change rating source', () => {
        render(_jsx(Edit, { ...defaultProps }));
        const select = screen.getByTestId('select-Rating Source');
        fireEvent.change(select, { target: { value: 'woocommerce' } });
        expect(defaultProps.setAttributes).toHaveBeenCalledWith({ ratingSource: 'woocommerce' });
    });
    it('should show placeholder info for non-manual sources', () => {
        const props = {
            ...defaultProps,
            attributes: {
                ...defaultAttributes,
                ratingSource: 'woocommerce',
            },
        };
        render(_jsx(Edit, { ...props }));
        expect(screen.getByText('Previewing woocommerce rating')).toBeInTheDocument();
    });
    it('should update manual rating', () => {
        render(_jsx(Edit, { ...defaultProps }));
        const range = screen.getByTestId('range-Rating Value');
        fireEvent.change(range, { target: { value: '3' } });
        expect(defaultProps.setAttributes).toHaveBeenCalledWith({ manualRating: 3 });
    });
    it('should switch to SVG icon type', () => {
        render(_jsx(Edit, { ...defaultProps }));
        const select = screen.getByTestId('select-Icon Type');
        fireEvent.change(select, { target: { value: 'svg' } });
        expect(defaultProps.setAttributes).toHaveBeenCalledWith({ iconType: 'svg' });
    });
    it('should render SVG icons when iconType is svg', () => {
        const props = {
            ...defaultProps,
            attributes: {
                ...defaultAttributes,
                iconType: 'svg',
                svgFull: '<svg>Full</svg>',
            },
        };
        render(_jsx(Edit, { ...props }));
        const stars = document.getElementsByClassName('jankx-star full is-svg');
        expect(stars.length).toBe(5);
        expect(stars[0].innerHTML).toContain('<svg>Full</svg>');
    });
    it('should show rating count when enabled', () => {
        const props = {
            ...defaultProps,
            attributes: {
                ...defaultAttributes,
                showCount: true,
            },
        };
        render(_jsx(Edit, { ...props }));
        expect(screen.getByText('(123)')).toBeInTheDocument();
    });
});
