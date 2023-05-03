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
  const totalPrice = await cart.getProducts().then((products) => {
    return products.reduce((acc, product) => {
      return acc + product.price * product.cartItem.quantity;
    }, 0);
  });

  res.render('shop/cart', {
    products: cartProducts,
    totalPrice,
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
  const orders = await req.user.getOrders({ include: ['products'] });

  res.render('shop/orders', {
    orders,
    pageTitle: 'Your Orders',
    path: '/orders',
  });
};

exports.postOrder = async (req, res, next) => {
  const cart = await req.user.getCart();
  const cartProducts = await cart.getProducts();
  const order = await req.user.createOrder();
  await order.addProducts(
    cartProducts.map((product) => {
      product.orderItem = { quantity: product.cartItem.quantity };
      return product;
    })
  );
  await cart.setProducts(null);
  res.redirect('/orders');
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    pageTitle: 'Checkout',
    path: '/checkout',
  });
};
