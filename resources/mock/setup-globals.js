/**
 * Setup globals for WooCommerce blocks
 * This file mocks the wcSettings global variable
 */

// Mock wcSettings global
global.wcSettings = {
  // Default settings
  stockStatusOptions: {
    instock: 'In stock',
    outofstock: 'Out of stock',
    onbackorder: 'On backorder'
  },
  hideOutOfStockItems: false,
  // Add other settings as needed
};

// Mock wc global
global.wc = {
  settings: global.wcSettings,
  // Add other WooCommerce globals as needed
};

// Mock window object if not available
if (typeof window === 'undefined') {
  global.window = {
    wc: global.wc,
    wcSettings: global.wcSettings
  };
} else {
  window.wc = global.wc;
  window.wcSettings = global.wcSettings;
}
