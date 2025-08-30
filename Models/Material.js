import mongoose from 'mongoose';
import slugify from 'slugify';

const materialSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
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
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

materialSchema.pre('save', async function (next) {
  if (this.isModified('title') || !this.slug) {
    let slug = slugify(this.title, { lower: true, strict: true });
    let count = await Material.countDocuments({
      slug,
      courseId: this.courseId,
    });
    if (count > 0) {
      slug += `-${slug}-${count + 1}`;
    }
    this.slug = slug;
  }
  next();
});

const Material = mongoose.model('Material', materialSchema);

export default Material;
