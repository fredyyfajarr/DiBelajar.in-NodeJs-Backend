import ForumPost from '../models/ForumPost.js';
import sanitizeHtml from 'sanitize-html';

// Kita tidak lagi butuh buildQuery untuk findPostsByMaterialId karena populasinya kompleks

export const createForumPost = async (
  userId,
  materialId,
  text,
  parentPostId = null
) => {
  try {
    const cleanText = sanitizeHtml(text, {
      allowedTags: ['b', 'i', 'em', 'strong', 'p', 'br'],
      allowedAttributes: {},
    });

    const newPostData = {
      userId,
      materialId,
      text: cleanText,
      parentPostId,
    };

    // TAMBAHKAN LOG INI UNTUK MELIHAT DATA FINAL
    console.log('--- SERVICE ---');
    console.log('Data yang akan disimpan ke DB:', newPostData);

    let newPost = await ForumPost.create(newPostData);

    if (parentPostId) {
      await ForumPost.findByIdAndUpdate(parentPostId, {
        $push: { replies: newPost._id },
      });
    }

    newPost = await newPost.populate({ path: 'userId', select: 'name' });

    return newPost;
  } catch (error) {
    console.error('Error creating forum post:', error);
    throw error;
  }
};

export const findPostsByMaterialId = async (materialId) => {
  try {
    // Opsi populate bertingkat untuk mengambil semua balasan dan nama penggunanya
    const populateOptions = {
      path: 'replies',
      populate: [
        { path: 'userId', select: 'name' }, // Ambil nama user dari balasan
        { path: 'replies' }, // Ambil balasan dari balasan (rekursif) - Mongoose akan handle ini
      ],
    };

    const posts = await ForumPost.find({
      materialId: materialId,
      parentPostId: null,
    })
      .populate({ path: 'userId', select: 'name' }) // Ambil nama user dari post utama
      .populate(populateOptions)
      .sort({ timestamp: 1 }); // Urutkan dari yang terlama

    return posts;
  } catch (error) {
    console.error('Error finding posts by material ID:', error);
    throw error;
  }
};

export const findPostsByUserId = async (userId) => {
  // Fungsi ini bisa disederhanakan jika tidak memerlukan buildQuery
  return ForumPost.find({ userId: userId }).populate({
    path: 'materialId',
    select: 'title',
  });
};
