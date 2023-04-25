import express from 'express';

const router = express.Router();

const users = [];

router.get('/users', (req, res, next) => {
  res.render('users', {
    users,
    pageTitle: 'Users',
    path: '/users',
  });
});

router.post('/users', (req, res, next) => {
  users.push({ name: req.body.name });
  res.redirect('/users');
});

export default {
  routes: router,
  users,
};
