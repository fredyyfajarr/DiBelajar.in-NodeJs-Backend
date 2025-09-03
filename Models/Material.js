// src/models/Material.js

import mongoose from 'mongoose';
import slugify from 'slugify';

// Skema untuk pertanyaan tes tetap kita butuhkan
const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: [
    {
      optionText: { type: String, required: true },
      isCorrect: { type: Boolean, required: true, default: false },
    },
  ],
});

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
  // 'testContent' bersifat opsional. Jika kosong, materi ini tidak punya tes.
  testContent: {
    type: [questionSchema],
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
    let count = await mongoose.model('Material').countDocuments({
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
