// Utility functions for editor components

export const getProducts = async (query = {}) => {
  // Mock implementation
  return {
    products: [],
    total: 0,
    totalPages: 0,
    currentPage: 1
  };
};

export const formatPrice = (price, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(price);
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

