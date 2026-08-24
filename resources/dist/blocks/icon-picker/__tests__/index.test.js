import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { registerBlockType } from '@wordpress/blocks';
// Mock WordPress dependencies
jest.mock('@wordpress/blocks', () => ({
    registerBlockType: jest.fn(),
    createBlock: jest.fn(),
}));
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
jest.mock('@wordpress/i18n', () => ({
    __: (text) => text,
}));
jest.mock('@wordpress/block-editor', () => ({
    useBlockProps: Object.assign(jest.fn((props) => props), { save: jest.fn((props) => props) }),
    InspectorControls: ({ children }) => _jsx("div", { children: children }),
    BlockControls: ({ children }) => _jsx("div", { children: children }),
    AlignmentToolbar: ({ onChange }) => (_jsx("button", { "data-testid": "alignment-toolbar", onClick: () => onChange('center'), children: "Align" })),
}));
jest.mock('@wordpress/components', () => ({
    PanelBody: ({ title, children }) => _jsxs("div", { children: [_jsx("h2", { children: title }), children] }),
}));
// Mock internal components
jest.mock('../../../shared/components/IconPicker', () => ({ onChange }) => (_jsx("button", { "data-testid": "icon-picker", onClick: () => onChange({ name: 'new-icon', category: 'action', iconSet: 'material' }), children: "Pick Icon" })));
jest.mock('../components/IconSettings', () => ({ onIconSizeChange }) => (_jsx("button", { "data-testid": "icon-settings", onClick: () => onIconSizeChange('30px'), children: "Change Size" })));
jest.mock('../components/LinkSettings', () => ({ onLinkChange }) => (_jsx("button", { "data-testid": "link-settings", onClick: () => onLinkChange('https://example.com'), children: "Set Link" })));
// Import the file to trigger registration
require('../index');
describe('IconPicker', () => {
    let Edit;
    let Save;
    beforeAll(() => {
        // Capture the components from the registerBlockType call
        const mockFn = registerBlockType;
        const call = mockFn.mock.calls.find((call) => call[0] === 'jankx/icon-picker');
        if (call) {
            Edit = call[1].edit;
            Save = call[1].save;
        }
    });
    const defaultAttributes = {
        iconName: 'home',
        iconType: 'material',
        iconCategory: 'navigation',
        iconSet: 'material',
        iconSize: '24px',
        iconColor: '#333333',
        iconAlignment: 'left',
        linkUrl: '',
        linkTarget: '_self',
        linkRel: '',
        showLabel: false,
        iconLabel: '',
        labelPosition: 'after',
        labelSize: '14px',
        labelColor: '',
        customClassName: '',
        iconStyle: 'filled'
    };
    const defaultProps = {
        attributes: defaultAttributes,
        setAttributes: jest.fn(),
    };
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('should register the block', () => {
        expect(Edit).toBeDefined();
        expect(Save).toBeDefined();
    });
    describe('Edit', () => {
        it('should render with default attributes', () => {
            render(_jsx(Edit, { ...defaultProps }));
            expect(screen.getByText('home')).toBeInTheDocument();
        });
        it('should update icon', () => {
            render(_jsx(Edit, { ...defaultProps }));
            const picker = screen.getByTestId('icon-picker');
            fireEvent.click(picker);
            expect(defaultProps.setAttributes).toHaveBeenCalledWith({
                iconName: 'new-icon',
                iconCategory: 'action',
                iconSet: 'material'
            });
        });
        it('should update alignment', () => {
            render(_jsx(Edit, { ...defaultProps }));
            const toolbar = screen.getByTestId('alignment-toolbar');
            fireEvent.click(toolbar);
            expect(defaultProps.setAttributes).toHaveBeenCalledWith({ iconAlignment: 'center' });
        });
        it('should update settings', () => {
            render(_jsx(Edit, { ...defaultProps }));
            const settings = screen.getByTestId('icon-settings');
            fireEvent.click(settings);
            expect(defaultProps.setAttributes).toHaveBeenCalledWith({ iconSize: '30px' });
        });
        it('should update link', () => {
            render(_jsx(Edit, { ...defaultProps }));
            const link = screen.getByTestId('link-settings');
            fireEvent.click(link);
            expect(defaultProps.setAttributes).toHaveBeenCalledWith({ linkUrl: 'https://example.com' });
        });
    });
    describe('Save', () => {
        it('should render icon', () => {
            const { container } = render(_jsx(Save, { attributes: defaultAttributes }));
            expect(container.querySelector('.material-icons')).toHaveTextContent('home');
        });
        it('should render link when url is present', () => {
            const props = {
                ...defaultAttributes,
                linkUrl: 'https://example.com',
            };
            const { container } = render(_jsx(Save, { attributes: props }));
            expect(container.querySelector('a')).toHaveAttribute('href', 'https://example.com');
        });
    });
});
