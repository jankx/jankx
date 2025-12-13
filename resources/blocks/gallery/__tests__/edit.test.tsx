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
    BlockControls: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    MediaPlaceholder: ({ onSelect }: any) => (
        <button data-testid="media-placeholder" onClick={() => onSelect([{ id: 1, url: 'image1.jpg' }])}>
            Add Gallery Images
        </button>
    ),
    MediaUpload: ({ render }: any) => render({ open: jest.fn() }),
    MediaUploadCheck: ({ children }: any) => <div>{children}</div>,
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
    ToolbarGroup: ({ children }: any) => <div>{children}</div>,
    ToolbarButton: ({ label, onClick }: any) => (
        <button onClick={onClick}>{label}</button>
    ),
}));

// Mock internal components
jest.mock('../components/devices', () => ({ device, renderFunction }: any) => (
    <div data-testid="devices">
        <button onClick={() => renderFunction('desktop')}>Desktop</button>
        <button onClick={() => renderFunction('tablet')}>Tablet</button>
        <button onClick={() => renderFunction('smartphone')}>Mobile</button>
    </div>
));

describe('Gallery Edit', () => {
    const defaultAttributes = {
        galleryId: '',
        images: null,
        colDevice: 'desktop',
        deskCol: 3,
        tabCol: 2,
        phoneCol: 1,
        gapDevice: 'desktop',
        deskGap: 10,
        tabGap: 10,
        phoneGap: 10,
        enableLightbox: false,
        imageHoverEffect: 'none',
        layout: 'masonry',
    };

    const defaultProps = {
        attributes: defaultAttributes,
        setAttributes: jest.fn(),
        clientId: 'test-client-id',
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render placeholder when no images', () => {
        render(<Edit {...defaultProps} />);
        
        expect(screen.getByTestId('media-placeholder')).toBeInTheDocument();
    });

    it('should select images', () => {
        render(<Edit {...defaultProps} />);
        
        const placeholder = screen.getByTestId('media-placeholder');
        fireEvent.click(placeholder);
        
        expect(defaultProps.setAttributes).toHaveBeenCalledWith({
            images: [{ id: 1, url: 'image1.jpg' }],
        });
    });

    it('should render images', () => {
        const props = {
            ...defaultProps,
            attributes: {
                ...defaultAttributes,
                images: [
                    { id: 1, url: 'image1.jpg', alt: 'Image 1' },
                    { id: 2, url: 'image2.jpg', alt: 'Image 2' },
                ],
            },
        };
        
        render(<Edit {...props} />);
        
        const images = document.getElementsByTagName('img');
        expect(images.length).toBe(2);
    });

    it('should change layout', () => {
        render(<Edit {...defaultProps} />);
        
        const select = screen.getByTestId('select-Layout');
        fireEvent.change(select, { target: { value: 'stacked' } });
        
        expect(defaultProps.setAttributes).toHaveBeenCalledWith({ layout: 'stacked' });
    });

    it('should toggle lightbox', () => {
        render(<Edit {...defaultProps} />);
        
        const toggle = screen.getByTestId('toggle-Enable Lightbox');
        fireEvent.click(toggle);
        
        expect(defaultProps.setAttributes).toHaveBeenCalledWith({ enableLightbox: true });
    });

    it('should change hover effect', () => {
        render(<Edit {...defaultProps} />);
        
        const select = screen.getByTestId('select-Image Hover Effect');
        fireEvent.change(select, { target: { value: 'zoom__in' } });
        
        expect(defaultProps.setAttributes).toHaveBeenCalledWith({ imageHoverEffect: 'zoom__in' });
    });
});
