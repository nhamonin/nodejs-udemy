import express from 'express';
import path from 'path';

import { adminRouter } from './routers/admin.js';
import { usersRouter } from './routers/users.js';

const app = express();

const __dirname = path.resolve();

app.use(express.static(path.join(__dirname, 'public')))
app.use(adminRouter);
app.use(usersRouter);

app.listen(3003);