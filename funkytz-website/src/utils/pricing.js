export const getActualPrice = (product) => {
  if (product.haveDiscount && product.discountPercentage) {
    return Math.round(product.price - (product.price * product.discountPercentage) / 100);
  }
  return product.price;
};
