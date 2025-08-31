import * as forumPostService from '../services/forumPostService.js';
import * as userService from '../services/userService.js';
import * as courseService from '../services/courseService.js';
import * as materialService from '../services/materialService.js';

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
    const posts = await forumPostService.findPostsByMaterialId(material._id);
    res.json(posts);
  } catch (error) {
    next(error);
  }
};

export const getPostsByUserId = async (req, res, next) => {
  try {
    const { userIdOrSlug } = req.params;
    const user = await userService.findUserById(userIdOrSlug);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const posts = await forumPostService.findPostsByUserId(user._id);
    res.json(posts);
  } catch (error) {
    next(error);
  }
};
