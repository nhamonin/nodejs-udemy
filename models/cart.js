const fs = require('fs');
const path = require('path');
const rootDir = require('../util/path');

module.exports = class Cart {
  static filePath = path.join(rootDir, 'data', 'cart.json');

  static async addProduct(id, productPrice) {
    const cart = await Cart.fetchCart();
    const updatedCart = { ...cart };
    const existingProductIndex = updatedCart.products.findIndex((product) => product.id === id);
    const existingProduct = updatedCart.products[existingProductIndex];
    let updatedProduct;
    if (existingProduct) {
      updatedProduct = { ...existingProduct, quantity: existingProduct.quantity + 1 };
      updatedCart.products = [...updatedCart.products];
      updatedCart.products[existingProductIndex] = updatedProduct;
    } else {
      updatedProduct = { id, quantity: 1 };
      updatedCart.products = [...updatedCart.products, updatedProduct];
    }
    updatedCart.totalPrice += productPrice;

    await fs.promises.writeFile(Cart.filePath, JSON.stringify(updatedCart));
  }

  static async deleteProduct(id, productPrice) {
    const cart = await Cart.fetchCart();
    const updatedCart = { ...cart };
    const updatedProducts = updatedCart.products.filter((product) => product.id !== id);
    const deletedProduct = updatedCart.products.find((product) => product.id === id);
    if (!deletedProduct) return;
    updatedCart.products = updatedProducts;
    updatedCart.totalPrice -= deletedProduct.quantity * productPrice;

    await fs.promises.writeFile(Cart.filePath, JSON.stringify(updatedCart));
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
