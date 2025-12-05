/**
 * Integration tests to ensure JavaScript render matches PHP output structure
 */

import { renderPostItem, renderLayout } from '../layout-renderer';
import type { LayoutStructure, PostItemStructure } from '../../../types/layout-structure';

// Setup window mock for tests
if (typeof window !== 'undefined') {
    (window as any).jankxLayoutStructures = {
        layouts: {},
        postItem: null,
    };
}

describe('Layout Renderer Integration Tests', () => {
    describe('Post Item Structure Matching PHP', () => {
        const phpMatchingStructure: PostItemStructure = {
            featuredImage: {
                tag: 'div',
                classes: ['post-thumbnail'],
                children: [
                    {
                        tag: 'a',
                        attributes: { href: '#', 'aria-hidden': 'true', tabindex: '-1' },
                        children: [
                            {
                                tag: 'span',
                                classes: ['aspect-ratio-container'],
                                children: [
                                    {
                                        tag: 'img',
                                        attributes: { src: '', alt: '' },
                                        placeholder: 'featured-image',
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
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
            date: {
                tag: 'span',
                classes: ['post-date'],
                children: [
                    {
                        tag: 'time',
                        attributes: { datetime: '' },
                        placeholder: 'post-date',
                    },
                ],
            },
            author: {
                tag: 'span',
                classes: ['post-author'],
                placeholder: 'post-author',
            },
            metaWrapper: {
                tag: 'div',
                classes: ['post-meta'],
            },
            excerpt: {
                tag: 'div',
                classes: ['post-excerpt'],
                placeholder: 'post-excerpt',
            },
            contentWrapper: {
                tag: 'div',
                classes: ['post-content'],
            },
        };

        it('should match PHP renderPostItem structure - all elements', () => {
            const postData = {
                id: 1,
                title: 'Test Post',
                date: '2024-01-01',
                excerpt: 'Test excerpt',
                author: 'Test Author',
                featuredImage: '<img src="test.jpg" alt="Test" />',
            };

            const html = renderPostItem(phpMatchingStructure, postData, {
                showFeaturedImage: true,
                showTitle: true,
                showDate: true,
                showAuthor: true,
                showExcerpt: true,
                thumbnailPosition: 'top',
            });

            // Should match PHP structure:
            // <article class="post-item thumbnail-position-top has-thumbnail">
            //   <div class="post-thumbnail">...</div>
            //   <div class="post-content">
            //     <h3 class="post-title">...</h3>
            //     <div class="post-meta">
            //       <span class="post-date">...</span>
            //       <span class="post-author">...</span>
            //     </div>
            //     <div class="post-excerpt">...</div>
            //   </div>
            // </article>

            expect(html).toContain('post-thumbnail');
            expect(html).toContain('aspect-ratio-container');
            expect(html).toContain('post-content');
            expect(html).toContain('post-title');
            expect(html).toContain('post-meta');
            expect(html).toContain('post-date');
            expect(html).toContain('post-author');
            expect(html).toContain('post-excerpt');
        });

        it('should match PHP structure order - thumbnail top', () => {
            const postData = {
                id: 1,
                title: 'Test',
                featuredImage: '<img src="test.jpg" />',
            };

            const html = renderPostItem(phpMatchingStructure, postData, {
                showFeaturedImage: true,
                showTitle: true,
                thumbnailPosition: 'top',
            });

            // Thumbnail should come before content wrapper
            const thumbnailIndex = html.indexOf('post-thumbnail');
            const contentIndex = html.indexOf('post-content');
            expect(thumbnailIndex).toBeLessThan(contentIndex);
        });

        it('should match PHP structure order - thumbnail left', () => {
            const postData = {
                id: 1,
                title: 'Test',
                featuredImage: '<img src="test.jpg" />',
            };

            const html = renderPostItem(phpMatchingStructure, postData, {
                showFeaturedImage: true,
                showTitle: true,
                thumbnailPosition: 'left',
            });

            // Title should come before content wrapper when thumbnail is left
            const titleIndex = html.indexOf('post-title');
            const contentIndex = html.indexOf('post-content');
            expect(titleIndex).toBeLessThan(contentIndex);
        });
    });

    describe('Grid Layout Structure Matching PHP', () => {
        const gridStructure: LayoutStructure = {
            layout: 'grid',
            container: {
                tag: 'ul',
                classes: ['post-type-layout-grid', 'columns-3'],
                styles: {
                    '--columns-desktop': '3',
                    '--columns-tablet': '2',
                    '--columns-mobile': '1',
                },
                attributes: {
                    'data-layout': 'grid',
                },
            },
            itemWrapper: {
                tag: 'li',
                classes: ['post-item', 'thumbnail-position-top', 'has-thumbnail'],
                attributes: {
                    id: 'post-{{post-id}}',
                },
            },
            emptyState: {
                tag: 'div',
                classes: ['post-layout-no-results'],
                text: 'No posts found.',
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
            contentWrapper: {
                tag: 'div',
                classes: ['post-content'],
            },
        };

        it('should match PHP GridLayout renderDefault structure', () => {
            const posts = [
                { id: 1, title: 'Post 1' },
                { id: 2, title: 'Post 2' },
                { id: 3, title: 'Post 3' },
            ];

            const html = renderLayout(gridStructure, posts, postItemStructure, {
                showTitle: true,
            });

            // Should match PHP structure:
            // <ul class="post-type-layout-grid columns-3">
            //   <li class="post-item thumbnail-position-top has-thumbnail" id="post-1">...</li>
            //   <li class="post-item thumbnail-position-top has-thumbnail" id="post-2">...</li>
            //   <li class="post-item thumbnail-position-top has-thumbnail" id="post-3">...</li>
            // </ul>

            expect(html).toContain('<ul');
            expect(html).toContain('post-type-layout-grid');
            expect(html).toContain('columns-3');
            expect(html).toContain('<li');
            expect(html).toContain('post-item');
            expect(html).toContain('id="post-1"');
            expect(html).toContain('id="post-2"');
            expect(html).toContain('id="post-3"');
        });

        it('should include CSS variables in container', () => {
            const posts = [{ id: 1, title: 'Test' }];
            const html = renderLayout(gridStructure, posts, postItemStructure);

            expect(html).toContain('--columns-desktop');
            expect(html).toContain('--columns-tablet');
            expect(html).toContain('--columns-mobile');
        });
    });

    describe('List Layout Structure Matching PHP', () => {
        const listStructure: LayoutStructure = {
            layout: 'list',
            container: {
                tag: 'div',
                classes: ['post-type-layout-list'],
                attributes: {
                    'data-layout': 'list',
                },
            },
            itemWrapper: {
                tag: 'article',
                classes: ['post-item', 'thumbnail-position-top'],
                attributes: {
                    id: 'post-{{post-id}}',
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
            contentWrapper: {
                tag: 'div',
                classes: ['post-content'],
            },
        };

        it('should match PHP ListLayout renderDefault structure', () => {
            const posts = [
                { id: 1, title: 'Post 1' },
                { id: 2, title: 'Post 2' },
            ];

            const html = renderLayout(listStructure, posts, postItemStructure, {
                showTitle: true,
            });

            // Should match PHP structure:
            // <div class="post-type-layout-list">
            //   <article class="post-item thumbnail-position-top" id="post-1">...</article>
            //   <article class="post-item thumbnail-position-top" id="post-2">...</article>
            // </div>

            expect(html).toContain('<div');
            expect(html).toContain('post-type-layout-list');
            expect(html).toContain('<article');
            expect(html).toContain('post-item');
            expect(html).toContain('id="post-1"');
            expect(html).toContain('id="post-2"');
        });
    });

    describe('Dynamic Columns Update', () => {
        it('should update columns in container structure', () => {
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
                    attributes: { id: '{{post-id}}' },
                },
            };

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
                { id: 1, title: 'Post 1', date: '2024-01-01' },
                { id: 2, title: 'Post 2', date: '2024-01-02' },
            ];

            const html = renderLayout(updatedStructure, posts, phpMatchingStructure, {
                showTitle: true,
                showDate: true,
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
            const structure: LayoutStructure = {
                layout: 'grid',
                container: {
                    tag: 'ul',
                    classes: [
                        'post-type-layout-grid',
                        'wp-block-jankx-post-layout-template',
                        'is-flex-container',
                        'columns-3',
                    ],
                    styles: {
                        '--columns-desktop': '3',
                    },
                },
                itemWrapper: {
                    tag: 'li',
                    classes: ['post-item'],
                },
            };

            const updatedStructure: LayoutStructure = {
                ...structure,
                container: {
                    ...structure.container,
                    classes: [
                        ...(structure.container.classes || []).filter((cls: string) => 
                            !cls.startsWith('columns-')
                        ),
                        'columns-4',
                    ],
                    styles: {
                        ...(structure.container.styles || {}),
                        '--columns-desktop': '4',
                    },
                },
            };

            const posts = [{ id: 1, title: 'Post 1' }];
            const html = renderLayout(updatedStructure, posts, phpMatchingStructure, {
                showTitle: true,
            });

            // Should preserve other classes
            expect(html).toContain('post-type-layout-grid');
            expect(html).toContain('wp-block-jankx-post-layout-template');
            expect(html).toContain('is-flex-container');
            
            // Should have new columns
            expect(html).toContain('columns-4');
        });
    });

    describe('Empty State Matching PHP', () => {
        const structure: LayoutStructure = {
            layout: 'grid',
            container: {
                tag: 'div',
                classes: ['test-container'],
            },
            emptyState: {
                tag: 'div',
                classes: ['post-layout-no-results'],
                text: 'No posts found.',
            },
        };

        it('should render empty state when no posts', () => {
            const html = renderLayout(structure, [], {
                title: { tag: 'h3', classes: ['post-title'] },
            });

            expect(html).toContain('post-layout-no-results');
            expect(html).toContain('No posts found.');
        });
    });
});
