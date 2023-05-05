const User = require('../models/user');

exports.getLogin = async (req, res, next) => {
  res.render('auth/login', {
    pageTitle: 'Login',
    path: '/login',
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.postLogin = async (req, res, next) => {
  const user = await User.findById('6453f0f9f1583414281e79a6').populate('cart.items.productId').exec();

  req.session.isLoggedIn = true;
  req.session.user = user;
  res.redirect('/');
};

exports.postLogout = async (req, res, next) => {
  req.session.destroy((err) => {
    if (err) console.error(err);
    res.redirect('/');
  });
};
