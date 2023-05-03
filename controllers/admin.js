const Product = require('../models/product');

// exports.getProducts = async (req, res, next) => {
//   res.render('admin/products', {
//     products: await req.user.getProducts(),
//     pageTitle: 'Admin Products',
//     path: '/admin/products',
//   });
// };

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
  });
};

exports.postAddProduct = async (req, res, next) => {
  const { title, imageUrl, price, description } = req.body;
  const product = new Product(title, price, imageUrl, description);
  product
    .save()
    .then(() => {
      res.redirect('/');
    })
    .catch((err) => {
      console.log(err);
    });
};

// exports.getEditProduct = async (req, res, next) => {
//   const editMode = req.query.edit === 'true';
//   const productId = req.params.productId;
//   const [product] = await req.user.getProducts({ where: { id: productId } });

//   if (!editMode || !product) {
//     return res.redirect('/');
//   }

//   res.render('admin/edit-product', {
//     pageTitle: 'Edit Product',
//     path: '/admin/edit-product',
//     product,
//     editing: true,
//   });
// };

// exports.postEditProduct = async (req, res, next) => {
//   const { id, title, imageUrl, price, description } = req.body;
//   const [product] = await req.user.getProducts({ where: { id } });
//   product.title = title;
//   product.imageUrl = imageUrl;
//   product.price = price;
//   product.description = description;
//   product
//     .save()
//     .then(() => {
//       res.redirect('/');
//     })
//     .catch((err) => {
//       console.log(err);
//     });
//   res.redirect('/admin/products');
// };

// exports.postDeleteProduct = async (req, res, next) => {
//   const { productId } = req.body;
//   const product = await Product.findByPk(productId);
//   await product.destroy();
//   res.redirect('/admin/products');
// };
