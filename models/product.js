// const mongodb = require('mongodb');

// const getDb = require('../util/database').getDb;
// const { ObjectId } = mongodb;

// class Product {
//   constructor(title, price, imageUrl, description, userId) {
//     this.title = title;
//     this.price = price;
//     this.imageUrl = imageUrl;
//     this.description = description;
//     this.userId = userId;
//   }

//   async save() {
//     const db = getDb();
//     return db.collection('products').insertOne(this);
//   }

//   static async fetchAll() {
//     const db = getDb();
//     return db.collection('products').find().toArray();
//   }

//   static async findById(productId) {
//     const db = getDb();
//     return db.collection('products').findOne({ _id: new ObjectId(productId) });
//   }

//   static async deleteById(productId) {
//     const db = getDb();
//     return db.collection('products').deleteOne({ _id: new ObjectId(productId) });
//   }

//   async updateById(id) {
//     const db = getDb();
//     return db.collection('products').updateOne({ _id: new ObjectId(id) }, { $set: this });
//   }
// }

// module.exports = Product;
