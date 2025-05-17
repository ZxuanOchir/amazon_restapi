const Category = require('../models/Category');
const MyError = require('../utils/MyError');
const asyncHandler = require('../middleware/asyncHandler');
const paginate = require('../utils/paginate');

exports.getCategories = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sort = req.query.sort; //Жишээ нь name гэж ирвэл name-ээр эрэмбэлнэ.
  const select = req.query.select; //Ямар талбаруудыг авахыг хүсэж байгааг заана. Жишээ нь name,description гэх мэт.

  ['select', 'sort', 'page', 'limit'].forEach((el) => {
    delete req.query[el];
  });
  //req.query доторх select, sort, page, limit-ийг устгаж байна.
  //Учир нь эдгээр нь MongoDB-ийн хайлтын нөхцөлд орох ёсгүй.
  //page, limit, sort, select бол зөвхөн API-ийн нэмэлт тохиргоо, тиймээс MongoDB-д шүүлт болгож өгөх ёсгүй.

  //Pagination
  const pagination = await paginate(page, limit, Category);

  const categories = await Category.find(req.query, select)
    .sort(sort)
    .skip(pagination.start - 1)
    .limit(limit);

  res.status(200).json({
    success: true,
    data: categories,
    pagination,
  });
});

exports.getCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id).populate('books');

  if (!category) {
    throw new MyError(req.params.id + ' ID-тэй категори байхгүй!', 400);
  }

  res.status(200).json({
    success: true,
    data: category,
  });
});

exports.createCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.create(req.body);

  res.status(200).json({
    success: true,
    data: category,
  });
});

exports.updateCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true, //Шинэчлэгдсэн өгөгдлийг буцаана (false бол хуучин өгөгдлийг буцаана).
    runValidators: true, // Загварын (schema) шаардлагуудыг зөрчсөн эсэхийг шалгана.
  });
  if (!category) {
    throw new MyError(req.params.id + ' ID тай категори байхгүй.', 400);
  }
  res.status(200).json({
    success: true,
    data: category,
  });
});

exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    throw new MyError(req.params.id + 'ID тай категори байхгүй', 400);
  }
  ///category schema aas remove func bichih
  await category.deleteOne();
  res.status(200).json({
    success: true,
    data: category,
  });
});
