import { expect, test } from 'vitest';
import { testRun } from './helpers';

test(
  'Should be able to protect urls with jwt',
  testRun(1000, async ({ get, app }) => {
    await expect(app.inject('/named-lists')).resolves.toHaveProperty('statusCode', 401);
    await expect(get('/named-lists')).resolves.toHaveProperty('statusCode', 200);
  }),
);
