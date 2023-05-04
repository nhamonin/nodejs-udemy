const getDb = require('../util/database').getDb;
const { ObjectId } = require('mongodb');

class User {
  constructor(username, email, cart, id) {
    this.name = username;
    this.email = email;
    this.cart = cart || { items: [] };
    this._id = new ObjectId(id);
  }

  save = async () => {
    const db = getDb();
    return db.collection('users').insertOne(this);
  };

  addToCart = async (product) => {
    const cartProductIndex = this.cart.items.findIndex((cp) => {
      return cp.productId.toString() === product._id.toString();
    });

    const updatedCartItems = [...this.cart.items];

    if (cartProductIndex >= 0) {
      updatedCartItems[cartProductIndex].quantity++;
    } else {
      updatedCartItems.push({
        productId: new ObjectId(product._id),
        quantity: 1,
      });
    }

    const updatedCart = {
      items: updatedCartItems,
    };

    const db = getDb();

    return db.collection('users').updateOne({ _id: new ObjectId(this._id) }, { $set: { cart: updatedCart } });
  };

  getCart = async () => {
    const db = getDb();
    const productIds = this.cart.items.map((item) => item.productId);
    const products = await db
      .collection('products')
      .find({ _id: { $in: productIds } })
      .toArray();

    return {
      items: products.map((product) => {
        return {
          ...product,
          quantity: this.cart.items.find((item) => {
            return item.productId.toString() === product._id.toString();
          }).quantity,
        };
      }),
    };
  };

  deleteItemFromCart = async (productId) => {
    const updatedCartItems = this.cart.items.filter((item) => {
      return item.productId.toString() !== productId.toString();
    });

    const db = getDb();

    return db
      .collection('users')
      .updateOne({ _id: new ObjectId(this._id) }, { $set: { cart: { items: updatedCartItems } } });
  };

  static findById = async (userId) => {
    const db = getDb();
    return db.collection('users').findOne({ _id: new ObjectId(userId) });
  };

  addOrder = async () => {
    const db = getDb();
    const cart = await this.getCart();
    const order = {
      items: cart.items,
      user: {
        _id: new ObjectId(this._id),
        name: this.name,
      },
    };
    await db.collection('orders').insertOne(order);
    this.cart = { items: [] };
    await db.collection('users').updateOne({ _id: new ObjectId(this._id) }, { $set: { cart: { items: [] } } });
    return order;
  };

  getOrders = async () => {
    const db = getDb();
    const orders = await db
      .collection('orders')
      .find({ 'user._id': new ObjectId(this._id) })
      .toArray();
    return orders;
  };
}

module.exports = User;
