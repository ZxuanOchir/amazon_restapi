const express = require('express');
const rateLimit = require('express-rate-limit');

const app = express();

// Rate limiting тохиргоо: 1 минутанд 10 хүсэлт
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 10,
  message: {
    status: 429,
    error: 'Хэт олон хүсэлт илгээгдлээ. Түр хүлээнэ үү.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// User-Agent шалгах middleware
app.use((req, res, next) => {
  const ua = req.headers['user-agent'];
  if (!ua || ua.length < 10) {
    return res.status(403).json({
      error: 'Сэжигтэй хүсэлт: User-Agent байхгүй эсвэл хуурамч байна.',
    });
  }
  next();
});

module.exports = apiLimiter;
