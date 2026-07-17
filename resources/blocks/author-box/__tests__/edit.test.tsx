/**
 * @jest-environment jsdom
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Edit from '../src/edit';

// Mock WordPress dependencies
jest.mock('@wordpress/block-editor', () => ({
    useBlockProps: jest.fn((props) => props),
    InspectorControls: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock('@wordpress/components', () => ({
    PanelBody: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    ToggleControl: ({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) => (
        <label>
            {label}
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                data-testid={`toggle-${label.toLowerCase().replace(/\s+/g, '-')}`}
            />
        </label>
    ),
    RangeControl: ({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) => (
        <label>
            {label}
            <input
                type="range"
                value={value}
                onChange={(e) => onChange(parseInt(e.target.value))}
                data-testid={`range-${label.toLowerCase().replace(/\s+/g, '-')}`}
            />
        </label>
    ),
    SelectControl: ({ label, value, options, onChange }: { label: string; value: string; options: Array<{label: string; value: string}>; onChange: (value: string) => void }) => (
        <label>
            {label}
            <select value={value} onChange={(e) => onChange(e.target.value)} data-testid={`select-${label.toLowerCase().replace(/\s+/g, '-')}`}>
                {options.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
        </label>
    ),
    Spinner: () => <div data-testid="spinner">Loading...</div>,
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
        layout: 'horizontal' as const,
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
        render(<Edit {...defaultProps} />);

        expect(screen.getByText(/test author/i)).toBeInTheDocument();
    });

    it('should update layout when changed', () => {
        const setAttributes = jest.fn();
        render(<Edit {...defaultProps} setAttributes={setAttributes} />);

        const select = screen.getByTestId('select-layout') as HTMLSelectElement;
        fireEvent.change(select, { target: { value: 'vertical' } });

        expect(setAttributes).toHaveBeenCalledWith({ layout: 'vertical' });
    });

    it('should toggle showAvatar', () => {
        const setAttributes = jest.fn();
        render(<Edit {...defaultProps} setAttributes={setAttributes} />);

        const toggle = screen.getByTestId('toggle-show-avatar') as HTMLInputElement;
        fireEvent.change(toggle, { target: { checked: false } });

        expect(setAttributes).toHaveBeenCalledWith({ showAvatar: false });
    });

    it('should toggle showBio', () => {
        const setAttributes = jest.fn();
        render(<Edit {...defaultProps} setAttributes={setAttributes} />);

        const toggle = screen.getByTestId('toggle-show-bio') as HTMLInputElement;
        fireEvent.change(toggle, { target: { checked: false } });

        expect(setAttributes).toHaveBeenCalledWith({ showBio: false });
    });

    it('should toggle showSocial', () => {
        const setAttributes = jest.fn();
        render(<Edit {...defaultProps} setAttributes={setAttributes} />);

        const toggle = screen.getByTestId('toggle-show-social') as HTMLInputElement;
        fireEvent.change(toggle, { target: { checked: false } });

        expect(setAttributes).toHaveBeenCalledWith({ showSocial: false });
    });

    it('should toggle showPosts', () => {
        const setAttributes = jest.fn();
        render(<Edit {...defaultProps} setAttributes={setAttributes} />);

        const toggle = screen.getByTestId('toggle-show-posts') as HTMLInputElement;
        fireEvent.change(toggle, { target: { checked: true } });

        expect(setAttributes).toHaveBeenCalledWith({ showPosts: true });
    });

    it('should update avatarSize when changed', () => {
        const setAttributes = jest.fn();
        render(<Edit {...defaultProps} setAttributes={setAttributes} />);

        const range = screen.getByTestId('range-avatar-size') as HTMLInputElement;
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
        render(<Edit {...props} setAttributes={setAttributes} />);

        const range = screen.getByTestId('range-posts-count') as HTMLInputElement;
        fireEvent.change(range, { target: { value: '10' } });

        expect(setAttributes).toHaveBeenCalledWith({ postsCount: 10 });
    });
});
