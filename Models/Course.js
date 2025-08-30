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
    },
  },
  {
    timestamps: true,
  }
);

courseSchema.pre('save', async function (next) {
  if (this.isModified('title') || !this.slug) {
    let slug = slugify(this.title, { lower: true, strict: true });
    let count = await Course.countDocuments({ slug });
    if (count > 0) {
      slug += `-${count}`;
    }
    this.slug = slug;
  }
  next();
});

const Course = mongoose.model('Course', courseSchema);

export default Course;
