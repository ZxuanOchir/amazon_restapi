const asyncHandler = require('./asyncHandler');
const jwt = require('jsonwebtoken');
const MyError = require('../utils/MyError');
exports.protect = asyncHandler(async (req, res, next) => {
  if (!req.headers.authorization) {
    throw new MyError(
      'Энэ үйлдэлийг хийхэд таны эрх хүрэхгүй байна. Authorization header-ээр token оо дамжуулна уу.',
      401
    );
  }

  const token = req.headers.authorization.split(' ')[1]; // Bearer-Token 3124124235hurjgu3h58hg39g8035805g83hg853

  if (!token) {
    throw new MyError('Токен байхгүй байна!', 400);
  }

  const tokenObj = jwt.verify(token, process.env.JWT_SECRET);

  console.log(tokenObj);

  req.userId = tokenObj.id;
  req.userRole = tokenObj.role;

  next();
});

exports.authorize = (...roles) => {
  return (req, res, next) => {
    console.log('Allowed roles:', roles); // ['admin', 'operator']
    console.log('Current user role:', req.userRole); // 'operator'

    if (!roles.includes(req.userRole)) {
      throw new MyError(
        `Таны эрх хүрэлцэхгүй байна [${req.userRole}] энэ үйлдлийг гүйцэтгэхэд хүрэлцэхгүй`,
        403
      );
    }

    next();
  };
};
