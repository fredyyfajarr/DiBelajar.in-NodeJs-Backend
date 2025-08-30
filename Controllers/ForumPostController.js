import * as forumPostService from '../Services/forumPostService.js';
import * as userService from '../Services/userService.js';
import * as courseService from '../Services/courseService.js';
import * as materialService from '../Services/materialService.js';

export const createForumPost = async (req, res, next) => {
  try {
    const { materialIdOrSlug, courseIdOrSlug } = req.params;
    const { userIdOrSlug, text } = req.body;

    const user = await userService.findUserById(userIdOrSlug);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const course = await courseService.findCourseById(courseIdOrSlug);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const material = await materialService.findMaterialById(
      materialIdOrSlug,
      course._id
    );
    if (!material) {
      return res.status(404).json({ error: 'Material not found' });
    }

    const newPost = await forumPostService.createForumPost(
      user._id,
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
    const { materialIdOrSlug, courseIdOrSlug } = req.params;

    const course = await courseService.findCourseById(courseIdOrSlug);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const material = await materialService.findMaterialById(
      materialIdOrSlug,
      course._id
    );
    if (!material) {
      return res.status(404).json({ error: 'Material not found' });
    }

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
