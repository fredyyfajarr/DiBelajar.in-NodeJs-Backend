import * as testResultService from '../services/testResultService.js';
import * as userService from '../services/userService.js';
import * as materialService from '../services/materialService.js';
import * as courseService from '../services/courseService.js';

export const createTestResult = async (req, res, next) => {
  try {
    const material = req.material;
    const userId = req.user._id;
    const { score, answers } = req.body;

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
    const material = req.material;
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
