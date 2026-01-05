const MyError = require('../utils/MyError');
const asyncHandler = require('../middleware/asyncHandler');
const paginate = require('../utils/paginateSequelize');

exports.createComment = asyncHandler(async (req, res, next) => {
  const comment = await req.db.comment.create(req.body);

  res.status(200).json({
    success: true,
    data: comment,
  });
});

// api/v1/comments/:id
exports.updateComment = asyncHandler(async (req, res, next) => {
  let comment = await req.db.comment.findByPk(req.params.id);

  if (!comment) {
    throw new MyError('Тус ID тай коммент байхгүй');
  }

  comment = await comment.update(req.body);

  res.status(200).json({
    success: true,
    data: comment,
  });
});

// api/v1/comments/:id

exports.getComment = asyncHandler(async (req, res, next) => {
  const comment = await req.db.comment.findByPk(req.params.id);

  if (!comment) {
    throw new MyError('Тус ID тай коммент байхгүй');
  }

  res.status(200).json({
    success: true,
    user: await comment.getUser(),
    magic: Object.keys(req.db.comment.prototype),
    data: comment,
  });
});

// api/v1/comments/:id

exports.deleteComment = asyncHandler(async (req, res, next) => {
  let foundedComment = await req.db.comment.findByPk(req.params.id);

  if (!foundedComment) {
    throw new MyError('Устгах коммент олдсонгүй!');
  }

  await foundedComment.destroy(foundedComment);

  res.status(200).json({
    success: true,
    data: 'Амжилттай устгалаа',
  });
});

// api/v1/comments

exports.getComments = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 4;
  const sort = req.query.sort;
  let select = req.query.select;

  if (select) {
    select = select.split(' ');
  }

  ['select', 'sort', 'page', 'limit'].forEach((el) => delete req.query[el]);

  const pagination = await paginate(page, limit, req.db.comment);

  let query = { offset: pagination.start - 1, limit };

  if (req.query) {
    query.where = req.query;
  }

  if (select) {
    query.attributes = select;
  }

  if (sort) {
    query.order = sort
      .split(' ')
      .map((el) => [
        el.charAt(0) === '-' ? el.substring(1) : el,
        el.charAt(0) === '-' ? 'DESC' : 'ASC',
      ]);
  }

  const comments = await req.db.comment.findAll(query);

  res.status(200).json({
    success: true,
    data: comments,
    pagination,
  });
});

//Lazy Loading
exports.getUserComments = asyncHandler(async (req, res, next) => {
  const user = await req.db.user.findByPk(req.params.id);

  if (!user) {
    throw new MyError('Тус ID тай user байхгүй');
  }

  const comments = await user.getComments();

  res.status(200).json({
    success: true,
    user,
    //magic: Object.keys(req.db.comment.prototype),
    comments,
  });
});
