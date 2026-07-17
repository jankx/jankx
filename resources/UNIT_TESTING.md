# Unit Testing Documentation

This project uses **Jest** and **React Testing Library** for unit testing WordPress blocks. The testing environment is configured using `@wordpress/scripts`.

## Prerequisites

Ensure all dependencies are installed:

```bash
cd resources
npm install
```

## Running Tests

### Run All Unit Tests

To run all unit tests in the `resources` directory:

```bash
npm run test:unit
```

### Run Tests for a Specific Block

To run tests for a specific block (e.g., `star-rating`):

```bash
npm run test:unit blocks/star-rating/__tests__/edit.test.tsx
```

### Run Tests in Watch Mode

To run tests in watch mode (re-runs tests when files change):

```bash
npm run test:unit -- --watch
```

## Writing Tests

### File Structure

Tests should be located in a `__tests__` directory inside the block's folder. The test file should be named `edit.test.tsx` (for the Edit component) or `index.test.tsx`.

Example structure:
```
resources/blocks/my-block/
├── __tests__/
│   └── edit.test.tsx
├── edit.tsx
├── index.tsx
└── ...
```

### Basic Test Example

Here is a basic example of a test file for a block's Edit component:

```tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Edit from '../edit';

// Mock WordPress dependencies
jest.mock('@wordpress/block-editor', () => ({
    useBlockProps: jest.fn((props) => props),
    InspectorControls: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock('@wordpress/i18n', () => ({
    __: (text: string) => text,
}));

describe('MyBlock Edit', () => {
    const defaultProps = {
        attributes: {
            // ...default attributes
        },
        setAttributes: jest.fn(),
        clientId: 'test-client-id',
    };

    it('should render correctly', () => {
        render(<Edit {...defaultProps} />);
        
        // Check if main element is present
        expect(screen.getByText(/My Block Title/i)).toBeInTheDocument();
    });
});
```

### Mocking Dependencies

WordPress blocks often rely on globals or other packages. You usually need to mock these.

#### Mocking `@wordpress/element` (React)

Often needed if you use hooks like `useState`, `useEffect`, `useRef`.

```tsx
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
```

#### Mocking `@wordpress/block-editor`

```tsx
jest.mock('@wordpress/block-editor', () => ({
    useBlockProps: jest.fn((props) => props),
    InspectorControls: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    InnerBlocks: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
    store: 'core/block-editor',
}));
```

#### Mocking `@wordpress/data` (Redux-like store)

```tsx
jest.mock('@wordpress/data', () => ({
    useSelect: jest.fn((callback) => {
        // Mock return value for selectors
        return callback((store: string) => {
            if (store === 'core/block-editor') {
                return {
                    // Mock store selectors
                };
            }
            return {};
        });
    }),
    useDispatch: jest.fn(() => ({
        // Mock dispatch actions
    })),
}));
```

#### Mocking `window.wp` or Globals

If your block uses `window.wp.apiFetch` or global variables:

```tsx
// In your test file or setup
global.window.wp = {
    apiFetch: jest.fn().mockResolvedValue({}),
};

// Mock other globals
global.jankxQueryOptions = {
    queryPresets: [],
};
```

## Troubleshooting

-   **"React is not defined"**: Ensure you import React in your test file, or check your `@wordpress/element` mock.
-   **"TypeError: window.matchMedia is not a function"**: Jest runs in JSDOM which doesn't implement `matchMedia`. You may need to mock it in `setupTests.ts` or at the top of your test file.
-   **"Invariant Violation"**: Often happens when using `useSelect` or other hooks outside of a provider, or when mocks are incomplete.

## Coverage

To see test coverage:

```bash
npm run test:unit -- --coverage
```
