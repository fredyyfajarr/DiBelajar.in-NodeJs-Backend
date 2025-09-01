import * as forumPostService from '../services/forumPostService.js';
import {
  getPaginationOptions,
  getSortOptions,
} from '../utils/queryFeatures.js';

export const createForumPost = async (req, res, next) => {
  try {
    const material = req.material;
    const userId = req.user._id;
    const { text } = req.body;

    const newPost = await forumPostService.createForumPost(
      userId,
      material._id,
      text
    );
    res.status(201).json(newPost);
  } catch (error) {
    next(error);
  }
};

export const getPostsByMaterialId = async (req, res, next) => {
  try {
    const material = req.material;
    const options = {
      ...getPaginationOptions(req.query),
      sort: getSortOption(req.query),
    };
    const posts = await forumPostService.findPostsByMaterialId(
      material._id,
      options
    );
    res.json(posts);
  } catch (error) {
    next(error);
  }
};

export const getPostsByUserId = async (req, res, next) => {
  try {
    const user = req.profile;
    const options = {
      ...getPaginationOptions(req.query),
      sort: getSortOptions(req.query),
    };
    const posts = await forumPostService.findPostsByUserId(user._id, options);
    res.json(posts);
  } catch (error) {
    next(error);
  }
};
