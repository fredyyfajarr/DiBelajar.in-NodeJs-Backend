import mongoose from 'mongoose';
import slugify from 'slugify';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    unique: true,
    index: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    required: true,
    enum: ['admin', 'instructor', 'student'],
  },
  password: {
    type: String,
    required: true,
    select: false,
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

userSchema.pre('save', async function (next) {
  if (this.isModified('name') || !this.slug) {
    let slug = slugify(this.name, { lower: true, strict: true });
    let count = await User.countDocuments({ slug });
    if (count > 0) {
      slug += `-${count}`;
    }
    this.slug = slug;
  }
  next();
});

const User = mongoose.model('User', userSchema);

export default User;
