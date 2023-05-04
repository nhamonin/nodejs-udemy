const path = require('node:path');

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();

app.set('view engine', 'pug');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(async (req, res, next) => {
  const user = await User.findById('6453f0f9f1583414281e79a6');
  req.user = user;
  next();
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose
  .connect('mongodb://localhost:27017/nodejs-udemy', { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => {
    app.listen(3000, () => {
      let user = User.findOne();

      if (!user) {
        user = new User({
          name: 'Max',
          email: 'test@gmail.com',
        });
        user.save();
      }

      console.log('App is listening on port 3000');
    });
  })
  .catch((err) => {
    console.error(err);
  });
