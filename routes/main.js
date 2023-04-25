import express from 'express';

import userData from './users.js';

const router = express.Router();

router.get('/', (req, res, next) => {
  const users = userData.users;
  res.render('main', {
    users,
    pageTitle: 'Users',
    path: '/',
  });
});

export default router;
