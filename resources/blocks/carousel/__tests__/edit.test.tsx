/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Edit from '../edit';

const mockReplaceInnerBlocks = jest.fn();
const mockSelectBlock = jest.fn();

// Mock WordPress dependencies
jest.mock('@wordpress/block-editor', () => ({
    useBlockProps: jest.fn((props) => props),
    InspectorControls: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    BlockControls: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    useInnerBlocksProps: jest.fn((props) => ({ ...props, children: <div data-testid="inner-blocks" /> })),
    MediaUpload: ({ render }: any) => render({ open: jest.fn() }),
    MediaUploadCheck: ({ children }: any) => <div>{children}</div>,
    InnerBlocks: {
        ButtonBlockAppender: () => <div data-testid="inner-blocks-appender" />,
    },
}));

jest.mock('@wordpress/i18n', () => ({
    __: (text: string) => text,
}));

jest.mock('@wordpress/blocks', () => ({
    createBlock: jest.fn((name, attributes) => ({ name, attributes })),
}));

jest.mock('@wordpress/data', () => ({
    useSelect: jest.fn((callback) => callback((scope: string) => {
        if (scope === 'core/block-editor') {
            return {
                getBlock: jest.fn(() => ({ innerBlocks: [] })),
                getSelectedBlock: jest.fn(() => null),
            };
        }
        return {};
    })),
    dispatch: jest.fn(() => ({
        replaceInnerBlocks: mockReplaceInnerBlocks,
        selectBlock: mockSelectBlock,
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
        useRef: React.useRef,
        Fragment: React.Fragment,
    };
});

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
    Button: ({ children, onClick }: any) => <button onClick={onClick}>{children}</button>,
    BaseControl: ({ label, children }: any) => (
        <div>
            {label ? <span>{label}</span> : null}
            {children}
        </div>
    ),
    ColorPalette: ({ value, onChange }: any) => (
        <div data-testid="color-palette" data-value={value || ''}>
            <button onClick={() => onChange && onChange('#123456')}>pick</button>
        </div>
    ),
    ColorPicker: () => <div data-testid="color-picker" />,
    TextControl: ({ label, value, onChange }: any) => (
        <label>
            {label}
            <input
                type="text"
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                data-testid={`text-${label}`}
            />
        </label>
    ),
    TextareaControl: ({ label, value, onChange }: any) => (
        <label>
            {label}
            <textarea
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                data-testid={`textarea-${label}`}
            />
        </label>
    ),
}));

describe('Carousel Edit', () => {
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
        arrowsPosition: 'inside',
        alwaysShowArrows: false,
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
        render(<Edit {...defaultProps} />);

        expect(screen.getByTestId('inner-blocks')).toBeInTheDocument();
        expect(screen.getByTestId('range-Slides Per View')).toHaveValue(1);
    });

    it('should update slides per view', () => {
        render(<Edit {...defaultProps} />);

        const range = screen.getByTestId('range-Slides Per View');
        fireEvent.change(range, { target: { value: '2' } });

        expect(defaultProps.setAttributes).toHaveBeenCalledWith({ slidesPerView: 2 });
    });

    it('should toggle autoplay', () => {
        render(<Edit {...defaultProps} />);

        const toggle = screen.getByTestId('toggle-Autoplay');
        fireEvent.click(toggle);

        expect(defaultProps.setAttributes).toHaveBeenCalledWith({ autoplay: true });
    });

    it('should switch content type to gallery', () => {
        render(<Edit {...defaultProps} />);

        const select = screen.getByTestId('select-Content type');
        fireEvent.change(select, { target: { value: 'gallery' } });

        expect(defaultProps.setAttributes).toHaveBeenCalledWith({ contentMode: 'gallery' });
    });

    it('should seed two slides when inserted empty', () => {
        render(<Edit {...defaultProps} />);

        expect(mockReplaceInnerBlocks).toHaveBeenCalledTimes(1);
        const [clientId, blocks] = mockReplaceInnerBlocks.mock.calls[0];
        expect(clientId).toBe('test-client-id');
        expect(blocks).toHaveLength(2);
        expect(blocks.every((b: any) => b.name === 'jankx/carousel-slide')).toBe(true);
    });

    it('should change arrows position', () => {
        render(<Edit {...defaultProps} />);

        const select = screen.getByTestId('select-Arrows position');
        fireEvent.change(select, { target: { value: 'outside' } });

        expect(defaultProps.setAttributes).toHaveBeenCalledWith({ arrowsPosition: 'outside' });
    });

    it('should toggle always show arrows', () => {
        render(<Edit {...defaultProps} />);

        const toggle = screen.getByTestId('toggle-Always show arrows');
        fireEvent.click(toggle);

        expect(defaultProps.setAttributes).toHaveBeenCalledWith({ alwaysShowArrows: true });
    });
});
