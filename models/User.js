const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Хэрэглэгчийн нэрийг заавал оруулна уу'],
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Хэрэглэгчийн имэйл хаягийг заавал оруулна уу'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Имэйл хаяг буруу байна',
    ],
  },
  role: {
    type: String,
    required: [true, 'Хэрэглэгчийн эрхийг оруулна уу'],
    enum: ['user', 'operator', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    minLength: 4,
    required: [true, 'Нууц үгээ оруулна уу'],
    select: false,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.pre('save', async function (next) {
  //Нууц үг өөрчлөгдөөгүй бол дараачийн миддлэваре лүү шилжүүл
  if (!this.isModified('password')) return next();

  //Нууц үг өөрчлөгдсөн
  console.time('salt');
  const salt = await bcrypt.genSalt(10); //random string
  console.timeEnd('salt');

  console.time('hash');
  this.password = await bcrypt.hash(this.password, salt);
  console.timeEnd('hash');
});

UserSchema.methods.getJsonWebToken = function () {
  const token = jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRESIN,
    }
  );
  return token;
};

UserSchema.methods.checkPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.methods.generatePasswordChangeToken = function () {
  const resetToken = crypto.randomBytes(20).toString('hex');

  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; //10 min after

  return resetToken;
};

module.exports = mongoose.model('User', UserSchema);
