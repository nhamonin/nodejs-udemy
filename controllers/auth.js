const crypto = require('node:crypto');

const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const { validationResult } = require('express-validator');
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
    oldInput: { email: '', password: '' },
    validationErrors: [],
  });
};

exports.postLogin = async (req, res, next) => {
  const { email, password } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('auth/login', {
      pageTitle: 'Login',
      path: '/login',
      isAuthenticated: false,
      errorMessage: errors.array()[0].msg,
      oldInput: { email, password },
      validationErrors: errors.array(),
    });
  }

  const user = await User.findOne({ email }).populate('cart.items.productId').exec();

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
    oldInput: { email: '', password: '', confirmPassword: '' },
    validationErrors: [],
  });
};

exports.postSignup = async (req, res, next) => {
  const { email, password, confirmPassword } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('auth/signup', {
      pageTitle: 'Signup',
      path: '/signup',
      isAuthenticated: false,
      errorMessage: errors.array()[0].msg,
      oldInput: { email, password, confirmPassword },
      validationErrors: errors.array(),
    });
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

exports.getNewPassword = async (req, res, next) => {
  const { token } = req.params;
  const user = await User.findOne({
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() },
  });

  if (!user) {
    req.flash('error', 'Invalid token');
    return res.redirect('/reset');
  }

  res.render('auth/new-password', {
    pageTitle: 'New Password',
    path: '/new-password',
    errorMessage: req.flash('error'),
    userId: user.id,
    resetToken: token,
  });
};

exports.postSaveNewPassword = async (req, res, next) => {
  const { userId, resetToken, password, confirmPassword } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render(`auth/new-password`, {
      pageTitle: 'New Password',
      path: '/new-password',
      isAuthenticated: false,
      resetToken,
      userId,
      errorMessage: errors.array()[0].msg,
      oldInput: { password, confirmPassword },
      validationErrors: errors.array(),
    });
  }

  const user = await User.findOne({
    resetToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId,
  });

  if (!user) {
    req.flash('error', 'Invalid token');
    return res.redirect('/reset');
  }

  if (password !== confirmPassword) {
    req.flash('error', 'Passwords do not match');
    return res.redirect(`/reset/${resetToken}`);
  }

  user.password = await bcrypt.hash(password, 12);
  user.resetToken = null;
  user.resetTokenExpiration = null;
  await user.save();

  res.redirect('/login');
};
