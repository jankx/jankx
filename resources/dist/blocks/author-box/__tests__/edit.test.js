import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent } from '@testing-library/react';
import Edit from '../src/edit';
// Mock WordPress dependencies
jest.mock('@wordpress/block-editor', () => ({
    useBlockProps: jest.fn((props) => props),
    InspectorControls: ({ children }) => _jsx("div", { children: children }),
}));
jest.mock('@wordpress/components', () => ({
    PanelBody: ({ children }) => _jsx("div", { children: children }),
    ToggleControl: ({ label, checked, onChange }) => (_jsxs("label", { children: [label, _jsx("input", { type: "checkbox", checked: checked, onChange: (e) => onChange(e.target.checked), "data-testid": `toggle-${label.toLowerCase().replace(/\s+/g, '-')}` })] })),
    RangeControl: ({ label, value, onChange }) => (_jsxs("label", { children: [label, _jsx("input", { type: "range", value: value, onChange: (e) => onChange(parseInt(e.target.value)), "data-testid": `range-${label.toLowerCase().replace(/\s+/g, '-')}` })] })),
    SelectControl: ({ label, value, options, onChange }) => (_jsxs("label", { children: [label, _jsx("select", { value: value, onChange: (e) => onChange(e.target.value), "data-testid": `select-${label.toLowerCase().replace(/\s+/g, '-')}`, children: options.map(opt => (_jsx("option", { value: opt.value, children: opt.label }, opt.value))) })] })),
    Spinner: () => _jsx("div", { "data-testid": "spinner", children: "Loading..." }),
}));
const mockAuthor = {
    id: 1,
    name: 'Test Author',
    slug: 'test-author',
    avatar_urls: {
        '24': 'https://example.com/avatar-24.jpg',
        '48': 'https://example.com/avatar-48.jpg',
        '96': 'https://example.com/avatar-96.jpg',
    },
    description: 'Test author bio',
};
jest.mock('@wordpress/data', () => ({
    useSelect: jest.fn(() => ({
        author: mockAuthor,
        posts: [],
    })),
}));
describe('AuthorBox Edit', () => {
    const defaultAttributes = {
        authorId: 0,
        showAvatar: true,
        avatarSize: 80,
        showBio: true,
        showSocial: true,
        showPosts: false,
        postsCount: 5,
        layout: 'horizontal',
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
        expect(screen.getByText(/test author/i)).toBeInTheDocument();
    });
    it('should update layout when changed', () => {
        const setAttributes = jest.fn();
        render(_jsx(Edit, { ...defaultProps, setAttributes: setAttributes }));
        const select = screen.getByTestId('select-layout');
        fireEvent.change(select, { target: { value: 'vertical' } });
        expect(setAttributes).toHaveBeenCalledWith({ layout: 'vertical' });
    });
    it('should toggle showAvatar', () => {
        const setAttributes = jest.fn();
        render(_jsx(Edit, { ...defaultProps, setAttributes: setAttributes }));
        const toggle = screen.getByTestId('toggle-show-avatar');
        fireEvent.change(toggle, { target: { checked: false } });
        expect(setAttributes).toHaveBeenCalledWith({ showAvatar: false });
    });
    it('should toggle showBio', () => {
        const setAttributes = jest.fn();
        render(_jsx(Edit, { ...defaultProps, setAttributes: setAttributes }));
        const toggle = screen.getByTestId('toggle-show-bio');
        fireEvent.change(toggle, { target: { checked: false } });
        expect(setAttributes).toHaveBeenCalledWith({ showBio: false });
    });
    it('should toggle showSocial', () => {
        const setAttributes = jest.fn();
        render(_jsx(Edit, { ...defaultProps, setAttributes: setAttributes }));
        const toggle = screen.getByTestId('toggle-show-social');
        fireEvent.change(toggle, { target: { checked: false } });
        expect(setAttributes).toHaveBeenCalledWith({ showSocial: false });
    });
    it('should toggle showPosts', () => {
        const setAttributes = jest.fn();
        render(_jsx(Edit, { ...defaultProps, setAttributes: setAttributes }));
        const toggle = screen.getByTestId('toggle-show-posts');
        fireEvent.change(toggle, { target: { checked: true } });
        expect(setAttributes).toHaveBeenCalledWith({ showPosts: true });
    });
    it('should update avatarSize when changed', () => {
        const setAttributes = jest.fn();
        render(_jsx(Edit, { ...defaultProps, setAttributes: setAttributes }));
        const range = screen.getByTestId('range-avatar-size');
        fireEvent.change(range, { target: { value: '100' } });
        expect(setAttributes).toHaveBeenCalledWith({ avatarSize: 100 });
    });
    it('should update postsCount when changed', () => {
        const setAttributes = jest.fn();
        const props = {
            ...defaultProps,
            attributes: {
                ...defaultAttributes,
                showPosts: true,
            },
        };
        render(_jsx(Edit, { ...props, setAttributes: setAttributes }));
        const range = screen.getByTestId('range-posts-count');
        fireEvent.change(range, { target: { value: '10' } });
        expect(setAttributes).toHaveBeenCalledWith({ postsCount: 10 });
    });
});
