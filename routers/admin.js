import path from 'path';

import express from 'express';

const router = express.Router();
const __dirname = path.resolve();

router.get('/', (req, res, next) => {
    res.sendFile(path.join(__dirname, 'templates', 'main.html'));
});

export { router as adminRouter };