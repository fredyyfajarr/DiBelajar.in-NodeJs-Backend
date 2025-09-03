import mongoose from 'mongoose';
import slugify from 'slugify';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

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

  passwordResetToken: String,
  passwordResetExpires: Date,
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
  if (this.isModified('name') || this.isNew) {
    let slug = slugify(this.name, { lower: true, strict: true });

    const existingUser = await this.constructor.findOne({
      slug: new RegExp(`^${slug}`),
    });
    if (existingUser && this.id !== existingUser.id) {
      let count = await this.constructor.countDocuments({
        slug: new RegExp(`^${slug}`),
      });
      slug += `-${count + 1}`;
    }
    this.slug = slug;
  }
  next();
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);

export default User;
