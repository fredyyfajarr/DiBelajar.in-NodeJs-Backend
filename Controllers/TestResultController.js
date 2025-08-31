import * as testResultService from '../Services/testResultService.js';
import * as userService from '../Services/userService.js';
import * as materialService from '../Services/materialService.js';
import * as courseService from '../Services/courseService.js';

export const createTestResult = async (req, res, next) => {
  try {
    const { materialIdOrSlug, courseIdOrSlug } = req.params;
    const { score, answers } = req.body;
    const userId = req.user._id;
    // const user = await userService.findUserById(userIdOrSlug);
    // if (!user) {
    //   return res.status(404).json({ error: 'User not found' });
    // }

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

    const newTestResult = await testResultService.createTestResult(
      userId,
      material._id,
      score,
      answers
    );
    res.status(201).json(newTestResult);
  } catch (error) {
    next(error);
  }
};

export const getTestResultsByMaterialId = async (req, res, next) => {
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

    const testResults = await testResultService.findTestResultsByMaterialId(
      material._id
    );
    res.json(testResults);
  } catch (error) {
    next(error);
  }
};

export const getTestResultsByUserId = async (req, res, next) => {
  try {
    const { userIdOrSlug } = req.params;
    const user = await userService.findUserById(userIdOrSlug);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const testResults = await testResultService.findTestResultsByUserId(
      user._id
    );
    res.json(testResults);
  } catch (error) {
    next(error);
  }
};
