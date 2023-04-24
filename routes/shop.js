import express from 'express';

import adminData from './admin.js';

const router = express.Router();

router.get('/', (req, res, next) => {
  const products = adminData.products;
  res.render('shop', {
    products,
    hasProducts: products.length > 0,
    pageTitle: 'Shop',
    path: '/',
    shopLinkActive: true,
  });
});

export default router;
