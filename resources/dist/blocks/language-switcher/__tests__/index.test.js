import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * @jest-environment jsdom
 */
import { render, screen, waitFor } from '@testing-library/react';
import { LanguageSwitcherEdit } from '../index';
import * as apiFetch from '@wordpress/api-fetch';
// Mock WordPress dependencies
jest.mock('@wordpress/api-fetch');
jest.mock('@wordpress/block-editor', () => ({
    useBlockProps: jest.fn((props) => props),
    InspectorControls: ({ children }) => _jsx("div", { children: children }),
}));
jest.mock('@wordpress/components', () => ({
    PanelBody: ({ children }) => _jsx("div", { children: children }),
    ToggleControl: ({ label, checked, onChange }) => (_jsxs("label", { children: [label, _jsx("input", { type: "checkbox", checked: checked, onChange: (e) => onChange(e.target.checked), "data-testid": `toggle-${label.toLowerCase().replace(/\s+/g, '-')}` })] })),
    SelectControl: ({ label, value, options, onChange }) => (_jsxs("label", { children: [label, _jsx("select", { value: value, onChange: (e) => onChange(e.target.value), "data-testid": `select-${label.toLowerCase().replace(/\s+/g, '-')}`, children: options.map(opt => (_jsx("option", { value: opt.value, children: opt.label }, opt.value))) })] })),
}));
describe('LanguageSwitcherEdit', () => {
    const defaultAttributes = {
        showFlags: true,
        showNames: true,
        showCurrent: true,
        displayType: 'dropdown',
        className: '',
    };
    const defaultProps = {
        attributes: defaultAttributes,
        setAttributes: jest.fn(),
        isSelected: false,
        clientId: 'test-client-id',
    };
    const mockLanguages = [
        {
            code: 'en',
            name: 'English',
            url: 'https://example.com/en/',
            flag: 'https://example.com/flags/en.png',
            current: true,
        },
        {
            code: 'vi',
            name: 'Tiếng Việt',
            url: 'https://example.com/vi/',
            flag: 'https://example.com/flags/vi.png',
            current: false,
        },
    ];
    beforeEach(() => {
        jest.clearAllMocks();
        apiFetch.default.mockResolvedValue(mockLanguages);
    });
    afterEach(() => {
        jest.restoreAllMocks();
    });
    it('should render with default attributes', async () => {
        render(_jsx(LanguageSwitcherEdit, { ...defaultProps }));
        await waitFor(() => {
            expect(screen.getByText(/english/i)).toBeInTheDocument();
        });
    });
    it('should fetch languages on mount', async () => {
        render(_jsx(LanguageSwitcherEdit, { ...defaultProps }));
        await waitFor(() => {
            expect(apiFetch.default).toHaveBeenCalledWith({
                path: '/jankx/v1/languages',
                method: 'GET',
            });
        });
    });
    it('should display loading state initially', () => {
        render(_jsx(LanguageSwitcherEdit, { ...defaultProps }));
        expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });
    it('should display error message when API fails', async () => {
        apiFetch.default.mockRejectedValue(new Error('API Error'));
        render(_jsx(LanguageSwitcherEdit, { ...defaultProps }));
        await waitFor(() => {
            expect(screen.getByText(/failed to load/i)).toBeInTheDocument();
        });
    });
    it('should update displayType when changed', async () => {
        const setAttributes = jest.fn();
        render(_jsx(LanguageSwitcherEdit, { ...defaultProps, setAttributes: setAttributes }));
        await waitFor(() => {
            const select = screen.getByTestId('select-display-type');
            expect(select).toBeInTheDocument();
        });
        const select = screen.getByTestId('select-display-type');
        // Simulate change to 'list'
        const changeEvent = { target: { value: 'list' } };
        select.dispatchEvent(new Event('change', { bubbles: true }));
        select.value = 'list';
        select.onchange?.(changeEvent);
        expect(setAttributes).toHaveBeenCalledWith({ displayType: 'list' });
    });
    it('should toggle showFlags attribute', async () => {
        const setAttributes = jest.fn();
        render(_jsx(LanguageSwitcherEdit, { ...defaultProps, setAttributes: setAttributes }));
        await waitFor(() => {
            const toggle = screen.getByTestId('toggle-show-flags');
            expect(toggle).toBeInTheDocument();
        });
        const toggle = screen.getByTestId('toggle-show-flags');
        toggle.checked = false;
        toggle.dispatchEvent(new Event('change', { bubbles: true }));
        expect(setAttributes).toHaveBeenCalledWith({ showFlags: false });
    });
    it('should render dropdown preview when displayType is dropdown', async () => {
        render(_jsx(LanguageSwitcherEdit, { ...defaultProps }));
        await waitFor(() => {
            expect(screen.getByText(/english/i)).toBeInTheDocument();
        });
        expect(screen.getByText(/dropdown/i)).toBeInTheDocument();
    });
    it('should render list preview when displayType is list', async () => {
        const props = {
            ...defaultProps,
            attributes: {
                ...defaultAttributes,
                displayType: 'list',
            },
        };
        render(_jsx(LanguageSwitcherEdit, { ...props }));
        await waitFor(() => {
            expect(screen.getByText(/english/i)).toBeInTheDocument();
        });
        // Should render list structure
        const list = document.querySelector('.language-switcher-list');
        expect(list).toBeInTheDocument();
    });
    it('should display placeholder when no languages', async () => {
        apiFetch.default.mockResolvedValue([]);
        render(_jsx(LanguageSwitcherEdit, { ...defaultProps }));
        await waitFor(() => {
            expect(screen.getByText(/no languages found/i)).toBeInTheDocument();
        });
    });
    it('should handle empty language data gracefully', async () => {
        apiFetch.default.mockResolvedValue(null);
        render(_jsx(LanguageSwitcherEdit, { ...defaultProps }));
        await waitFor(() => {
            expect(screen.getByText(/no languages found/i)).toBeInTheDocument();
        });
    });
});
