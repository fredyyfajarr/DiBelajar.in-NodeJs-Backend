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
    throw error;
  }
};

export const findPostsByMaterialId = async (materialId) => {
  try {
    const posts = await ForumPost.find({ materialId });
    return posts;
  } catch (error) {
    throw error;
  }
};

export const findPostsByUserId = async (userId) => {
  try {
    const posts = await ForumPost.find({ userId });
    return posts;
  } catch (error) {
    throw error;
  }
};
