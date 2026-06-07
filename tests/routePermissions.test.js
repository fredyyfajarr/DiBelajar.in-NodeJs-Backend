import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const readRoute = (routeFile) =>
  readFileSync(path.join(rootDir, 'routes', routeFile), 'utf8');

test('global enrollment listing is admin-only', () => {
  const source = readRoute('enrollmentRouter.js');

  assert.match(source, /protect,\s*authorize\('admin'\)/);
  assert.doesNotMatch(source, /authorize\('admin',\s*'instructor'\)/);
});

test('global material routes are staff-only', () => {
  const source = readRoute('materialRouter.js');
  const staffOnlyMatches = source.match(/authorize\('admin',\s*'instructor'\)/g);

  assert.equal(staffOnlyMatches?.length, 2);
});

test('course enrollment is limited to students', () => {
  const source = readRoute('courseRouter.js');

  assert.match(
    source,
    /\.post\(protect,\s*authorize\('student'\),\s*loadCourse,\s*enrollInCourse\)/
  );
});
