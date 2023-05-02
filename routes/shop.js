const express = require('express');

const shopController = require('../controllers/shop');

const router = express.Router();

router.get('/', shopController.getIndex);
router.get('/cart', shopController.getCart);
router.post('/cart', shopController.postCart);
router.get('/checkout', shopController.getCheckout);
router.get('/orders', shopController.getOrders);
router.get('/products', shopController.getProducts);
router.get('/products/:productId', shopController.getProductDetails);
router.post('/cart-delete-product', shopController.postCartDeleteProduct);
router.post('/create-order', shopController.postOrder);

module.exports = router;
