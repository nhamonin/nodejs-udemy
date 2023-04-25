import express from 'express';
import bodyParser from 'body-parser';

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views/ejs');

import adminData from './routes/admin.js';
import shopRoutes from './routes/shop.js';
import notFoundRoute from './routes/404.js';

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

app.use('/admin', adminData.routes);
app.use(shopRoutes);
app.use(notFoundRoute);

app.listen(3003);
