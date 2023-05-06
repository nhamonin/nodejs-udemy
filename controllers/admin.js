const Product = require('../models/product');

exports.getProducts = async (req, res, next) => {
  const products = await Product.find();

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
  });
};

exports.postAddProduct = async (req, res, next) => {
  const { title, imageUrl, price, description } = req.body;
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
  });
};

exports.postEditProduct = async (req, res, next) => {
  const { title, imageUrl, price, description, productId } = req.body;
  const product = await Product.findById(productId);

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
  await Product.findByIdAndRemove(productId);
  res.redirect('/admin/products');
};
