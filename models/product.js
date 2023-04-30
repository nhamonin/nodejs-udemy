const fs = require('fs');
const path = require('path');

const rootDir = require('../util/path');
const Cart = require('./cart');

module.exports = class Product {
  constructor(id, title, imageUrl, price, description) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.price = +price;
    this.description = description;
  }

  static filePath = path.join(rootDir, 'data', 'products.json');

  async save() {
    const products = await Product.fetchAll();
    if (this.id) {
      const productIndex = products.findIndex((product) => product.id === this.id);
      products[productIndex] = this;
    } else {
      this.id = new Date().getMilliseconds().toString() + Math.random().toString();
      products.push(this);
    }

    await fs.promises.writeFile(Product.filePath, JSON.stringify(products));
  }

  static async deleteById(id) {
    const products = await Product.fetchAll();
    const updatedProducts = products.filter((product) => product.id !== id);
    await fs.promises.writeFile(Product.filePath, JSON.stringify(updatedProducts));
    const deletedProduct = products.find((product) => product.id === id);
    await Cart.deleteProduct(id, deletedProduct.price);
  }

  static async fetchAll() {
    try {
      const buffer = await fs.promises.readFile(Product.filePath);
      return JSON.parse(buffer.toString());
    } catch (e) {
      return [];
    }
  }

  static getProductById = async (id) => {
    const products = await Product.fetchAll();
    return products.find((product) => product.id === id);
  };
};
