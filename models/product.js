const mongodb = require('mongodb');

const getDb = require('../util/database').getDb;
const { ObjectId } = mongodb;

class Product {
  constructor(title, price, imageUrl, description) {
    this.title = title;
    this.price = price;
    this.imageUrl = imageUrl;
    this.description = description;
  }

  async save() {
    const db = getDb();
    console.log(db);
    return db.collection('products').insertOne(this);
  }

  static async fetchAll() {
    const db = getDb();
    return db.collection('products').find().toArray();
  }

  static async findById(productId) {
    const db = getDb();
    console.log(productId, 'productId');
    return db.collection('products').findOne({ _id: new ObjectId(productId) });
  }
}

module.exports = Product;
