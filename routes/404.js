import express from 'express';

const router = express.Router();

router.use('/', (req, res, next) => {
  res.status(404).render('404', { pageTitle: 'Page Not Found' });
});

export default router;
