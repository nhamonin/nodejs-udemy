const bcrypt = require('bcryptjs');

const User = require('../models/user');

exports.getLogin = async (req, res, next) => {
  res.render('auth/login', {
    pageTitle: 'Login',
    path: '/login',
  });
};

exports.postLogin = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).populate('cart.items.productId').exec();
  if (!user) return res.redirect('/login');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.redirect('/login');

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
    password: await bcrypt.hash(password, 12),
    cart: { items: [] },
  });

  await user.save();
  res.redirect('/login');
};
