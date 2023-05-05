const Product = require('../models/product');

exports.getIndex = async (req, res, next) => {
  const products = await Product.find();

  res.render('shop/index', {
    products,
    pageTitle: 'Shop',
    path: '/',
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.getProducts = async (req, res, next) => {
  const products = await Product.find();

  res.render('shop/index', {
    products,
    pageTitle: 'All Products',
    path: '/products',
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.getProductDetails = async (req, res, next) => {
  const productId = req.params.productId;
  const product = await Product.findById(productId);
  if (!product) {
    return res.redirect('/');
  }

  res.render('shop/product-details', {
    product,
    pageTitle: product.title,
    path: '/products',
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.getCart = (req, res, next) => {
  const products = req.session.user.cart.items.map((item) => {
    return {
      ...item.productId._doc,
      quantity: item.quantity,
    };
  });

  const totalPrice = products.reduce((acc, product) => {
    return acc + product.price * product.quantity;
  }, 0);

  res.render('shop/cart', {
    products: products,
    totalPrice,
    pageTitle: 'Your Cart',
    path: '/cart',
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.postCart = async (req, res, next) => {
  const { productId } = req.body;
  const product = await Product.findById(productId);

  await req.session.user.addToCart(product);

  res.redirect('/cart');
};

exports.postCartDeleteProduct = async (req, res, next) => {
  const productId = req.body.productId;
  await req.session.user.deleteItemFromCart(productId);

  res.redirect('/cart');
};

exports.getOrders = async (req, res, next) => {
  const orders = await req.session.user.getOrders();

  res.render('shop/orders', {
    orders,
    pageTitle: 'Your Orders',
    path: '/orders',
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.postOrder = async (req, res, next) => {
  await req.session.user.addOrder();
  res.redirect('/orders');
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    pageTitle: 'Checkout',
    path: '/checkout',
    isAuthenticated: req.session.isLoggedIn,
  });
};
