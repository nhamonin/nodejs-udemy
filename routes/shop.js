const express = require('express');

const shopController = require('../controllers/shop');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/', shopController.getIndex);
router.get('/cart', isAuth, shopController.getCart);
router.post('/cart', isAuth, shopController.postCart);
router.get('/checkout', isAuth, shopController.getCheckout);
router.get('/orders', isAuth, shopController.getOrders);
router.get('/products/:productId', shopController.getProductDetails);
router.get('/products', shopController.getProducts);
router.post('/cart-delete-product', isAuth, shopController.postCartDeleteProduct);
router.get('/checkout/success', shopController.postOrder);
router.get('/checkout/cancel', shopController.getCheckout);
router.get('/checkout', shopController.getCheckout);
router.get('/orders/:orderId', isAuth, shopController.getInvoice);

module.exports = router;
