import * as forumPostService from '../Services/forumPostService.js';

export const createForumPost = async (req, res, next) => {
  try {
    const { materialId } = req.params;
    const { userId, text } = req.body;
    const newPost = await forumPostService.createForumPost(
      userId,
      materialId,
      text
    );
    res.status(201).json(newPost);
  } catch (error) {
    next(error);
  }
};

export const getPostsByMaterialId = async (req, res, next) => {
  try {
    const { materialId } = req.params;
    const posts = await forumPostService.findPostsByMaterialId(materialId);
    res.json(posts);
  } catch (error) {
    next(error);
  }
};

export const getPostsByUserId = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const posts = await forumPostService.findPostsByUserId(userId);
    res.json(posts);
  } catch (error) {
    next(error);
  }
};
