import ForumPost from '../models/ForumPost.js';
import sanitizeHtml from 'sanitize-html';
import { buildQuery } from '../utils/queryFeatures.js';

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
    return await buildQuery(ForumPost, options, { materialId });
  } catch (error) {
    console.error('Error finding posts by material ID:', error);
    throw error;
  }
};

export const findPostsByUserId = async (userId, options = {}) => {
  try {
    return await buildQuery(ForumPost, options, { userId });
  } catch (error) {
    console.error('Error finding posts by user ID:', error);
    throw error;
  }
};
