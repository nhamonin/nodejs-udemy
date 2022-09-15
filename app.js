import express from 'express';
import bodyParser from 'body-parser';

const app = express();

app.set('view engine', 'pug');
app.set('views', 'views');

import adminData from './routes/admin.js';
import shopRoutes from './routes/shop.js';

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

app.use('/admin', adminData.routes);
app.use(shopRoutes);

app.use((req, res, next) => {
    res.status(404).render('404', { pageTitle: 'Page Not Found' });
});

app.listen(3003);
