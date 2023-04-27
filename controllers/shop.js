const Product = require('../models/product');

exports.getProducts = async (req, res, next) => {
  res.render('shop/products-list', {
    products: await Product.fetchAll(),
    pageTitle: 'All Products',
    path: '/products',
  });
};

exports.getIndex = async (req, res, next) => {
  res.render('shop/index', {
    products: await Product.fetchAll(),
    pageTitle: 'Shop',
    path: '/',
  });
};

exports.getCart = async (req, res, next) => {
  res.render('shop/cart', {
    pageTitle: 'Your Cart',
    path: '/cart',
  });
};

exports.getOrders = async (req, res, next) => {
  res.render('shop/orders', {
    pageTitle: 'Your Orders',
    path: '/orders',
  });
};

exports.getCheckout = async (req, res, next) => {
  res.render('/shop/checkout', {
    pageTitle: 'Checkout',
    path: '/checkout',
  });
};
