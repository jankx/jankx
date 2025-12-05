/**
 * Unit tests for layout-renderer.ts
 */

import { renderPostItem, renderLayout, getLayoutStructure, getPostItemStructure } from '../layout-renderer';
import type { LayoutElement, LayoutStructure, PostItemStructure } from '../../../types/layout-structure';

// Setup global window mock
declare global {
    interface Window {
        jankxLayoutStructures?: {
            layouts?: Record<string, LayoutStructure>;
            postItem?: PostItemStructure | null;
        };
    }
}

describe('layout-renderer', () => {
    beforeEach(() => {
        // Reset mock data
        if (typeof window !== 'undefined') {
            (window as any).jankxLayoutStructures = {
                layouts: {},
                postItem: null,
            };
        } else {
            (global as any).window = {
                jankxLayoutStructures: {
                    layouts: {},
                    postItem: null,
                },
            };
        }
    });

    describe('renderPostItem', () => {
        const mockPostItemStructure: PostItemStructure = {
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

        const mockPostData = {
            id: 1,
            title: 'Test Post Title',
            date: '2024-01-01',
            excerpt: 'Test excerpt content',
            author: 'Test Author',
            featuredImage: '<img src="test.jpg" alt="Test" />',
            link: 'https://example.com/test-post',
        };

        it('should render post item with all elements', () => {
            const html = renderPostItem(mockPostItemStructure, mockPostData, {
                showFeaturedImage: true,
                showTitle: true,
                showDate: true,
                showAuthor: true,
                showExcerpt: true,
            });

            expect(html).toContain('post-thumbnail');
            expect(html).toContain('post-title');
            expect(html).toContain('post-meta');
            expect(html).toContain('post-date');
            expect(html).toContain('post-author');
            expect(html).toContain('post-excerpt');
            expect(html).toContain('post-content');
            expect(html).toContain('Test Post Title');
            expect(html).toContain('2024-01-01');
            expect(html).toContain('Test Author');
            expect(html).toContain('Test excerpt content');
        });

        it('should hide elements when options are false', () => {
            const html = renderPostItem(mockPostItemStructure, mockPostData, {
                showFeaturedImage: false,
                showTitle: false,
                showDate: false,
                showAuthor: false,
                showExcerpt: false,
            });

            expect(html).not.toContain('post-thumbnail');
            expect(html).not.toContain('post-title');
            expect(html).not.toContain('post-meta');
            expect(html).not.toContain('post-date');
            expect(html).not.toContain('post-author');
            expect(html).not.toContain('post-excerpt');
        });

        it('should wrap date and author in post-meta', () => {
            const html = renderPostItem(mockPostItemStructure, mockPostData, {
                showDate: true,
                showAuthor: true,
            });

            expect(html).toContain('<div class="post-meta">');
            expect(html).toContain('post-date');
            expect(html).toContain('post-author');
        });

        it('should handle thumbnail position correctly', () => {
            // Top position - title should be in content wrapper
            const htmlTop = renderPostItem(mockPostItemStructure, mockPostData, {
                showTitle: true,
                thumbnailPosition: 'top',
            });
            expect(htmlTop).toContain('post-content');
            expect(htmlTop.indexOf('post-title')).toBeGreaterThan(htmlTop.indexOf('post-thumbnail'));

            // Left position - title should be outside content wrapper
            const htmlLeft = renderPostItem(mockPostItemStructure, mockPostData, {
                showTitle: true,
                thumbnailPosition: 'left',
            });
            expect(htmlLeft.indexOf('post-title')).toBeLessThan(htmlLeft.indexOf('post-content'));
        });
    });

    describe('renderLayout', () => {
        const mockLayoutStructure: LayoutStructure = {
            layout: 'grid',
            container: {
                tag: 'ul',
                classes: ['post-type-layout-grid', 'columns-3'],
                styles: {
                    '--columns-desktop': '3',
                },
            },
            itemWrapper: {
                tag: 'li',
                classes: ['post-item'],
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

        const mockPostItemStructure: PostItemStructure = {
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

        it('should render layout with posts', () => {
            const posts = [
                { id: 1, title: 'Post 1' },
                { id: 2, title: 'Post 2' },
            ];

            const html = renderLayout(mockLayoutStructure, posts, mockPostItemStructure, {
                showTitle: true,
            });

            expect(html).toContain('post-type-layout-grid');
            expect(html).toContain('<ul');
            expect(html).toContain('<li');
            expect(html).toContain('post-1');
            expect(html).toContain('post-2');
            expect(html).toContain('Post 1');
            expect(html).toContain('Post 2');
        });

        it('should render empty state when no posts', () => {
            const html = renderLayout(mockLayoutStructure, [], mockPostItemStructure);

            expect(html).toContain('post-layout-no-results');
            expect(html).toContain('No posts found.');
            expect(html).not.toContain('<ul');
        });

        it('should replace post-id placeholder', () => {
            const posts = [{ id: 123, title: 'Test' }];
            const html = renderLayout(mockLayoutStructure, posts, mockPostItemStructure);

            expect(html).toContain('id="post-123"');
            expect(html).not.toContain('{{post-id}}');
        });

        it('should render without itemWrapper if not provided', () => {
            const structureWithoutWrapper: LayoutStructure = {
                ...mockLayoutStructure,
                itemWrapper: undefined,
            };

            const posts = [{ id: 1, title: 'Test' }];
            const html = renderLayout(structureWithoutWrapper, posts, mockPostItemStructure);

            expect(html).toContain('post-type-layout-grid');
            expect(html).not.toContain('<li');
        });
    });

    describe('getLayoutStructure', () => {
        it('should return layout structure from window object', () => {
            const mockStructure: LayoutStructure = {
                layout: 'grid',
                container: {
                    tag: 'div',
                    classes: ['test-container'],
                },
            };

            const win = (global as any).window || {};
            if (!win.jankxLayoutStructures) {
                win.jankxLayoutStructures = {};
            }
            if (!win.jankxLayoutStructures.layouts) {
                win.jankxLayoutStructures.layouts = {};
            }
            win.jankxLayoutStructures.layouts.grid = mockStructure;

            const result = getLayoutStructure('grid');
            expect(result).toEqual(mockStructure);
        });

        it('should return null if layout not found', () => {
            const result = getLayoutStructure('nonexistent');
            expect(result).toBeNull();
        });

        it('should return null if structures object is missing', () => {
            const win = (global as any).window || {};
            win.jankxLayoutStructures = null;
            const result = getLayoutStructure('grid');
            expect(result).toBeNull();
        });
    });

    describe('getPostItemStructure', () => {
        it('should return post item structure from window object', () => {
            const mockStructure: PostItemStructure = {
                title: {
                    tag: 'h3',
                    classes: ['post-title'],
                },
            };

            const win = (global as any).window || {};
            if (!win.jankxLayoutStructures) {
                win.jankxLayoutStructures = {};
            }
            win.jankxLayoutStructures.postItem = mockStructure;

            const result = getPostItemStructure();
            expect(result).toEqual(mockStructure);
        });

        it('should return null if postItem not found', () => {
            const win = (global as any).window || {};
            if (!win.jankxLayoutStructures) {
                win.jankxLayoutStructures = {};
            }
            win.jankxLayoutStructures.postItem = null;
            const result = getPostItemStructure();
            expect(result).toBeNull();
        });
    });
});
