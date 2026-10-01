/**
 * @jest-environment jsdom
 */

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Edit from '../edit';

// Mock WordPress dependencies
jest.mock('@wordpress/block-editor', () => ({
    useBlockProps: jest.fn((props) => props),
}));

jest.mock('@wordpress/components', () => ({
    Spinner: () => <div data-testid="spinner">Loading...</div>,
}));

// `jest.doMock` cannot swap the store here because `Edit` is imported before
// the test body runs, so the mock reads this mutable value at render time.
let mockSelectResult = {
    count: 0 as number,
    isTemplateEditor: false,
    isResolving: false,
};

jest.mock('@wordpress/data', () => ({
    useSelect: jest.fn(() => mockSelectResult),
}));

describe('SearchResultsCount Edit', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockSelectResult = {
            count: 0,
            isTemplateEditor: false,
            isResolving: false,
        };
    });

    it('should render the resolved count', () => {
        mockSelectResult = {
            count: 7,
            isTemplateEditor: false,
            isResolving: false,
        };

        const { container } = render(<Edit />);

        expect(screen.getByText('7')).toBeInTheDocument();
        // The block renders the number only, without a label.
        expect(container.textContent).toBe('7');
    });

    it('should show loading spinner when resolving', () => {
        mockSelectResult = {
            count: 0,
            isTemplateEditor: false,
            isResolving: true,
        };

        render(<Edit />);

        expect(screen.getByTestId('spinner')).toBeInTheDocument();
    });

    it('should display the placeholder count in template editor', () => {
        mockSelectResult = {
            count: 42,
            isTemplateEditor: true,
            isResolving: false,
        };

        render(<Edit />);

        expect(screen.getByText('42')).toBeInTheDocument();
    });

    it('should not render a spinner inside the template editor', () => {
        mockSelectResult = {
            count: 42,
            isTemplateEditor: true,
            isResolving: true,
        };

        render(<Edit />);

        expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
    });

    it('should display zero when no results', () => {
        mockSelectResult = {
            count: 0,
            isTemplateEditor: false,
            isResolving: false,
        };

        render(<Edit />);

        expect(screen.getByText('0')).toBeInTheDocument();
    });
});
