const path = require('node:path');

const express = require('express');
const session = require('express-session');
const mongoDBStore = require('connect-mongodb-session')(session);
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const csrf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');

const errorController = require('./controllers/error');
const User = require('./models/user');

const MONGODB_URI = 'mongodb://localhost:27017/nodejs-udemy';

const app = express();
const store = new mongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions',
});
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (_, file, cb) => {
    cb(null, `${new Date().toISOString()}-${file.originalname}`);
  },
});
const fileFilter = (_, file, cb) => {
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
    return cb(null, true);
  }

  cb(null, false);
};
const csrfProtection = csrf();

app.set('view engine', 'pug');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ storage: fileStorage, fileFilter }).single('image'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(session({ secret: 'test123', resave: false, saveUninitialized: false, store }));
app.use(csrfProtection);
app.use(async (req, res, next) => {
  if (!req.session.user) {
    return next();
  }

  try {
    const user = await User.findById(req.session.user._id).populate('cart.items.productId').exec();

    if (!user) {
      return next();
    }

    req.user = user;
    next();
  } catch (err) {
    throw new Error(err);
  }
});
app.use(flash());
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use('/500', errorController.get500);
app.use(errorController.get404);
app.use((err, req, res, next) => {
  console.error(err);
  res.redirect('/500');
});

mongoose
  .connect(MONGODB_URI, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => {
    app.listen(3000, () => {
      console.log('App is listening on port 3000');
    });
  })
  .catch((err) => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });
