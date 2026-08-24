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
    useInnerBlocksProps: jest.fn((props) => ({ ...props, children: _jsx("div", { "data-testid": "inner-blocks" }) })),
    InspectorControls: ({ children }) => _jsx("div", { children: children }),
}));
jest.mock('@wordpress/i18n', () => ({
    __: (text) => text,
}));
jest.mock('@wordpress/components', () => ({
    PanelBody: ({ title, children }) => _jsxs("div", { children: [_jsx("h2", { children: title }), children] }),
    SelectControl: ({ label, value, options, onChange }) => (_jsxs("label", { children: [label, _jsx("select", { value: value, onChange: (e) => onChange(e.target.value), "data-testid": `select-${label}`, children: options.map((opt) => (_jsx("option", { value: opt.value, children: opt.label }, opt.value))) })] })),
}));
describe('CarouselSlide Edit', () => {
    const defaultAttributes = {
        imageSize: 'cover',
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
        expect(screen.getByTestId('select-Background Image Size')).toHaveValue('cover');
    });
    it('should update image size', () => {
        render(_jsx(Edit, { ...defaultProps }));
        const select = screen.getByTestId('select-Background Image Size');
        fireEvent.change(select, { target: { value: 'contain' } });
        expect(defaultProps.setAttributes).toHaveBeenCalledWith({ imageSize: 'contain' });
    });
});
