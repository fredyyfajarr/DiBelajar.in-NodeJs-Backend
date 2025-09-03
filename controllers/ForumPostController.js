import * as forumPostService from '../services/forumPostService.js';

export const createForumPost = async (req, res, next) => {
  try {
    const material = req.material;
    const userId = req.user._id;
    // PERBAIKAN: Ambil 'parentPostId' dari request body
    const { text, parentPostId } = req.body;

    const newPost = await forumPostService.createForumPost(
      userId,
      material._id,
      text,
      parentPostId // Teruskan 'parentPostId' ke service
    );
    res.status(201).json(newPost);
  } catch (error) {
    next(error);
  }
};

export const getPostsByMaterialId = async (req, res, next) => {
  try {
    const posts = await forumPostService.findPostsByMaterialId(
      req.material._id,
      req.query
    );
    res.status(200).json({
      success: true,
      data: posts,
    });
  } catch (error) {
    next(error);
  }
};

export const getPostsByUserId = async (req, res, next) => {
  try {
    const posts = await forumPostService.findPostsByUserId(
      req.profile._id,
      req.query
    );
    res.status(200).json({
      success: true,
      data: posts,
    });
  } catch (error) {
    next(error);
  }
};
