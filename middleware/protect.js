const asyncHandler = require('./asyncHandler');
const jwt = require('jsonwebtoken');
const MyError = require('../utils/MyError');
exports.protect = asyncHandler(async (req, res, next) => {
  let token = null;

  if (req.headers.authorization) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies) {
    token = req.cookies['amazon-token'];
  }

  if (!token) {
    throw new MyError(
      'Энэ үйлдэлийг хийхэд таны эрх хүрэхгүй байна. Authorization header-ээр token оо дамжуулна уу.',
      401
    );
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
