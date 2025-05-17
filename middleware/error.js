const errorHandler = (err, req, res, next) => {
  console.log(err.stack ? err.stack.red : err.message.red);

  let error = { message: err.message, statusCode: err.statusCode || 500 };

  // Муу ID өгсөн үед (Mongoose CastError)
  if (err.name === 'CastError') {
    error.message = 'Энэ ID буруу бүтэцтэй байна.';
    error.statusCode = 400;
  }

  // Давхардсан утга (Mongoose duplicate key)
  if (err.code === 11000) {
    error.message = 'Талбарын утгаыг давхардуулж болохгүй.';
    error.statusCode = 400;
  }

  if (err.message === 'invalid token') {
    error.message = 'Буруу токен байна.';
    error.statusCode = 400;
  }

  res.status(error.statusCode).json({
    success: false,
    error: error.message,
  });
};

module.exports = errorHandler;
