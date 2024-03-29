const fs = require('node:fs');
const path = require('node:path');

require('dotenv').config();
const pdfDocument = require('pdfkit');
const stripe = require('stripe')(process.env.STRIPE_KEY);
const Product = require('../models/product');

const ITEMS_PER_PAGE = 2;

exports.getIndex = async (req, res, next) => {
  const page = +req.query.page || 1;
  const totalProducts = await Product.find().countDocuments();
  const products = await Product.find()
    .skip((page - 1) * ITEMS_PER_PAGE)
    .limit(ITEMS_PER_PAGE);

  res.render('shop/index', {
    products,
    totalProducts,
    hasNextPage: ITEMS_PER_PAGE * page < totalProducts,
    hasPreviousPage: page > 1,
    nextPage: page + 1,
    currentPage: page,
    previousPage: page - 1,
    lastPage: Math.ceil(totalProducts / ITEMS_PER_PAGE),
    pageTitle: 'Shop',
    path: '/',
  });
};

exports.getProducts = async (req, res, next) => {
  const page = +req.query.page || 1;
  const totalProducts = await Product.find().countDocuments();
  const products = await Product.find()
    .skip((page - 1) * ITEMS_PER_PAGE)
    .limit(ITEMS_PER_PAGE);

  res.render('shop/index', {
    products,
    totalProducts,
    hasNextPage: ITEMS_PER_PAGE * page < totalProducts,
    hasPreviousPage: page > 1,
    nextPage: page + 1,
    currentPage: page,
    previousPage: page - 1,
    lastPage: Math.ceil(totalProducts / ITEMS_PER_PAGE),
    pageTitle: 'All Products',
    path: '/products',
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
  });
};

exports.getCart = (req, res, next) => {
  const products = req.user.cart.items.map((item) => {
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
  });
};

exports.postCart = async (req, res, next) => {
  const { productId } = req.body;
  const product = await Product.findById(productId);

  await req.user.addToCart(product);

  res.redirect('/cart');
};

exports.postCartDeleteProduct = async (req, res, next) => {
  const productId = req.body.productId;

  await req.user.deleteItemFromCart(productId);

  res.redirect('/cart');
};

exports.getOrders = async (req, res, next) => {
  const orders = await req.user.getOrders();

  res.render('shop/orders', {
    orders,
    pageTitle: 'Your Orders',
    path: '/orders',
  });
};

exports.getCheckout = async (req, res, next) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    line_items: req.user.cart.items.map((item) => {
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.productId.title,
          },
          unit_amount: item.productId.price * 100,
        },
        quantity: item.quantity,
      };
    }),
    success_url: `${req.protocol}://${req.get('host')}/orders`,
    cancel_url: `${req.protocol}://${req.get('host')}/checkout`,
  });
  const products = req.user.cart.items.map((item) => {
    return {
      ...item.productId._doc,
      quantity: item.quantity,
    };
  });

  const totalPrice = products.reduce((acc, product) => {
    return acc + product.price * product.quantity;
  }, 0);

  res.render('shop/checkout', {
    products: products,
    totalPrice,
    pageTitle: 'Checkout',
    path: '/checkout',
    sessionId: session.id,
  });
};

exports.postOrder = async (req, res, next) => {
  await req.user.addOrder();
  res.redirect('/orders');
};

exports.getInvoice = async (req, res, next) => {
  const orderId = req.params.orderId;
  const invoiceName = `invoice-${orderId}.pdf`;
  const invoicePath = path.join('data', 'invoices', invoiceName);
  const order = await req.user.getOrderByID(orderId);

  if (!order) {
    return next(new Error('No order found.'));
  }

  const pdfDoc = new pdfDocument();
  pdfDoc.pipe(fs.createWriteStream(invoicePath));

  pdfDoc.fontSize(26).text('Invoice', {
    underline: true,
  });

  pdfDoc.text('-----------------------');
  pdfDoc.fontSize(14).text('Order ID: ' + order._id);
  pdfDoc.text('-----------------------');
  pdfDoc.fontSize(16).text('Products:');
  pdfDoc.text('-----------------------');
  pdfDoc.fontSize(14).text(
    order.products
      .map((product) => {
        return `${product.product.title} - ${product.quantity} x $${product.product.price}`;
      })
      .join('\n')
  );
  pdfDoc.text('-----------------------');
  pdfDoc.fontSize(16).text(
    'Total Price: $' +
      order.products.reduce((acc, product) => {
        return acc + product.quantity * product.product.price;
      }, 0)
  );
  pdfDoc.end();

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `inline; filename=${invoiceName}`);

  pdfDoc.pipe(res);
};
