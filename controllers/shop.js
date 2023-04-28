const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getIndex = async (req, res, next) => {
  res.render('shop/index', {
    products: await Product.fetchAll(),
    pageTitle: 'Shop',
    path: '/',
  });
};

exports.getProducts = async (req, res, next) => {
  res.render('shop/products-list', {
    products: await Product.fetchAll(),
    pageTitle: 'All Products',
    path: '/products',
  });
};

exports.getProductDetails = async (req, res, next) => {
  const productId = req.params.productId;
  const product = await Product.getProductById(productId);

  res.render('shop/product-details', {
    product,
    pageTitle: product.title,
    path: '/products',
  });
};

exports.getCart = async (req, res, next) => {
  res.render('shop/cart', {
    pageTitle: 'Your Cart',
    path: '/cart',
  });
};

exports.postCart = async (req, res, next) => {
  const productId = req.body.productId;
  const product = await Product.getProductById(productId);
  await Cart.addProduct(productId, product.price);
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
