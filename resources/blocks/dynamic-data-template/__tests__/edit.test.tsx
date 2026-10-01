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
    BlockContextProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    MediaUpload: () => null,
    store: 'core/block-editor',
}));

jest.mock('@wordpress/i18n', () => ({
    __: (text: string) => text,
}));

// This control ships in the Composer package under ../../vendor, which resolves
// its own `@wordpress/*` copies and would drag the real editor runtime in. It is
// only rendered for the item background panel, which these tests do not open.
jest.mock(
    '@jankx/gutenberg-controls/controls/ResponsiveAspectRatioControl',
    () => ({
        __esModule: true,
        default: ({ label, value, onChange }: any) => (
            <div data-testid={`ratio-${ label }`}>
                <button onClick={() => onChange('16/9')}>set 16/9</button>
            </div>
        ),
    }),
    { virtual: true }
);

// edit.tsx only needs the store *name* from core-data. Stubbing the module
// avoids loading the real one, which registers reducers through
// `@wordpress/data` helpers that are stubbed out below.
jest.mock('@wordpress/core-data', () => ({
    store: 'core',
}));

const mockReplaceInnerBlocks = jest.fn();

jest.mock('@wordpress/data', () => {
    /**
     * The real `@wordpress/data` cannot be loaded here (pnpm's store is missing
     * transitive deps of @wordpress/i18n), so the module is stubbed wholesale.
     * On top of the selectors below, `@wordpress/blocks` builds its store the
     * moment it is imported, so the registration helpers have to exist too.
     */
    const identityReducer = ( state = {} ) => state;

    /**
     * A permissive stand-in for any registered store. `createBlock` consults the
     * blocks store to look up a block type, so `getBlockType` has to report a
     * type rather than nothing.
     */
    const storeSelectors = {
        getBlockType: ( name: string ) => ( { name, attributes: {} } ),
        getBlockTypes: () => [],
        hasBlockType: () => true,
    };

    /**
     * `@wordpress/blocks` calls `unlock(store).registerPrivateSelectors()` on the
     * object `createReduxStore` hands back, so the stub has to return a
     * genuinely locked store. `lock`/`unlock` keep their bookkeeping in a
     * module-private WeakMap, and the store holds two copies of
     * @wordpress/private-apis (0.40.0 via @wordpress/data, 1.38.0 via
     * @wordpress/blocks), so this has to resolve exactly what
     * @wordpress/blocks itself resolves.
     */
    const { createRequire } = require( 'module' );
    const requireFromBlocks = createRequire( require.resolve( '@wordpress/blocks' ) );
    const { lock } = requireFromBlocks( '@wordpress/private-apis' )
        .__dangerousOptInToUnstableAPIsOnlyForCoreModules(
            'I acknowledge private features are not for use in themes or plugins and doing so will break in the next version of WordPress.',
            '@wordpress/data'
        );

    return {
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
            if (scope === 'core') {
                return {
                    // Still resolving, so edit.tsx falls back to rendering one
                    // item per requested page: the first is the editable one
                    // and the remaining two are the previews the test counts.
                    getEntityRecords: () => [],
                    hasFinishedResolution: () => false,
                };
            }
            return {};
        })),
        useDispatch: jest.fn(() => ({
            replaceInnerBlocks: mockReplaceInnerBlocks,
        })),
        select: () => storeSelectors,
        combineReducers: (...reducers) => identityReducer,
        createReduxStore: ( name, options = {} ) => {
            const store = { name, ...options };
            lock( store, {
                registerPrivateSelectors: () => {},
                registerPrivateActions: () => {},
            } );
            return store;
        },
        createSelector: (selector) => selector,
        createRegistrySelector: (selector) => selector,
        createRegistryControl: (control) => control,
        createRegistry: () => ({}),
        registerStore: () => {},
        register: () => {},
        registerCoreStore: () => {},
        resolveSelect: () => ({}),
        suspendSelect: () => ({}),
        useRegistry: () => ({}),
        withSelect: () => (component) => component,
        withDispatch: () => (component) => component,
    };
});

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
    Button: ({ children, onClick, disabled, label, className }: any) => (
        <button onClick={onClick} disabled={disabled} className={className}>
            {children ?? label}
        </button>
    ),
    Tooltip: ({ children }: any) => <>{children}</>,
    FocalPointPicker: () => <div data-testid="focal-point-picker" />,
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

    it('should change template layout', () => {
        const { container } = render(<Edit {...defaultProps} />);

        // The layout chooser is a button group, not a select.
        const layoutButtons = container.querySelectorAll(
            '.jankx-layout-chooser__button'
        );
        expect(layoutButtons.length).toBe(5);

        // Second option is "boxed".
        fireEvent.click(layoutButtons[1]);

        expect(defaultProps.setAttributes).toHaveBeenCalledWith({
            templateLayout: 'boxed',
        });
    });

    it('should toggle item border', () => {
        render(<Edit {...defaultProps} />);

        const toggle = screen.getByTestId('toggle-Show Item Border');
        fireEvent.click(toggle);

        expect(defaultProps.setAttributes).toHaveBeenCalledWith({ showItemBorder: true });
    });

    it('should render carousel navigation', () => {
        const props = {
            ...defaultProps,
            context: {
                ...defaultContext,
                displayLayout: 'carousel',
                showArrows: true,
            },
        };

        render(<Edit {...props} />);

        expect(screen.getByLabelText('Previous slide')).toBeInTheDocument();
        expect(screen.getByLabelText('Next slide')).toBeInTheDocument();
    });

    it('should not render the item background ratio by default', () => {
        render(<Edit {...defaultProps} />);

        expect(screen.queryByTestId('ratio-Aspect Ratio')).not.toBeInTheDocument();
    });

    it('should update the item background ratio when a background is enabled', () => {
        const props = {
            ...defaultProps,
            attributes: {
                ...defaultAttributes,
                itemBgType: 'image',
            },
        };

        render(<Edit {...props} />);

        fireEvent.click(screen.getByText('set 16/9'));

        expect(defaultProps.setAttributes).toHaveBeenCalledWith({ itemBgRatio: '16/9' });
    });
});
