const Product = require('../models/product');

exports.getProducts = async (req, res, next) => {
  res.render('admin/products', {
    products: await Product.fetchAll(),
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
  const product = new Product(null, title, imageUrl, price, description);
  await product.save();
  res.redirect('/');
};

exports.getEditProduct = async (req, res, next) => {
  const editMode = req.query.edit === 'true';
  const productId = req.params.productId;
  const product = await Product.getProductById(productId);

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
  const { id, title, imageUrl, price, description } = req.body;
  const product = new Product(id, title, imageUrl, price, description);
  await product.save();
  res.redirect('/admin/products');
};

exports.postDeleteProduct = async (req, res, next) => {
  const { productId } = req.body;
  await Product.deleteById(productId);
  res.redirect('/admin/products');
};
