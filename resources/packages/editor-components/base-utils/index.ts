// Base Utils
export const formatPrice = (price: number) => {
  return `$${price.toFixed(2)}`;
};

export const formatDate = (date: Date) => {
  return date.toLocaleDateString();
};
