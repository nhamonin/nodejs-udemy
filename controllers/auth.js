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
  req.session.save((err) => {
    if (err) console.error(err);
    res.redirect('/');
  });
};

exports.postLogout = async (req, res, next) => {
  req.session.destroy((err) => {
    if (err) console.error(err);
    res.redirect('/');
  });
};

exports.getSignup = async (req, res, next) => {
  res.render('auth/signup', {
    pageTitle: 'Signup',
    path: '/signup',
    isAuthenticated: false,
  });
};

exports.postSignup = async (req, res, next) => {
  const { email, password, confirmPassword } = req.body;
  const userExist = await User.findOne({ email });

  if (userExist) return res.redirect('/signup');

  const user = new User({
    email,
    password,
    cart: { items: [] },
  });

  await user.save();
  res.redirect('/login');
};
