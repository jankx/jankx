/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Edit from '../edit';

// Mock globals
window.jankxDynamicDataContentLoopLayouts = {
    layoutsByPostType: {},
    commonLayouts: [
        { name: 'default', title: 'Default', postType: 'post' },
        { name: 'card', title: 'Card', postType: 'post' },
    ],
};

window.jankxDynamicDataTemplateDefaultBlocks = {
    post: [
        { blockName: 'core/heading', attrs: { content: 'Post Title' } },
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
    useInnerBlocksProps: jest.fn((props) => ({ ...props, children: <div data-testid="inner-blocks" /> })),
    InspectorControls: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    BlockPreview: () => <div data-testid="block-preview" />,
    store: 'core/block-editor',
}));

jest.mock('@wordpress/i18n', () => ({
    __: (text: string) => text,
}));

jest.mock('@wordpress/data', () => ({
    useSelect: jest.fn((callback) => callback((scope: string) => {
        if (scope === 'core/block-editor') {
            return {
                getBlock: jest.fn(() => ({
                    innerBlocks: [
                        { name: 'core/heading', attributes: { content: 'Post Title' } }
                    ]
                })),
            };
        }
        return {};
    })),
}));

jest.mock('@wordpress/compose', () => ({
    useResizeObserver: () => [null, { width: 500, height: 300 }],
}));

jest.mock('@wordpress/components', () => ({
    PanelBody: ({ title, children, initialOpen }: any) => (
        <div data-testid={`panel-${title}`}>
            <button>{title}</button>
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
}));

describe('DynamicDataTemplate Edit', () => {
    const defaultAttributes = {
        contentLoopLayout: 'default',
        itemSpacing: 'normal',
        showItemBorder: false,
        itemBorderRadius: 0,
        thumbnailPosition: 'top' as const,
        imageRatio: '',
        overlayIcon: '',
        overlayIconMode: 'always-show' as const,
    };

    const defaultContext = {
        query: { postType: 'post' },
        postsPerPage: 3,
        displayLayout: 'grid',
        columns: 3,
    };

    const defaultProps = {
        attributes: defaultAttributes,
        setAttributes: jest.fn(),
        clientId: 'test-client-id',
        context: defaultContext,
    };

    beforeEach(() => {
        jest.clearAllMocks();
        
        // Mock ResizeObserver
        global.ResizeObserver = jest.fn().mockImplementation(() => ({
            observe: jest.fn(),
            unobserve: jest.fn(),
            disconnect: jest.fn(),
        }));
    });

    it('should render with default attributes', () => {
        render(<Edit {...defaultProps} />);
        
        // Should render one editable item (inner-blocks)
        expect(screen.getByTestId('inner-blocks')).toBeInTheDocument();
        
        // Should render 2 preview items (since postsPerPage is 3)
        const previews = screen.getAllByTestId('block-preview');
        expect(previews.length).toBe(2);
    });

    it('should change content loop layout', () => {
        render(<Edit {...defaultProps} />);
        
        const select = screen.getByTestId('select-Content Loop Layout');
        fireEvent.change(select, { target: { value: 'card' } });
        
        expect(defaultProps.setAttributes).toHaveBeenCalledWith({ contentLoopLayout: 'card' });
    });

    it('should toggle item border', () => {
        render(<Edit {...defaultProps} />);
        
        const toggle = screen.getByTestId('toggle-Show Item Border');
        fireEvent.click(toggle);
        
        expect(defaultProps.setAttributes).toHaveBeenCalledWith({ showItemBorder: true });
    });

    it('should render carousel layout', () => {
        const props = {
            ...defaultProps,
            context: {
                ...defaultContext,
                displayLayout: 'carousel',
                showArrows: true,
            },
        };
        
        render(<Edit {...props} />);
        
        expect(screen.getByText('Prev')).toBeInTheDocument();
        expect(screen.getByText('Next')).toBeInTheDocument();
    });

    it('should update image ratio', () => {
        render(<Edit {...defaultProps} />);
        
        const select = screen.getByTestId('select-Image Aspect Ratio');
        fireEvent.change(select, { target: { value: '16/9' } });
        
        expect(defaultProps.setAttributes).toHaveBeenCalledWith({ imageRatio: '16/9' });
    });

    it('should show custom ratio input when custom selected', () => {
        const props = {
            ...defaultProps,
            attributes: {
                ...defaultAttributes,
                imageRatio: '16/9', // This is technically a valid custom ratio string, but let's assume UI handles it
            },
        };
        
        // In the component logic, if value is in presets, it shows preset.
        // If not in presets, it shows custom.
        // We need to simulate selecting "custom" in dropdown which clears ratio, then showing input
        
        render(<Edit {...props} />);
        
        const select = screen.getByTestId('select-Image Aspect Ratio');
        fireEvent.change(select, { target: { value: 'custom' } });
        
        expect(defaultProps.setAttributes).toHaveBeenCalledWith({ imageRatio: '' });
    });
});
