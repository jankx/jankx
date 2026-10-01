/**
 * @jest-environment jsdom
 */

import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
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

// `jest.doMock` cannot swap the store here because `Edit` is imported before
// the test body runs, so the mock reads this mutable value at render time.
let mockSelectResult = {
    commentCount: 5 as number | null,
    isTemplateEditor: false,
    isResolving: false,
};

jest.mock('@wordpress/data', () => ({
    useSelect: jest.fn(() => mockSelectResult),
}));

describe('CommentCount Edit', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockSelectResult = {
            commentCount: 5,
            isTemplateEditor: false,
            isResolving: false,
        };
    });

    it('should render comment count', () => {
        render(<Edit />);

        expect(screen.getByText(/5/)).toBeInTheDocument();
    });

    it('should show loading spinner when resolving', () => {
        mockSelectResult = {
            commentCount: null,
            isTemplateEditor: false,
            isResolving: true,
        };

        render(<Edit />);

        expect(screen.getByTestId('spinner')).toBeInTheDocument();
    });

    it('should display placeholder count in template editor', () => {
        mockSelectResult = {
            commentCount: null,
            isTemplateEditor: true,
            isResolving: false,
        };

        render(<Edit />);

        expect(screen.getByText(/12/)).toBeInTheDocument();
    });

    it('should display zero when no comments', () => {
        mockSelectResult = {
            commentCount: 0,
            isTemplateEditor: false,
            isResolving: false,
        };

        render(<Edit />);

        expect(screen.getByText(/0/)).toBeInTheDocument();
    });
});
