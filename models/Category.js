import mongoose from 'mongoose';
import slugify from 'slugify';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Nama kategori tidak boleh kosong'],
    unique: true,
    trim: true,
  },
  slug: {
    type: String,
    unique: true,
  },
});

categorySchema.pre('save', function(next) {
  if (this.isModified('name') || this.isNew) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

const Category = mongoose.model('Category', categorySchema);

export default Category;