const express = require('express');

const router = express.Router();
const userController = require('../controllers/userController');
// const imageController = require('../controllers/imageController');
const authController = require('../controllers/authController');
const { catchErrors } = require('../handlers/errorHandlers');

router.get('/', (_, res) => {
  console.log('user index');
});

// * User Routes
router.post('/user/register', catchErrors(userController.createUser));

router.get(
  '/user/:id',
  // userController.getUserId,
  catchErrors(userController.getUser)
);

router.get('/users', catchErrors(userController.getAllUsers));

router.get('/me', authController.onlyAuthUser, userController.getMe);

// router.get('/me', authController.onlyAuthUser, userController.getCurrentUser);
// router.get(
//   '/user/:id/images',
//   authController.onlyAuthUser,
//   userController.getUserId,
//   userController.getUserAllImages
// );

// router.post(
//   '/user/:id/image',
//   authController.onlyAuthUser,
//   userController.getUserId,
//   catchErrors(imageController.createNewImage)
// );

// router.post('/user/new', catchErrors(userController.createUser));
// router.post('/login', userController.login);
// router.post('/logout', userController.logout);

module.exports = router;
