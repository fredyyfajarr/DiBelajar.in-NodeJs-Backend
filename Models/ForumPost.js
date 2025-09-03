// src/models/ForumPost.js

import mongoose from 'mongoose';

const forumPostSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  materialId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Material',
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  // --- FIELD BARU UNTUK SISTEM REPLY ---
  parentPostId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ForumPost',
    default: null, // Jika null, ini adalah postingan induk
  },
  replies: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ForumPost', // Menyimpan ID dari balasan-balasannya
    },
  ],
  // --- AKHIR PENAMBAHAN ---
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const ForumPost = mongoose.model('ForumPost', forumPostSchema);

export default ForumPost;
