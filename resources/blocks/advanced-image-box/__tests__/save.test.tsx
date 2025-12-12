/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render } from '@testing-library/react';
import Save from '../save';

// Mock WordPress dependencies for save component
jest.mock('@wordpress/block-editor', () => ({
    useBlockProps: jest.fn((props) => props),
    InnerBlocks: {
        Content: () => <div data-testid="inner-blocks">Inner Blocks Content</div>
    },
    RichText: {
        Content: ({ value }: { value: string }) => <figcaption>{value}</figcaption>
    },
    __experimentalGetBorderClassesAndStyles: jest.fn(() => ({ className: '', style: {} })),
    __experimentalGetShadowClassesAndStyles: jest.fn(() => ({ className: '', style: {} })),
}));

describe('AdvancedImageBox Save', () => {
    it('should not render preset frame wrapper - server injects it', () => {
        const attributes = {
            url: 'https://example.com/photo.jpg',
            alt: 'Alt text',
            title: 'Title',
            id: 123,
            preset: 'bordered-frame',
            presetOptions: {
                borderWidth: 4,
                borderColor: '#ffffff',
            },
            showOverlayOnHover: false,
            overlayBackground: 'rgba(0,0,0,0.5)',
            overlayOpacity: 1,
            imageHoverEffect: 'none',
            caption: 'Caption',
        } as any;

        const { container } = render(<Save attributes={attributes} className="wp-block-jankx-advanced-image-box" />);

        // The save output should not include the frame wrapper because it's injected server-side
        const frameWrappers = container.querySelectorAll('.wp-block-jankx-advanced-image-box__frame-wrapper');
        expect(frameWrappers.length).toBe(0);
    });
});
