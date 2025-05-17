const User = require('../models/User');
const MyError = require('../utils/MyError');
const asyncHandler = require('../middleware/asyncHandler');
const paginate = require('../utils/paginate');

// register
exports.registerUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);

  const token = user.getJsonWebToken();

  res.status(200).json({
    success: true,
    token,
    user,
  });
});

// login
exports.loginUser = asyncHandler(async (req, res, next) => {
  // email password
  const { email, password } = req.body;

  if (!email || !password) {
    throw new MyError('Имейл болон нууц үг оруулна уу!');
  }

  //find user
  const user = await User.findOne({ email: email }).select('+password');
  if (!user) {
    throw new MyError('Имейл болон нууц үгээ шалгана уу!', 401);
  }

  const ok = await user.checkPassword(password);

  if (!ok) {
    throw new MyError('Имейл болон нууц үгээ шалгана уу!', 401);
  }

  res.status(200).json({
    token: user.getJsonWebToken(),
    success: true,
    user: {
      _id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  });
});
//test api requests user id and response
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    throw new MyError(req.params.id + 'тэй хэрэглэгч олдсонгүй');
  }
  res.status(200).json({
    success: true,
    user: {
      _id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  });
});

exports.getUsers = asyncHandler(async (req, res, next) => {
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
  const pagination = await paginate(page, limit, User);

  const users = await User.find(req.query, select)
    .sort(sort)
    .skip(pagination.start - 1)
    .limit(limit);

  res.status(200).json({
    success: true,
    data: users,
    pagination,
  });
});

exports.createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);

  res.status(200).json({
    success: true,
    data: user,
  });
});

exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true, //Шинэчлэгдсэн өгөгдлийг буцаана (false бол хуучин өгөгдлийг буцаана).
    runValidators: true, // Загварын (schema) шаардлагуудыг зөрчсөн эсэхийг шалгана.
  });
  if (!user) {
    throw new MyError(req.params.id + ' ID тай хэрэглэгч байхгүй.', 400);
  }
  res.status(200).json({
    success: true,
    data: user,
  });
});

exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new MyError(req.params.id + 'ID тай хэрэглэгч байхгүй', 400);
  }

  await user.deleteOne();
  const message = req.params.id + ' ID тай хэрэглэгч амжилттай устлаа';
  res.status(200).json({
    success: true,
    data: user,
    message,
  });
});
