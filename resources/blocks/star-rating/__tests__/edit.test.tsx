/**
 * @jest-environment jsdom
 */

import React from 'react';
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
    InspectorControls: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock('@wordpress/i18n', () => ({
    __: (text: string) => text,
}));

jest.mock('@wordpress/components', () => ({
    PanelBody: ({ title, children }: any) => <div><h2>{title}</h2>{children}</div>,
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
    ColorPalette: ({ value, onChange }: any) => (
        <div data-testid="color-palette">
            <button onClick={() => onChange('#ff0000')}>Red</button>
            <button onClick={() => onChange('#00ff00')}>Green</button>
        </div>
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
    TextareaControl: ({ label, value, onChange }: any) => (
        <label>
            {label}
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                data-testid={`textarea-${label}`}
            />
        </label>
    ),
}));

describe('StarRating Edit', () => {
    const defaultAttributes = {
        ratingSource: 'manual' as const,
        manualRating: 5,
        metaKey: 'rating_score',
        crawlerTable: '',
        starSize: 16,
        starColor: '#f1c40f',
        starEmptyColor: '#dddddd',
        showCount: false,
        countMetaKey: 'rating_count',
        align: 'left',
        iconType: 'text' as const,
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
        render(<Edit {...defaultProps} />);
        
        // Should show 5 stars by default
        const stars = document.getElementsByClassName('jankx-star full');
        expect(stars.length).toBe(5);
    });

    it('should change rating source', () => {
        render(<Edit {...defaultProps} />);
        
        const select = screen.getByTestId('select-Rating Source');
        fireEvent.change(select, { target: { value: 'woocommerce' } });
        
        expect(defaultProps.setAttributes).toHaveBeenCalledWith({ ratingSource: 'woocommerce' });
    });

    it('should show placeholder info for non-manual sources', () => {
        const props = {
            ...defaultProps,
            attributes: {
                ...defaultAttributes,
                ratingSource: 'woocommerce' as const,
            },
        };
        
        render(<Edit {...props} />);
        
        expect(screen.getByText('Previewing woocommerce rating')).toBeInTheDocument();
    });

    it('should update manual rating', () => {
        render(<Edit {...defaultProps} />);
        
        const range = screen.getByTestId('range-Rating Value');
        fireEvent.change(range, { target: { value: '3' } });
        
        expect(defaultProps.setAttributes).toHaveBeenCalledWith({ manualRating: 3 });
    });

    it('should switch to SVG icon type', () => {
        render(<Edit {...defaultProps} />);
        
        const select = screen.getByTestId('select-Icon Type');
        fireEvent.change(select, { target: { value: 'svg' } });
        
        expect(defaultProps.setAttributes).toHaveBeenCalledWith({ iconType: 'svg' });
    });

    it('should render SVG icons when iconType is svg', () => {
        const props = {
            ...defaultProps,
            attributes: {
                ...defaultAttributes,
                iconType: 'svg' as const,
                svgFull: '<svg>Full</svg>',
            },
        };
        
        render(<Edit {...props} />);
        
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
        
        render(<Edit {...props} />);
        
        expect(screen.getByText('(123)')).toBeInTheDocument();
    });
});
