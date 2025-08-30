/**
 * Mock for @woocommerce/settings
 * This file provides mock implementations for WooCommerce settings functions
 */

// Mock wcSettings global
const wcSettings = {
  // Default settings
  stockStatusOptions: {
    instock: 'In stock',
    outofstock: 'Out of stock',
    onbackorder: 'On backorder'
  },
  hideOutOfStockItems: false,
  // Add other settings as needed
};

// Mock getSetting function
export const getSetting = (key, defaultValue = null) => {
  return wcSettings[key] !== undefined ? wcSettings[key] : defaultValue;
};

// Mock hasSetting function
export const hasSetting = (key) => {
  return wcSettings[key] !== undefined;
};

// Mock setSetting function
export const setSetting = (key, value) => {
  wcSettings[key] = value;
};

// Export default
export default {
  getSetting,
  hasSetting,
  setSetting,
  wcSettings
};
