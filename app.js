const path = require('node:path');

const express = require('express');
const session = require('express-session');
const mongoDBStore = require('connect-mongodb-session')(session);
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const User = require('./models/user');

const MONGODB_URI = 'mongodb://localhost:27017/nodejs-udemy';

const app = express();
const store = new mongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions',
});

app.set('view engine', 'pug');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'test123', resave: false, saveUninitialized: false, store }));

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose
  .connect(MONGODB_URI, { useUnifiedTopology: true, useNewUrlParser: true })
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
