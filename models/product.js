const db = require('../util/database');
const Cart = require('./cart');

module.exports = class Product {
  constructor(id, title, imageUrl, price, description) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.price = +price;
    this.description = description;
  }

  async save() {
    return db.execute('INSERT INTO products (title, price, imageUrl, description) VALUES (?, ?, ?, ?)', [
      this.title,
      this.price,
      this.imageUrl,
      this.description,
    ]);
  }

  static async deleteById(id) {}

  static async fetchAll() {
    return db.execute('SELECT * FROM products');
  }

  static findById = async (id) => {
    const [rows] = await db.execute('SELECT * FROM products WHERE products.id = ?', [id]);
    return rows[0];
  };
};
