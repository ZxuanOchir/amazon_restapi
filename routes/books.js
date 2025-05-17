const express = require('express');
const { protect, authorize } = require('../middleware/protect');

const {
  getBooks,
  getBook,
  createBook,
  deleteBook,
  updateBook,
  uploadBookPhoto,
} = require('../controller/books');

const router = express.Router();

//api/v1/books
router
  .route('/')
  .get(getBooks)
  .post(protect, authorize('admin', 'operator'), createBook);
//api/v1/books/bookId
router
  .route('/:id')
  .get(getBook)
  .delete(protect, authorize('admin', 'operator'), deleteBook)
  .put(protect, authorize('admin', 'operator'), updateBook);
//api/v1/books/bookId/photo
router
  .route('/:id/photo')
  .put(protect, authorize('admin', 'operator'), uploadBookPhoto);

module.exports = router;
