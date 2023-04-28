const fs = require('fs');
const path = require('path');
const rootDir = require('../util/path');

module.exports = class Product {
  constructor(title, imageUrl, price, description) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.price = price;
    this.description = description;
  }

  static filePath = path.join(rootDir, 'data', 'products.json');

  async save() {
    this.id = new Date().getMilliseconds().toString() + Math.random().toString();
    const products = await Product.fetchAll();
    products.push(this);

    await fs.promises.writeFile(Product.filePath, JSON.stringify(products));
  }

  static async fetchAll() {
    const buffer = await fs.promises.readFile(Product.filePath);
    return JSON.parse(buffer.toString());
  }

  static getProductById = async (id) => {
    const products = await Product.fetchAll();
    return products.find((product) => product.id === id);
  };
};
