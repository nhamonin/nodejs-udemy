const path = require('node:path');

const express = require('express');
const bodyParser = require('body-parser');

const mongoConnect = require('./util/database').mongoConnect;
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
  const user = await User.findById('64535b0a6baa78ac26a37c2c');
  req.user = new User(user.name, user.email, user.cart, user._id);
  next();
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoConnect()
  .then(() => {
    app.listen(3000, () => {
      console.log('App is listening on port 3000');
    });
  })
  .catch((err) => {
    console.error(err);
  });
