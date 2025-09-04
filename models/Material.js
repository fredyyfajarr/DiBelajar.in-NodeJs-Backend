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
  // Hanya jalankan jika judul dimodifikasi atau ini adalah dokumen baru
  if (this.isModified('title') || this.isNew) {
    let slug = slugify(this.title, { lower: true, strict: true });

    // Buat query untuk mencari slug yang sama di kursus yang sama,
    // TAPI KECUALIKAN DOKUMEN INI (jika sudah ada di database)
    const query = {
      slug: slug,
      courseId: this.courseId,
      _id: { $ne: this._id }, // <-- Kunci perbaikannya ada di sini
    };

    const existingMaterial = await mongoose.model('Material').findOne(query);

    // Jika ditemukan slug yang sama pada materi lain, tambahkan timestamp agar unik
    if (existingMaterial) {
      slug = `${slug}-${Date.now()}`;
    }

    this.slug = slug;
  }
  next();
});

const Material = mongoose.model('Material', materialSchema);
export default Material;
