const express = require('express');

const router = express.Router();
const authRouter = require('./authRoutes');
const userRouter = require('./userRoutes');
// const imageRouter = require('./imageRoutes');

router.use(authRouter);
router.use(userRouter);
// router.use(imageRouter);

module.exports = router;
