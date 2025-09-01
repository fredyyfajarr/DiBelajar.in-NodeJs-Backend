import ForumPost from '../models/ForumPost.js';
import sanitizeHtml from 'sanitize-html';

export const createForumPost = async (userId, materialId, text) => {
  try {
    const cleanText = sanitizeHtml(text, {
      allowedTags: ['b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'ol', 'li'],
      allowedAttributes: {},
    });

    const newPost = await ForumPost.create({
      userId,
      materialId,
      text: cleanText,
    });
    return newPost;
  } catch (error) {
    console.error('Error creating forum post:', error);
    throw error;
  }
};

export const findPostsByMaterialId = async (materialId, options = {}) => {
  try {
    const sort = options.sort || '-completeAt';
    const skip = options.skip || 0;
    const limit = options.limit || 10;
    const posts = await ForumPost.find({ materialId })
      .sort(sort)
      .skip(skip)
      .limit(limit);
    return posts;
  } catch (error) {
    console.error('Error finding posts by material ID:', error);
    throw error;
  }
};

export const findPostsByUserId = async (userId, options = {}) => {
  try {
    const sort = options.sort || '-completeAt';
    const skip = options.skip || 0;
    const limit = options.limit || 10;
    const posts = await ForumPost.find({ userId })
      .sort(sort)
      .skip(skip)
      .limit(limit);
    return posts;
  } catch (error) {
    console.error('Error finding posts by user ID:', error);
    throw error;
  }
};
