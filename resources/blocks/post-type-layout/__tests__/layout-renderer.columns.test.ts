/**
 * Unit tests for dynamic columns update in layout-renderer.ts
 * 
 * Tests that container structure can be updated with dynamic columns
 */

import { renderLayout } from '../layout-renderer';
import type { LayoutStructure, PostItemStructure } from '../../../types/layout-structure';

describe('layout-renderer - Dynamic Columns', () => {
    describe('renderLayout with updated columns', () => {
        const baseStructure: LayoutStructure = {
            layout: 'grid',
            container: {
                tag: 'ul',
                classes: ['post-type-layout-grid', 'columns-3'],
                styles: {
                    '--columns-desktop': '3',
                    '--columns-tablet': '2',
                    '--columns-mobile': '1',
                },
            },
            itemWrapper: {
                tag: 'li',
                classes: ['post-item'],
                attributes: {
                    id: '{{post-id}}',
                },
            },
        };

        const postItemStructure: PostItemStructure = {
            title: {
                tag: 'h3',
                classes: ['post-title'],
                children: [
                    {
                        tag: 'a',
                        attributes: { href: '#' },
                        placeholder: 'post-title',
                    },
                ],
            },
        };

        it('should render with default columns from structure', () => {
            const posts = [
                { id: 1, title: 'Post 1' },
                { id: 2, title: 'Post 2' },
            ];

            const html = renderLayout(baseStructure, posts, postItemStructure, {
                showTitle: true,
            });

            expect(html).toContain('columns-3');
            expect(html).toContain('--columns-desktop: 3');
            expect(html).toContain('--columns-tablet: 2');
            expect(html).toContain('--columns-mobile: 1');
        });

        it('should update container classes when columns change', () => {
            // Simulate updating structure with new columns (like in index.tsx)
            const updatedStructure: LayoutStructure = {
                ...baseStructure,
                container: {
                    ...baseStructure.container,
                    classes: [
                        ...(baseStructure.container.classes || []).filter((cls: string) => 
                            !cls.startsWith('columns-')
                        ),
                        'columns-5',
                        'columns-tablet-3',
                        'columns-mobile-2',
                    ],
                    styles: {
                        ...(baseStructure.container.styles || {}),
                        '--columns-desktop': '5',
                        '--columns-tablet': '3',
                        '--columns-mobile': '2',
                    },
                },
            };

            const posts = [
                { id: 1, title: 'Post 1' },
                { id: 2, title: 'Post 2' },
            ];

            const html = renderLayout(updatedStructure, posts, postItemStructure, {
                showTitle: true,
            });

            // Should have new columns
            expect(html).toContain('columns-5');
            expect(html).toContain('columns-tablet-3');
            expect(html).toContain('columns-mobile-2');
            expect(html).toContain('--columns-desktop: 5');
            expect(html).toContain('--columns-tablet: 3');
            expect(html).toContain('--columns-mobile: 2');

            // Should not have old columns
            expect(html).not.toContain('columns-3');
        });

        it('should preserve other container classes when updating columns', () => {
            const structureWithMoreClasses: LayoutStructure = {
                ...baseStructure,
                container: {
                    ...baseStructure.container,
                    classes: [
                        'post-type-layout-grid',
                        'wp-block-jankx-post-layout-template',
                        'is-flex-container',
                        'columns-3',
                    ],
                },
            };

            const updatedStructure: LayoutStructure = {
                ...structureWithMoreClasses,
                container: {
                    ...structureWithMoreClasses.container,
                    classes: [
                        ...(structureWithMoreClasses.container.classes || []).filter((cls: string) => 
                            !cls.startsWith('columns-')
                        ),
                        'columns-4',
                        'columns-tablet-2',
                        'columns-mobile-1',
                    ],
                },
            };

            const posts = [{ id: 1, title: 'Post 1' }];
            const html = renderLayout(updatedStructure, posts, postItemStructure, {
                showTitle: true,
            });

            // Should preserve other classes
            expect(html).toContain('post-type-layout-grid');
            expect(html).toContain('wp-block-jankx-post-layout-template');
            expect(html).toContain('is-flex-container');
            
            // Should have new columns
            expect(html).toContain('columns-4');
            
            // Should not have old columns
            expect(html).not.toContain('columns-3');
        });

        it('should handle columns update for list layout', () => {
            const listStructure: LayoutStructure = {
                layout: 'list',
                container: {
                    tag: 'div',
                    classes: ['post-type-layout-list', 'columns-1'],
                    styles: {
                        '--columns-desktop': '1',
                    },
                },
            };

            const updatedStructure: LayoutStructure = {
                ...listStructure,
                container: {
                    ...listStructure.container,
                    classes: [
                        ...(listStructure.container.classes || []).filter((cls: string) => 
                            !cls.startsWith('columns-')
                        ),
                        'columns-2',
                    ],
                    styles: {
                        ...(listStructure.container.styles || {}),
                        '--columns-desktop': '2',
                    },
                },
            };

            const posts = [{ id: 1, title: 'Post 1' }];
            const html = renderLayout(updatedStructure, posts, postItemStructure, {
                showTitle: true,
            });

            expect(html).toContain('columns-2');
            expect(html).toContain('--columns-desktop: 2');
            expect(html).not.toContain('columns-1');
        });
    });
});
