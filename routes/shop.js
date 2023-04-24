import express from 'express';

import adminData from './admin.js';

const router = express.Router();

router.get('/', (req, res, next) => {
  const products = adminData.products;
  res.render('shop', { products, pageTitle: 'Shop', path: '/' });
});

export default router;
