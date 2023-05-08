const express = require('express');
const { body } = require('express-validator');

const authController = require('../controllers/auth');
const User = require('../models/user');

const router = express.Router();

router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);
router.post('/logout', authController.postLogout);
router.get('/signup', authController.getSignup);
router.post(
  '/signup',
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid E-mail.')
      .custom(async (value, { req }) => {
        const userExist = await User.findOne({ email: value });

        if (userExist) {
          throw new Error('Email already exist');
        }

        return true;
      }),
    body('password', 'Please enter a password with only numbers and text and at least 5 characters.')
      .isLength({ min: 5 })
      .isAlphanumeric(),
    body('confirmPassword').custom((value, { req }) => {
      if (value !== req.body.password) throw new Error('Passwords have to match!');
      return true;
    }),
  ],
  authController.postSignup
);
router.get('/reset', authController.getReset);
router.post('/reset', authController.postReset);
router.get('/reset/:token', authController.getNewPassword);
router.post('/save-new-password', authController.postSaveNewPassword);

module.exports = router;
