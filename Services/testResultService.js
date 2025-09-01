import TestResult from '../models/TestResult.js';
import { buildQuery } from '../utils/queryFeatures.js';

export const createTestResult = async (userId, materialId, score, answers) => {
  try {
    const newTestResult = await TestResult.create({
      userId,
      materialId,
      score,
      answers,
    });
    return newTestResult;
  } catch (error) {
    console.error('Error creating test result:', error);
    throw error;
  }
};

export const findTestResultsByMaterialId = async (materialId, options = {}) => {
  try {
    return await buildQuery(TestResult, options, { materialId });
  } catch (error) {
    console.error('Error finding test results by material ID:', error);
    throw error;
  }
};

export const findTestResultsByUserId = async (userId, options = {}) => {
  try {
    return await buildQuery(TestResult, options, { userId });
  } catch (error) {
    console.error('Error finding test results by user ID:', error);
    throw error;
  }
};
