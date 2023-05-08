const Product = require('../models/product');
const { validationResult } = require('express-validator');

exports.getProducts = async (req, res, next) => {
  const products = await Product.find({
    userId: req.user._id,
  });

  res.render('admin/products', {
    products,
    pageTitle: 'Admin Products',
    path: '/admin/products',
  });
};

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    oldInput: { title: '', imageUrl: '', price: '', description: '' },
    errorMessage: [],
    validationErrors: [],
  });
};

exports.postAddProduct = async (req, res, next) => {
  const { title, imageUrl, price, description } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      errorMessage: errors.array()[0].msg,
      oldInput: { title, imageUrl, price, description },
      validationErrors: errors.array(),
    });
  }

  const product = new Product({ title, price, imageUrl, description, userId: req.user });
  product
    .save()
    .then(() => {
      res.redirect('/');
    })
    .catch((err) => {
      console.error(err);
    });
};

exports.getEditProduct = async (req, res, next) => {
  const editMode = req.query.edit === 'true';
  const productId = req.params.productId;
  const product = await Product.findById(productId);

  if (!editMode || !product) {
    return res.redirect('/');
  }

  res.render('admin/edit-product', {
    pageTitle: 'Edit Product',
    path: '/admin/edit-product',
    product,
    editing: true,
    oldInput: { title: '', imageUrl: '', price: '', description: '' },
    validationErrors: [],
    errorMessage: [],
  });
};

exports.postEditProduct = async (req, res, next) => {
  const { title, imageUrl, price, description, productId } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/add-product',
      editing: true,
      errorMessage: errors.array()[0].msg,
      oldInput: { title, imageUrl, price, description, _id: productId },
      validationErrors: errors.array(),
    });
  }

  const product = await Product.findById(productId);

  if (product.userId.toString() !== req.user._id.toString()) {
    return res.redirect('/');
  }

  product.title = title;
  product.imageUrl = imageUrl;
  product.price = price;
  product.description = description;

  product
    .save()
    .then(() => {
      res.redirect('/admin/products');
    })
    .catch((err) => {
      console.error(err);
    });
};

exports.postDeleteProduct = async (req, res, next) => {
  const { productId } = req.body;
  const { deletedCount } = await Product.deleteOne({
    _id: productId,
    userId: req.user._id,
  });

  return res.redirect(deletedCount ? '/admin/products' : '/');
};
