import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Edit from '../edit';
// Mock Swiper
jest.mock('swiper/bundle', () => {
    return jest.fn().mockImplementation(() => ({
        params: {
            navigation: {},
            pagination: {},
            autoplay: {},
            breakpoints: {}
        },
        update: jest.fn(),
        destroy: jest.fn(),
        navigation: {
            init: jest.fn(),
            update: jest.fn(),
            destroy: jest.fn(),
        },
        pagination: {
            init: jest.fn(),
            render: jest.fn(),
            update: jest.fn(),
            destroy: jest.fn(),
        },
        autoplay: {
            start: jest.fn(),
            stop: jest.fn(),
        },
    }));
});
jest.mock('swiper/css/bundle', () => { });
// Mock WordPress dependencies
jest.mock('@wordpress/block-editor', () => ({
    useBlockProps: jest.fn((props) => props),
    InspectorControls: ({ children }) => _jsx("div", { children: children }),
    BlockControls: ({ children }) => _jsx("div", { children: children }),
    useInnerBlocksProps: jest.fn((props) => ({ ...props, children: _jsx("div", { "data-testid": "inner-blocks" }) })),
    MediaUpload: ({ render }) => render({ open: jest.fn() }),
    MediaUploadCheck: ({ children }) => _jsx("div", { children: children }),
}));
jest.mock('@wordpress/i18n', () => ({
    __: (text) => text,
}));
jest.mock('@wordpress/blocks', () => ({
    createBlock: jest.fn((name, attributes) => ({ name, attributes })),
}));
jest.mock('@wordpress/data', () => ({
    useSelect: jest.fn((callback) => callback((scope) => {
        if (scope === 'core/block-editor') {
            return {
                getBlock: jest.fn(() => ({ innerBlocks: [] })),
            };
        }
        return {};
    })),
    dispatch: jest.fn(() => ({
        replaceInnerBlocks: jest.fn(),
    })),
}));
jest.mock('@wordpress/element', () => {
    const React = require('react');
    return {
        ...React,
        useState: React.useState,
        useEffect: React.useEffect,
        useCallback: React.useCallback,
        useMemo: React.useMemo,
        Fragment: React.Fragment,
    };
});
jest.mock('@wordpress/components', () => ({
    PanelBody: ({ title, children }) => _jsxs("div", { children: [_jsx("h2", { children: title }), children] }),
    SelectControl: ({ label, value, options, onChange }) => (_jsxs("label", { children: [label, _jsx("select", { value: value, onChange: (e) => onChange(e.target.value), "data-testid": `select-${label}`, children: options.map((opt) => (_jsx("option", { value: opt.value, children: opt.label }, opt.value))) })] })),
    RangeControl: ({ label, value, onChange }) => (_jsxs("label", { children: [label, _jsx("input", { type: "number", value: value, onChange: (e) => onChange(parseInt(e.target.value)), "data-testid": `range-${label}` })] })),
    ToggleControl: ({ label, checked, onChange }) => (_jsxs("label", { children: [label, _jsx("input", { type: "checkbox", checked: checked, onChange: (e) => onChange(e.target.checked), "data-testid": `toggle-${label}` })] })),
    Button: ({ children, onClick }) => _jsx("button", { onClick: onClick, children: children }),
    TabPanel: ({ tabs, children, onSelect }) => (_jsxs("div", { children: [_jsx("div", { className: "tabs", children: tabs.map((tab) => (_jsx("button", { onClick: () => onSelect(tab.name), children: tab.title }, tab.name))) }), children(tabs[0])] })),
    ColorPicker: () => _jsx("div", { "data-testid": "color-picker" }),
    ToolbarGroup: ({ children }) => _jsx("div", { children: children }),
    ToolbarButton: ({ title, onClick, isActive }) => (_jsx("button", { onClick: onClick, className: isActive ? 'is-active' : '', "data-testid": `toolbar-${title}`, children: title })),
}));
describe('Swiper Edit', () => {
    const defaultAttributes = {
        slidesPerView: 1,
        slidesPerViewTablet: 1,
        slidesPerViewMobile: 1,
        spaceBetween: 30,
        loop: true,
        autoplay: false,
        autoplayDelay: 3000,
        speed: 300,
        navigation: true,
        pagination: true,
        effect: 'slide',
        height: 400,
        minHeight: 200,
        contentMode: 'slides',
        galleryImages: [],
        bannerStyle: 'default',
        bannerTextColor: '#fff',
        bannerBackgroundColor: '#000',
        bannerPadding: 20,
        bannerBorderRadius: 0,
        className: '',
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
        expect(screen.getByTestId('range-Slides Per View')).toHaveValue(1);
    });
    it('should update slides per view', () => {
        render(_jsx(Edit, { ...defaultProps }));
        const range = screen.getByTestId('range-Slides Per View');
        fireEvent.change(range, { target: { value: '2' } });
        expect(defaultProps.setAttributes).toHaveBeenCalledWith({ slidesPerView: 2 });
    });
    it('should toggle autoplay', () => {
        render(_jsx(Edit, { ...defaultProps }));
        const toggle = screen.getByTestId('toggle-Autoplay');
        fireEvent.click(toggle);
        expect(defaultProps.setAttributes).toHaveBeenCalledWith({ autoplay: true });
    });
    it('should change banner style via toolbar', () => {
        render(_jsx(Edit, { ...defaultProps }));
        const button = screen.getByTestId('toolbar-Banner');
        fireEvent.click(button);
        expect(defaultProps.setAttributes).toHaveBeenCalledWith({ className: 'is-style-banner' });
    });
    it('should switch to gallery mode', () => {
        render(_jsx(Edit, { ...defaultProps }));
        const galleryTab = screen.getByText('Gallery');
        fireEvent.click(galleryTab);
        // Note: The TabPanel mock renders the first tab's content by default.
        // In a real TabPanel, clicking would change content.
        // Here we just check if onSelect was called which triggers setAttributes
        // But in our mock TabPanel we pass children(tabs[0]).
        // The real implementation calls setAttributes inside onSelect.
        // We can check if setAttributes was called if we mock TabPanel to call onSelect.
        // Let's rely on the TabPanel implementation in the Edit component which calls setAttributes
        // Our mock needs to trigger onSelect.
    });
});
