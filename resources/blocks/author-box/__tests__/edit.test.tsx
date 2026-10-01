/**
 * @jest-environment jsdom
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Edit from '../src/edit';

/** Build a stable test id from a control label, e.g. "Avatar Size (px)" -> "avatar-size-px". */
const toTestId = (label: string) =>
    label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

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
                data-testid={`toggle-${toTestId(label)}`}
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
                data-testid={`range-${toTestId(label)}`}
            />
        </label>
    ),
    SelectControl: ({ label, value, options, onChange }: { label: string; value: string; options: Array<{label: string; value: string}>; onChange: (value: string) => void }) => (
        <label>
            {label}
            <select value={value} onChange={(e) => onChange(e.target.value)} data-testid={`select-${toTestId(label)}`}>
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

        expect(screen.getAllByText(/test author/i).length).toBeGreaterThan(0);
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
        // React normalises checkbox updates through click, not change.
        fireEvent.click(toggle);

        expect(setAttributes).toHaveBeenCalledWith({ showAvatar: false });
    });

    it('should toggle showBio', () => {
        const setAttributes = jest.fn();
        render(<Edit {...defaultProps} setAttributes={setAttributes} />);

        const toggle = screen.getByTestId('toggle-show-bio') as HTMLInputElement;
        // React normalises checkbox updates through click, not change.
        fireEvent.click(toggle);

        expect(setAttributes).toHaveBeenCalledWith({ showBio: false });
    });

    it('should toggle showSocial', () => {
        const setAttributes = jest.fn();
        render(<Edit {...defaultProps} setAttributes={setAttributes} />);

        const toggle = screen.getByTestId('toggle-show-social-links') as HTMLInputElement;
        // React normalises checkbox updates through click, not change.
        fireEvent.click(toggle);

        expect(setAttributes).toHaveBeenCalledWith({ showSocial: false });
    });

    it('should toggle showPosts', () => {
        const setAttributes = jest.fn();
        render(<Edit {...defaultProps} setAttributes={setAttributes} />);

        const toggle = screen.getByTestId('toggle-show-recent-posts') as HTMLInputElement;
        // React normalises checkbox updates through click, not change.
        fireEvent.click(toggle);

        expect(setAttributes).toHaveBeenCalledWith({ showPosts: true });
    });

    it('should update avatarSize when changed', () => {
        const setAttributes = jest.fn();
        render(<Edit {...defaultProps} setAttributes={setAttributes} />);

        const range = screen.getByTestId('range-avatar-size-px') as HTMLInputElement;
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

        const range = screen.getByTestId('range-number-of-posts') as HTMLInputElement;
        fireEvent.change(range, { target: { value: '10' } });

        expect(setAttributes).toHaveBeenCalledWith({ postsCount: 10 });
    });
});
