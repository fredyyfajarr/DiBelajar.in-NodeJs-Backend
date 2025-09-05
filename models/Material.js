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

aterialSchema.pre('save', async function (next) {
  // Hanya jalankan hook ini jika field 'title' dimodifikasi.
  // Ini secara otomatis mencegah slug diubah saat Anda hanya mengedit deskripsi.
  if (!this.isModified('title')) {
    return next();
  }

  // Buat slug dasar dari judul baru
  let baseSlug = slugify(this.title, { lower: true, strict: true });
  let newSlug = baseSlug;
  let counter = 1;

  // Terus cari slug unik sampai tidak ada yang sama
  while (
    await mongoose.models.Material.findOne({
      slug: newSlug,
      courseId: this.courseId,
      // Pastikan tidak bertabrakan dengan dokumennya sendiri
      _id: { $ne: this._id },
    })
  ) {
    newSlug = `${baseSlug}-${counter}`;
    counter++;
  }

  this.slug = newSlug;
  next();
});

const Material = mongoose.model('Material', materialSchema);
export default Material;
