import mongoose from 'mongoose';

const forumPostSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true, // <-- DITAMBAHKAN
  },
  materialId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Material',
    required: true,
    index: true, // <-- DITAMBAHKAN
  },
  text: {
    type: String,
    required: true,
  },
  parentPostId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ForumPost',
    default: null,
  },
  replies: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ForumPost',
    },
  ],
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const ForumPost = mongoose.model('ForumPost', forumPostSchema);

export default ForumPost;
