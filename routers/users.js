import path from 'path';

import express from 'express';

const router = express.Router();
const __dirname = path.resolve();

router.get('/users', (req, res, next) => {
    res.sendFile(path.join(__dirname, 'templates', 'users.html'));
});

export { router as usersRouter };