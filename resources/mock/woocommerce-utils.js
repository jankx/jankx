/**
 * Mock for @woocommerce/utils
 * This file provides mock implementations for WooCommerce utility functions
 */

// Mock objectOmit function
export const objectOmit = (obj, key) => {
  const { [key]: omitted, ...rest } = obj;
  return rest;
};

// Mock other utility functions as needed
export const formatPrice = (price, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(price);
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString();
};

// Export default
export default {
  objectOmit,
  formatPrice,
  formatDate
};
