const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017';
const dbName = 'nodejs-udemy';
let db = null;

const mongoConnect = async () => {
  try {
    const client = await MongoClient.connect(url, { useUnifiedTopology: true });
    db = client.db(dbName);
  } catch (err) {
    console.error('Failed to connect to MongoDB server:', err);
    throw err;
  }
};

const getDb = () => {
  if (!db) {
    throw new Error('Database not initialized');
  }
  return db;
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
