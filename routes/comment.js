const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/protect');

const {
  createComment,
  updateComment,
  getComment,
  deleteComment,
  getComments,
} = require('../controller/comments');

router
  .route('/')
  .get(protect, authorize('admin'), getComments)
  .post(protect, authorize('admin', 'user', 'operator'), createComment);

router
  .route('/:id')
  .get(protect, authorize('admin', 'user', 'operator'), getComment)
  .delete(protect, authorize('admin', 'user', 'operator'), deleteComment)
  .put(protect, authorize('admin', 'user', 'operator'), updateComment);

module.exports = router;
