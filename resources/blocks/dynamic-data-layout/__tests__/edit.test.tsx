/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import Edit from '../edit';

// Mock window globals
window.jankxQueryOptions = {
    queryPresets: [
        { value: 'default', label: 'Default' },
        { value: 'custom', label: 'Custom' },
        { value: 'related', label: 'Related', postType: 'post' },
    ],
    orderBy: [
        { value: 'date', label: 'Date' },
        { value: 'title', label: 'Title' },
    ],
    order: [
        { value: 'ASC', label: 'Ascending' },
        { value: 'DESC', label: 'Descending' },
    ],
    metaTypes: [
        { value: 'NUMERIC', label: 'Numeric' },
    ],
};

window.jankxDynamicDataLayouts = {
    layoutsByPostType: {},
    commonLayouts: [
        { name: 'grid', title: 'Grid', supportedOptions: ['columns'] },
        { name: 'list', title: 'List', supportedOptions: [] },
    ],
};

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
    InspectorControls: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    InnerBlocks: Object.assign(
        ({ children }: { children?: React.ReactNode }) => <div data-testid="inner-blocks">{children}</div>,
        {
            ButtonBlockAppender: () => <button data-testid="block-appender">Add Block</button>,
            DefaultBlockAppender: () => <div data-testid="default-appender" />,
            Content: () => <div data-testid="inner-blocks-content" />,
        }
    ),
    store: 'core/block-editor',
}));

jest.mock('@wordpress/i18n', () => ({
    __: (text: string) => text,
}));

jest.mock('@wordpress/data', () => ({
    useSelect: jest.fn((callback) => callback((scope: string) => {
        if (scope === 'core') {
            return {
                getPostTypes: () => [
                    { name: 'Posts', slug: 'post', viewable: true },
                    { name: 'Pages', slug: 'page', viewable: true },
                    { name: 'Products', slug: 'product', viewable: true },
                ],
            };
        }
        if (scope === 'core/block-editor') {
             return {
                 getBlocks: () => [], // Simulate no inner blocks initially
             };
        }
        return {};
    })),
}));

