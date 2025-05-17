class MyError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    /*super(...) → Error классын constructor-ыг дуудаж, message-ийг Error класс руу илгээж байна.
    Error класс нь message-ийг алдааны мессеж болгон хадгалдаг.*/
  }
}

module.exports = MyError;
