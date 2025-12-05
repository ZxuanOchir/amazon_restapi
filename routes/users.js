const express = require('express');
const { protect, authorize } = require('../middleware/protect');
const {
  registerUser,
  loginUser,
  getUser,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  forgotPassword,
  resetPassword,
} = require('../controller/users');

const { getUserBooks } = require('../controller/books');

const router = express.Router();

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/forgot-password').post(forgotPassword);
router.route('/reset-password').post(resetPassword);

router.use(protect);

//api/v1/users

router
  .route('/')
  .get(authorize('admin'), getUsers)
  .post(authorize('admin'), createUser);
router
  .route('/:id')
  .get(authorize('admin', 'operator'), getUser)
  .put(authorize('admin'), updateUser)
  .delete(authorize('admin'), deleteUser);

router
  .route('/:id/books')
  .get(authorize('admin', 'operator', 'user'), getUserBooks);

module.exports = router;