jest.mock('@wordpress/components', () => ({
    PanelBody: ({ title, children, initialOpen, onToggle }: any) => (
        <div data-testid={`panel-${title}`}>
            <button onClick={() => onToggle && onToggle(true)}>{title}</button>
            {children}
        </div>
    ),
    SelectControl: ({ label, value, options, onChange }: any) => (
        <label>
            {label}
            <select value={value} onChange={(e) => onChange(e.target.value)} data-testid={`select-${label}`}>
                {options.map((opt: any) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
        </label>
    ),
    RangeControl: ({ label, value, onChange }: any) => (
        <label>
            {label}
            <input
                type="number"
                value={value}
                onChange={(e) => onChange(parseInt(e.target.value))}
                data-testid={`range-${label}`}
            />
        </label>
    ),
    ToggleControl: ({ label, checked, onChange }: any) => (
        <label>
            {label}
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                data-testid={`toggle-${label}`}
            />
        </label>
    ),
    TextControl: ({ label, value, onChange }: any) => (
        <label>
            {label}
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                data-testid={`text-${label}`}
            />
        </label>
    ),
    BaseControl: ({ label, children }: any) => <div><label>{label}</label>{children}</div>,
    FormTokenField: ({ value, suggestions, onChange }: any) => (
        <div data-testid="form-token-field">
            {value.map((v: string) => <span key={v}>{v}</span>)}
            <input
                onChange={(e) => onChange([...value, e.target.value])}
                data-testid="token-input"
            />
        </div>
    ),
    Button: ({ children, onClick }: any) => <button onClick={onClick}>{children}</button>,
    Spinner: () => <div>Loading...</div>,
}));

// Mock shared components
jest.mock('../../../shared/components', () => ({
    ResponsiveControl: ({ label, values, onChange }: any) => (
        <div data-testid={`responsive-${label}`}>
            <input
                data-testid="desktop-col"
                type="number"
                value={values.desktop}
                onChange={(e) => onChange({ ...values, desktop: parseInt(e.target.value) })}
            />
        </div>
    ),
}));

// Mock apiFetch
const mockApiFetch = jest.fn();
(window as any).wp = {
    apiFetch: mockApiFetch,
};

describe('DynamicDataLayout Edit', () => {
    const defaultAttributes: any = {
        queryPreset: 'default',
        postType: 'post',
        postsPerPage: 10,
        layout: 'grid',
        columns: 3,
        columnsTablet: 2,
        columnsMobile: 1,
        orderBy: 'date',
        order: 'DESC',
        taxQuery: [],
        metaQuery: [],
        authorIn: [],
        authorNotIn: [],
        postIn: [],
        postNotIn: [],
        postStatus: ['publish'],
    };

    const defaultProps = {
        attributes: defaultAttributes,
        setAttributes: jest.fn(),
        clientId: 'test-client-id',
    };

    beforeEach(() => {
        jest.clearAllMocks();
        mockApiFetch.mockReset();
    });

    it('should render with default attributes', async () => {
        await act(async () => {
            render(<Edit {...defaultProps} />);
        });

        expect(screen.getByTestId('select-Query Preset')).toHaveValue('default');
        expect(screen.getByTestId('select-Post Type')).toHaveValue('post');
    });

    it('should fetch taxonomies and authors on mount', async () => {
        mockApiFetch.mockImplementation((options: { path: string }) => {
            if (options.path.includes('taxonomies')) {
                return Promise.resolve({
                    category: { slug: 'category', name: 'Categories' },
                    post_tag: { slug: 'post_tag', name: 'Tags' },
                });
            }
            if (options.path.includes('users')) {
                return Promise.resolve([
                    { id: 1, name: 'Admin' },
                    { id: 2, name: 'Editor' },
                ]);
            }
            return Promise.resolve({});
        });

        await act(async () => {
            render(<Edit {...defaultProps} />);
        });

        await waitFor(() => {
            expect(mockApiFetch).toHaveBeenCalledTimes(2);
        });
    });

    it('should show advanced controls when queryPreset is custom', async () => {
        const props = {
            ...defaultProps,
            attributes: {
                ...defaultAttributes,
                queryPreset: 'custom',
            },
        };

        await act(async () => {
            render(<Edit {...props} />);
        });

        expect(screen.getByText('Query Parameters')).toBeInTheDocument();
        expect(screen.getByText('🔧 Advanced Query Parameters')).toBeInTheDocument();
        expect(screen.getByText('🔍 Keyword Search')).toBeInTheDocument();
        expect(screen.getByText('⚙️ Meta Query Filters')).toBeInTheDocument();
    });

    it('should update query preset', async () => {
        await act(async () => {
            render(<Edit {...defaultProps} />);
        });

        const select = screen.getByTestId('select-Query Preset');
        fireEvent.change(select, { target: { value: 'custom' } });

        expect(defaultProps.setAttributes).toHaveBeenCalledWith({ queryPreset: 'custom' });
    });

    it('should not show Order By controls for default preset', async () => {
        await act(async () => {
            render(<Edit {...defaultProps} />);
        });

        expect(screen.queryByTestId('select-Order By')).not.toBeInTheDocument();
    });

    it('should show Order By controls for custom preset', async () => {
        const props = {
            ...defaultProps,
            attributes: {
                ...defaultAttributes,
                queryPreset: 'custom',
            },
        };

        await act(async () => {
            render(<Edit {...props} />);
        });

        expect(screen.getByTestId('select-Order By')).toBeInTheDocument();
    });

    it('should handle multi post type selection', async () => {
        const props = {
            ...defaultProps,
            attributes: {
                ...defaultAttributes,
                useMultiPostType: true,
                postTypes: ['post'],
            },
        };

        await act(async () => {
            render(<Edit {...props} />);
        });

        expect(screen.getByTestId('form-token-field')).toBeInTheDocument();
        expect(screen.queryByTestId('select-Post Type')).not.toBeInTheDocument();
    });
});
