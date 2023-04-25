const fs = require('fs');
const path = require('path');
const rootDir = require('../util/path');

module.exports = class Product {
  constructor(title) {
    this.title = title;
  }

  static filePath = path.join(rootDir, 'data', 'products.json');

  async save() {
    const products = await Product.fetchAll();
    products.push(this);

    await fs.promises.writeFile(Product.filePath, JSON.stringify(products));
  }

  static async fetchAll() {
    const buffer = await fs.promises.readFile(Product.filePath);
    return JSON.parse(buffer.toString());
  }
};
