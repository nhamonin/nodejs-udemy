const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/add-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true,
  });
};

exports.postAddProduct = async (req, res, next) => {
  const { title, imageUrl, price, description } = req.body;
  const product = new Product(title, imageUrl, price, description);
  await product.save();
  res.redirect('/');
};

exports.getProducts = async (req, res, next) => {
  res.render('admin/products', {
    products: await Product.fetchAll(),
    pageTitle: 'Admin Products',
    path: '/admin/products',
  });
};
