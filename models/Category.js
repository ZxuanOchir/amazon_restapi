const mongoose = require('mongoose');
const { transliterate, slugify } = require('transliteration');

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Категорийн нэрийг оруулна уу.'],
      unique: true,
      trim: true,
      maxlength: [
        200,
        'Категорийн нэрний урт дээд талдаа 200 тэмдэгт байх ёстой.',
      ],
    },
    slug: String,
    description: {
      type: String,
      maxlength: [
        100,
        'Категорийн тайлбарын урт дээд талдаа 100 тэмдэгт байх ёстой.',
      ],
    },
    photo: {
      type: String,
      default: 'no-photo.jpg',
    },
    averageRating: {
      type: Number,
      min: [1, 'Рейтинг хамгийн багадаа 1 байх ёстой.'],
      max: [10, 'Рейтинг хамгийн ихдээ 10 байх ёстой.'],
    },
    averagePrice: Number,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Category model дээр "books" гэсэн виртуал талбар үүсгэж байна.
// Энэ нь тухайн Category-д хамаарах бүх Book-уудыг харуулахад хэрэглэгдэнэ.
CategorySchema.virtual('books', {
  ref: 'Book', // 'Book' model-ийг холбоно
  localField: '_id', // Category-ийн '_id'-г ашиглана
  foreignField: 'category', // Book model дээрх 'category' талбартай холбогдоно
  justOne: false, // Олон номыг харуулна.
});

//pre('deleteOne') middleware зөв ажиллахын тулд { document: true, query: false } тохиргоо шаардлагатай.
// Category устгахаас өмнө ажиллана,
// { document: true, query: false }	Зөвхөн document-based устгалд ажиллана (жишээ нь: category.deleteOne()), query-based (Category.deleteOne(...)) биш

CategorySchema.pre(
  'deleteOne',
  { document: true, query: false },
  async function (next) {
    console.log('removing ....');
    await this.model('Book').deleteMany({ category: this._id }); // Холбогдох бүх номыг устгана
    next();
  }
);

CategorySchema.pre('save', function (next) {
  //hadgalhas umnu
  //name convert
  //pre dotor this bgaa uusej bui object iig zaaj baidag bid hediin save hidgiin utga gesen ug...
  this.slug = slugify(this.name);
  this.averageRating = Math.floor(Math.random() * 10) + 1;

  next();
});

module.exports = mongoose.model('Category', CategorySchema);
