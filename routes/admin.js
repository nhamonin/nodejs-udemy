const express = require('express');
const { body } = require('express-validator');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

const productValidationRules = [
  body('title').isString().isLength({ min: 3 }).trim(),
  body('price').isFloat(),
  body('description').isString().isLength({ min: 5, max: 400 }).trim(),
];

router.get('/add-product', isAuth, adminController.getAddProduct);
router.post('/add-product', isAuth, productValidationRules, adminController.postAddProduct);
router.get('/products', isAuth, adminController.getProducts);
router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);
router.post('/edit-product', isAuth, productValidationRules, adminController.postEditProduct);
router.delete('/product/:productId', isAuth, adminController.deleteProduct);

module.exports = router;
