const asyncHandler = (fn) => (req, res, next) => {
  //Node.js-д асинхрон кодонд try-catch бичихгүй бол алдаа гарах үед next(error) дуудагдахгүй. Тиймээс Promise.resolve() ашиглан алдааг catch(next) хэсэгт дамжуулж, errorHandler middleware рүү илгээнэ.
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
