import test from 'node:test';
import assert from 'node:assert/strict';
import {
  evaluateMaterialCompletion,
  getMaterialRequirements,
} from '../services/enrollmentService.js';

test('material with quiz requires quiz, assignment, and forum activity', () => {
  const material = { testContent: [{ questionText: 'Q1' }] };
  const progress = {
    hasCompletedTest: true,
    hasSubmittedAssignment: true,
    forumPostCount: 2,
  };

  assert.deepEqual(getMaterialRequirements(material), {
    hasTest: true,
    requiresAssignment: true,
    requiredForumPosts: 2,
  });
  assert.equal(evaluateMaterialCompletion(progress, material), true);
});

test('material without quiz does not require test completion', () => {
  const material = { testContent: [] };
  const progress = {
    hasCompletedTest: false,
    hasSubmittedAssignment: true,
    forumPostCount: 2,
  };

  assert.equal(evaluateMaterialCompletion(progress, material), true);
});

test('material cannot complete before assignment and forum requirements', () => {
  const material = { testContent: [] };

  assert.equal(
    evaluateMaterialCompletion(
      { hasSubmittedAssignment: false, forumPostCount: 2 },
      material
    ),
    false
  );
  assert.equal(
    evaluateMaterialCompletion(
      { hasSubmittedAssignment: true, forumPostCount: 1 },
      material
    ),
    false
  );
});
