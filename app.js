import express from 'express';
import bodyParser from 'body-parser';
import { engine as expressHandlebars } from 'express-handlebars';

const app = express();

app.engine(
  'handlebars',
  expressHandlebars({
    layoutsDir: 'views/handlebars/layouts',
    defaultLayout: 'main-layout',
  })
);
app.set('view engine', 'handlebars');
app.set('views', 'views/handlebars');

import adminData from './routes/admin.js';
import shopRoutes from './routes/shop.js';
import notFoundRoute from './routes/404.js';

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

app.use('/admin', adminData.routes);
app.use(shopRoutes);
app.use(notFoundRoute);

app.listen(3003);
