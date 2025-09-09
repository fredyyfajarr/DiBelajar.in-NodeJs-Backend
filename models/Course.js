import mongoose from 'mongoose';
import slugify from 'slugify';

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    instructorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true, // <-- DITAMBAHKAN
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Kategori wajib diisi'],
      index: true, // <-- DITAMBAHKAN
    },
    averageRating: {
      type: Number,
      max: [5, 'Rating maksimal 5'],
      default: 0,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

courseSchema.pre('save', async function (next) {
  if (this.isModified('title') || !this.slug) {
    let slug = slugify(this.title, { lower: true, strict: true });
    let count = await mongoose.models.Course.countDocuments({
      slug: new RegExp(`^${slug}`),
    });
    if (count > 0) {
      slug += `-${count + 1}`;
    }
    this.slug = slug;
  }
  next();
});

const Course = mongoose.model('Course', courseSchema);

export default Course;
