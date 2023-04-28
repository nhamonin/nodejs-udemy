const fs = require('fs');
const path = require('path');
const rootDir = require('../util/path');

module.exports = class Cart {
  static filePath = path.join(rootDir, 'data', 'cart.json');

  static async addProduct(id, productPrice) {
    const cart = await Cart.fetchCart();
    const existingProductIndex = cart.products.findIndex((product) => product.id === id);
    const existingProduct = cart.products[existingProductIndex];
    let updatedProduct;
    if (existingProduct) {
      updatedProduct = { ...existingProduct, quantity: existingProduct.quantity + 1 };
      cart.products = [...cart.products];
      cart.products[existingProductIndex] = updatedProduct;
    } else {
      updatedProduct = { id, quantity: 1 };
      cart.products = [...cart.products, updatedProduct];
    }
    cart.totalPrice += productPrice;

    await fs.promises.writeFile(Cart.filePath, JSON.stringify(cart));
  }

  static async fetchCart() {
    try {
      const buffer = await fs.promises.readFile(Cart.filePath);
      return JSON.parse(buffer.toString());
    } catch (e) {
      return { products: [], totalPrice: 0 };
    }
  }
};
