const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getIndex = async (req, res, next) => {
  Product.findAll().then((products) => {
    res.render('shop/index', {
      products,
      pageTitle: 'Shop',
      path: '/',
    });
  });
};

exports.getProducts = async (req, res, next) => {
  Product.findAll().then((products) => {
    res.render('shop/index', {
      products,
      pageTitle: 'All Products',
      path: '/products',
    });
  });
};

exports.getProductDetails = async (req, res, next) => {
  const productId = req.params.productId;
  const product = await Product.findByPk(productId);
  if (!product) {
    return res.redirect('/');
  }

  res.render('shop/product-details', {
    product,
    pageTitle: product.title,
    path: '/products',
  });
};

exports.getCart = async (req, res, next) => {
  const cart = await Cart.fetchCart();
  const products = await Product.findAll();
  const cartProducts = cart.products.map((cartProduct) => {
    const fullProduct = products.find((product) => product.id === cartProduct.id);
    return {
      productData: fullProduct,
      quantity: cartProduct.quantity,
    };
  });
  res.render('shop/cart', {
    cartProducts,
    totalPrice: cart.totalPrice,
    pageTitle: 'Your Cart',
    path: '/cart',
  });
};

exports.postCart = async (req, res, next) => {
  const productId = req.body.productId;
  const product = await Product.findByPk(productId);
  await Cart.addProduct(productId, product.price);
  res.redirect('/cart');
};

exports.postCartDeleteProduct = async (req, res, next) => {
  const productId = req.body.productId;
  const price = await Product.findByPk(productId, { attributes: ['price'] });
  await Cart.deleteProduct(productId, price);
  res.redirect('/cart');
};

exports.getOrders = async (req, res, next) => {
  res.render('shop/orders', {
    pageTitle: 'Your Orders',
    path: '/orders',
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    pageTitle: 'Checkout',
    path: '/checkout',
  });
};
