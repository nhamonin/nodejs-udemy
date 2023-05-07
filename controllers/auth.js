const crypto = require('node:crypto');

const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
require('dotenv').config();

const User = require('../models/user');

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: process.env.sendgrid_api_key,
    },
  })
);

exports.getLogin = async (req, res, next) => {
  res.render('auth/login', {
    pageTitle: 'Login',
    path: '/login',
    errorMessage: req.flash('error'),
  });
};

exports.postLogin = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).populate('cart.items.productId').exec();
  if (!user) {
    req.flash('error', 'Invalid email or password');
    return res.redirect('/login');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    req.flash('error', 'Invalid email or password');
    return res.redirect('/login');
  }

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
    errorMessage: req.flash('error'),
  });
};

exports.postSignup = async (req, res, next) => {
  const { email, password, confirmPassword } = req.body;
  const userExist = await User.findOne({ email });

  if (userExist) {
    req.flash('error', 'Email already exist');
    return res.redirect('/signup');
  }

  const user = new User({
    email,
    password: await bcrypt.hash(password, 12),
    cart: { items: [] },
  });

  await user.save();
  res.redirect('/login');
  transporter.sendMail({
    to: email,
    from: process.env.sender_email,
    subject: 'Signup succeeded!',
    html: `<h1>You successfully signed up!</h1>
    <p>Click this <a href="http://localhost:3000/login">link</a> to login</p>`,
  });
};

exports.getReset = (req, res, next) => {
  res.render('auth/reset', {
    pageTitle: 'Reset Password',
    path: '/reset',
    errorMessage: req.flash('error'),
  });
};

exports.postReset = async (req, res, next) => {
  const ONE_HOUR = 3600000;

  crypto.randomBytes(32, async (err, buffer) => {
    if (err) {
      console.error(err);
      return res.redirect('/reset');
    }
    const token = buffer.toString('hex');

    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      req.flash('error', 'No account with that email found');
      return res.redirect('/reset');
    }

    user.resetToken = token;
    user.resetTokenExpiration = Date.now() + ONE_HOUR;
    await user.save();

    res.redirect('/');
    transporter.sendMail({
      to: req.body.email,
      from: process.env.sender_email,
      subject: 'Password reset',
      html: `
        <p>You requested a password reset</p>
        <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password</p>
      `,
    });
  });
};
