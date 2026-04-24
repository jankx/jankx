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
    useInnerBlocksProps: jest.fn((props) => ({ ...props, children: <div data-testid="inner-blocks" /> })),
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
}));

describe('CarouselSlide Edit', () => {
    const defaultAttributes = {
        imageSize: 'cover' as const,
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
        
        expect(screen.getByTestId('inner-blocks')).toBeInTheDocument();
        expect(screen.getByTestId('select-Background Image Size')).toHaveValue('cover');
    });

    it('should update image size', () => {
        render(<Edit {...defaultProps} />);
        
        const select = screen.getByTestId('select-Background Image Size');
        fireEvent.change(select, { target: { value: 'contain' } });
        
        expect(defaultProps.setAttributes).toHaveBeenCalledWith({ imageSize: 'contain' });
    });
});
