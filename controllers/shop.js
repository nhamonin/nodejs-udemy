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
  const cart = await req.user.getCart();
  const cartProducts = await cart.getProducts();

  res.render('shop/cart', {
    products: cartProducts,
    totalPrice: cart.totalPrice,
    pageTitle: 'Your Cart',
    path: '/cart',
  });
};

exports.postCart = async (req, res, next) => {
  const { productId } = req.body;
  const cart = await req.user.getCart();
  const cartProduct = await cart.getProducts({ where: { id: productId } });

  if (cartProduct.length > 0) {
    const product = cartProduct[0];
    product.cartItem.quantity++;
    await product.cartItem.save();
  } else {
    const product = await Product.findByPk(productId);
    await cart.addProduct(product, { through: { quantity: 1 } });
  }

  res.redirect('/cart');
};

exports.postCartDeleteProduct = async (req, res, next) => {
  const productId = req.body.productId;
  const cart = await req.user.getCart();
  const [cartProduct] = await cart.getProducts({ where: { id: productId } });
  await cartProduct.cartItem.destroy();

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
