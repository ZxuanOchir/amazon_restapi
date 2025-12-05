const express = require('express');
const dotenv = require('dotenv');
dotenv.config(); // enviroment
const path = require('path');
const morgan = require('morgan'); // just google it
var rfs = require('rotating-file-stream'); /*udur bolgonii huselt udruur log d hadgalah rotating-file-system */
const categoriesRoutes = require('./routes/categories');
const booksRoutes = require('./routes/books');
const usersRoutes = require('./routes/users');
const fileupload = require('express-fileupload');
const logger = require('./middleware/logger'); // my middleware
const connectDB = require('./config/db'); // ofc myMongoDb
const colors = require('colors'); // terminal color lib
const errorHandler = require('./middleware/error');
const apiLimiter = require('./middleware/apiLimitter');
const injectDB = require('./middleware/injectDB');

const dbSql = require('./config/db-mysql');

const app = express();

connectDB();

var accessLogStream = rfs.createStream('access.log', {
  interval: '1d',
  path: path.join(__dirname, 'log'),
});

app.use(express.json());
//Express.js нь req.body-г автоматаар уншихгүй. Тиймээс бид express.json() middleware-ийг ашиглана:
app.use(fileupload());
app.use(injectDB(dbSql));
app.use(logger);
app.use(morgan('tiny', { stream: accessLogStream })); // Энэ нь Express-д зориулсан logging (үйл явдлыг тэмдэглэх) сан юм.
app.use('/api/v1/categories', apiLimiter, categoriesRoutes); // ene endpoint orj irhed categoriesRoutes ajillana.
app.use('/api/v1/books', booksRoutes);
app.use('/api/v1/users', usersRoutes);
app.use(errorHandler);

dbSql.sequelize
  .sync()
  .then((result) => {
    console.log('sync hiile');
  })
  .catch((err) => {
    console.log(err);
  });

const server = app.listen(process.env.PORT, () => {
  //process nodejs iin
  console.log(`Server ${process.env.PORT} port on...`.rainbow);
});

process.on('unhandledRejection', (err, promise) => {
  console.log(`Алдаа гарчээ : ${err.message}`.inverse.red.bold);
  server.close(() => {
    process.exit(1);
  });
});
