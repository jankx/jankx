/**
 * @jest-environment jsdom
 */

import { render, screen, waitFor } from '@testing-library/react';
import Edit from '../edit';

// Mock WordPress dependencies
jest.mock('@wordpress/block-editor', () => ({
    useBlockProps: jest.fn((props) => props),
}));

jest.mock('@wordpress/components', () => ({
    Spinner: () => <div data-testid="spinner">Loading...</div>,
}));

const mockPost = {
    id: 123,
    type: 'post',
    comment_count: '5',
};

jest.mock('@wordpress/data', () => ({
    useSelect: jest.fn(() => ({
        commentCount: 5,
        isTemplateEditor: false,
        isResolving: false,
    })),
}));

describe('CommentCount Edit', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render comment count', () => {
        render(<Edit />);

        expect(screen.getByText(/5/)).toBeInTheDocument();
    });

    it('should show loading spinner when resolving', () => {
        jest.doMock('@wordpress/data', () => ({
            useSelect: jest.fn(() => ({
                commentCount: null,
                isTemplateEditor: false,
                isResolving: true,
            })),
        }));

        render(<Edit />);

        expect(screen.getByTestId('spinner')).toBeInTheDocument();
    });

    it('should display placeholder count in template editor', () => {
        jest.doMock('@wordpress/data', () => ({
            useSelect: jest.fn(() => ({
                commentCount: null,
                isTemplateEditor: true,
                isResolving: false,
            })),
        }));

        render(<Edit />);

        expect(screen.getByText(/12/)).toBeInTheDocument();
    });

    it('should display zero when no comments', () => {
        jest.doMock('@wordpress/data', () => ({
            useSelect: jest.fn(() => ({
                commentCount: 0,
                isTemplateEditor: false,
                isResolving: false,
            })),
        }));

        render(<Edit />);

        expect(screen.getByText(/0/)).toBeInTheDocument();
    });
});
