/**
 * Jest setup file for layout-renderer tests
 */

// Mock window object for tests
if (typeof window !== 'undefined') {
    (window as any).jankxLayoutStructures = {
        layouts: {},
        postItem: null,
    };
}
