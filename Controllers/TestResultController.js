import * as testResultService from '../services/testResultService.js';
import {
  getPaginationOptions,
  getSortOptions,
} from '../utils/queryFeatures.js';

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
    const options = {
      ...getPaginationOptions(req.query),
      sort: getSortOptions(req.query),
    };
    const testResults = await testResultService.findTestResultsByMaterialId(
      material._id,
      options
    );
    res.json(testResults);
  } catch (error) {
    next(error);
  }
};

export const getTestResultsByUserId = async (req, res, next) => {
  try {
    const user = req.profile;
    const options = {
      ...getPaginationOptions(req.query),
      sort: getSortOptions(req.query),
    };
    const testResults = await testResultService.findTestResultsByUserId(
      user._id,
      options
    );
    res.json(testResults);
  } catch (error) {
    next(error);
  }
};
