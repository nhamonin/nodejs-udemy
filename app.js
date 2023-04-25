import express from 'express';
import bodyParser from 'body-parser';

const app = express();

app.set('view engine', 'pug');
app.set('views', 'views');

import mainRoute from './routes/main.js';
import usersData from './routes/users.js';

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

app.use(mainRoute);
app.use(usersData.routes);

app.listen(3003);
