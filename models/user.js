const mongoose = require('mongoose');

const Order = require('./order');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: { type: String, required: true },
  password: { type: String, require: true },
  cart: {
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true },
      },
    ],
  },
});

userSchema.methods.addToCart = async function (product) {
  const cartProductIndex = this.cart.items.findIndex((cp) => {
    return cp.productId.id === product.id;
  });

  const updatedCartItems = [...this.cart.items];

  if (cartProductIndex >= 0) {
    updatedCartItems[cartProductIndex].quantity++;
  } else {
    updatedCartItems.push({
      productId: product,
      quantity: 1,
    });
  }

  const updatedCart = {
    items: updatedCartItems,
  };

  this.cart = updatedCart;
  return this.save();
};

userSchema.methods.deleteItemFromCart = async function (productId) {
  const updatedCartItems = this.cart.items.filter((item) => {
    return item.productId.id !== productId;
  });

  this.cart.items = updatedCartItems;
  return this.save();
};

userSchema.methods.clearCart = async function () {
  this.cart = { items: [] };
  return this.save();
};

userSchema.methods.addOrder = async function () {
  const order = new Order({
    products: this.cart.items.map((item) => {
      return {
        quantity: item.quantity,
        product: { ...item.productId._doc },
      };
    }),
    user: {
      userId: this._id,
      name: this.name,
    },
  });
  await order.save();
  await this.clearCart();

  return order;
};

userSchema.methods.getOrders = async function () {
  return Order.find({ 'user.userId': this._id });
};

module.exports = mongoose.model('User', userSchema);
