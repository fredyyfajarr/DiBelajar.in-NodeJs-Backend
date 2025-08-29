import ForumPost from '../Models/ForumPost.js';

export const createForumPost = async (userId, materialId, text) => {
  try {
    const newPost = await ForumPost.create({
      userId,
      materialId,
      text,
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
