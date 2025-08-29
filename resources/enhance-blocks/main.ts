/**
 * Main Entry Point for Block Enhancements
 * Import and initialize all block filters and frontend enhancements
 */

// Import all filters
import './filters/product-collection';
import './filters/product-grid';
import './filters/product-carousel';

// Import frontend enhancements
import './frontend/product-collection';
import './frontend/product-grid';

// Initialize all enhancements
console.log('Jankx Block Enhancements loaded successfully!');

// Export for use in other files
export * from './filters/product-collection';
export * from './filters/product-grid';
export * from './filters/product-carousel';
export * from './frontend/product-collection';
export * from './frontend/product-grid';
